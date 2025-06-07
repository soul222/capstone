// File: src/services/predictionService.js
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const { data, classLabels, classToKey } = require('../data/dictionary');
const s3Service = require('./s3Service');
const supabase = require('../config/supabase');
const Boom = require('@hapi/boom');

class PredictionService {
  constructor() {
    this.model = null;
    this.modelUrl = process.env.TFJS_MODEL_URL;
    this.confidenceThreshold = 0.7; // 70% confidence threshold
  }

  async loadModel() {
    try {
      if (!this.model) {
        console.log('Loading TensorFlow.js model...');
        this.model = await tf.loadLayersModel(this.modelUrl);
        console.log('Model loaded successfully');
      }
      return this.model;
    } catch (error) {
      console.error('Model loading error:', error);
      throw Boom.internal('Failed to load prediction model');
    }
  }

  async preprocessImage(imageBuffer) {
    try {
      // Resize image to 224x224 using sharp
      const resizedBuffer = await sharp(imageBuffer)
        .resize(224, 224)
        .jpeg({ quality: 90 })
        .toBuffer();

      // Convert to tensor
      const imageTensor = tf.node.decodeImage(resizedBuffer, 3)
        .expandDims(0)
        .cast('float32')
        .div(255.0); // Normalize to [0,1]

      return imageTensor;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw Boom.badRequest('Failed to process image');
    }
  }

  async predict(imageBuffer, userId, originalFileName) {
    try {
      // Load model if not already loaded
      await this.loadModel();

      // Preprocess image
      const imageTensor = await this.preprocessImage(imageBuffer);

      // Make prediction
      const predictions = await this.model.predict(imageTensor);
      const predictionData = await predictions.data();
      
      // Get predicted class
      const predictedIndex = predictions.argMax(-1).dataSync()[0];
      const confidence = predictionData[predictedIndex];
      const predictedClass = classLabels[predictedIndex];
      
      // Clean up tensors
      imageTensor.dispose();
      predictions.dispose();

      // Check confidence threshold
      if (confidence < this.confidenceThreshold) {
        return {
          success: false,
          message: 'Gambar yang diupload kemungkinan bukan batik atau tingkat kepercayaan prediksi terlalu rendah',
          confidence: Math.round(confidence * 100),
          threshold: Math.round(this.confidenceThreshold * 100)
        };
      }

      // Get motif data
      const motifKey = classToKey[predictedClass];
      const motifData = data[motifKey];

      if (!motifData) {
        throw Boom.internal('Motif data not found for predicted class');
      }

      // Upload image to S3
      const uploadResult = await s3Service.uploadImage(imageBuffer, originalFileName, userId);

      // Save to database
      const historyData = {
        user_id: userId,
        motif_id: motifKey,
        motif_name: motifData.name,
        provinsi: motifData.provinsi,
        description: motifData.description,
        occasion: motifData.occasion,
        confidence_score: Math.round(confidence * 100),
        image_url: uploadResult.url
      };

      const { data: savedHistory, error: dbError } = await supabase
        .from('scan_histories')
        .insert(historyData)
        .select()
        .single();

      if (dbError) {
        console.error('Database save error:', dbError);
        // Delete uploaded image if database save fails
        await s3Service.deleteImage(uploadResult.key);
        throw Boom.internal('Failed to save prediction history');
      }

      return {
        success: true,
        prediction: {
          motif_id: motifKey,
          motif_name: motifData.name,
          provinsi: motifData.provinsi,
          confidence: Math.round(confidence * 100),
          predicted_class: predictedClass
        },
        motif_data: motifData,
        image_url: uploadResult.url,
        history_id: savedHistory.id
      };

    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Prediction error:', error);
      throw Boom.internal('Prediction failed');
    }
  }

  async getPredictionHistory(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { data: histories, error, count } = await supabase
        .from('scan_histories')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get history error:', error);
        throw Boom.internal('Failed to get prediction history');
      }

      return {
        data: histories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: offset + limit < count,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Get prediction history error:', error);
      throw Boom.internal('Failed to get prediction history');
    }
  }

  async deleteHistory(historyId, userId) {
    try {
      // Get history data first to get image URL
      const { data: history, error: getError } = await supabase
        .from('scan_histories')
        .select('image_url')
        .eq('id', historyId)
        .eq('user_id', userId)
        .single();

      if (getError || !history) {
        throw Boom.notFound('History not found');
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('scan_histories')
        .delete()
        .eq('id', historyId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Delete history error:', deleteError);
        throw Boom.internal('Failed to delete history');
      }

      // Delete image from S3 (extract key from URL)
      if (history.image_url) {
        try {
          const key = history.image_url.split('.amazonaws.com/')[1];
          await s3Service.deleteImage(key);
        } catch (s3Error) {
          console.error('S3 delete error (non-critical):', s3Error);
          // Don't throw error if S3 delete fails
        }
      }

      return { message: 'History deleted successfully' };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Delete history error:', error);
      throw Boom.internal('Failed to delete history');
    }
  }
}

module.exports = new PredictionService();