    // File: src/controllers/predictionController.js
const predictionService = require('../services/predictionService');
const Boom = require('@hapi/boom');

class PredictionController {
  async predict(request, h) {
    try {
      const { image } = request.payload;
      const userId = request.auth.user.id;

      if (!image) {
        throw Boom.badRequest('Image file is required');
      }

      const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const { success, message, confidence, threshold } = await predictionService.predict(imageBuffer, userId, request.payload.originalName);

      return h.response({
        status: success,
        message,
        data: {
          confidence,
          threshold
        }
      }).code(success ? 200 : 400);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PredictionController();