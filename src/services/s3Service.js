// File: src/services/s3Service.js
const { s3, bucketName } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');
const Boom = require('@hapi/boom');

class S3Service {
  async uploadImage(buffer, originalName, userId) {
    try {
      const fileExtension = originalName.split('.').pop();
      const fileName = `predictions/${userId}/${Date.now()}-${uuidv4()}.${fileExtension}`;
      
      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${fileExtension}`,
        ACL: 'public-read' // Make file publicly accessible
      };

      const result = await s3.upload(uploadParams).promise();
      
      return {
        url: result.Location,
        key: result.Key,
        fileName
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw Boom.internal('Failed to upload image to S3');
    }
  }

  async deleteImage(key) {
    try {
      const deleteParams = {
        Bucket: bucketName,
        Key: key
      };

      await s3.deleteObject(deleteParams).promise();
      
      return { message: 'Image deleted successfully' };
    } catch (error) {
      console.error('S3 delete error:', error);
      throw Boom.internal('Failed to delete image from S3');
    }
  }

  async generatePresignedUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
        Expires: expiresIn
      };

      const url = await s3.getSignedUrlPromise('getObject', params);
      
      return { url };
    } catch (error) {
      console.error('S3 presigned URL error:', error);
      throw Boom.internal('Failed to generate presigned URL');
    }
  }

  getPublicUrl(key) {
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}

module.exports = new S3Service();