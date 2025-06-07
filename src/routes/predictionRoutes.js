// File: src/routes/predictionRoutes.js
const Joi = require('@hapi/joi');
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/auth');

const predictionRoutes = [
  {
    method: 'POST',
    path: '/api/predict',
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        payload: Joi.object({
          image: Joi.string().base64().required(),
          originalName: Joi.string().default('image.jpg')
        })
      },
      payload: {
        maxBytes: 10485760, // 10MB
        timeout: 30000 // 30 seconds
      }
    },
    handler: predictionController.predict
  }
];

module.exports = predictionRoutes;