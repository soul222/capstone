// File: src/app.js
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

// Routes
const authRoutes = require('./routes/authRoutes');
const motifRoutes = require('./routes/motifRoutes');
const historyRoutes = require('./routes/historyRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Ubah sesuai kebutuhan production
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      files: {
        relativeTo: __dirname
      }
    }
  });

  // Register plugins
  await server.register([
    Inert
  ]);

  // Register routes
  server.route([
    ...authRoutes,
    ...motifRoutes,
    ...historyRoutes,
    ...predictionRoutes
  ]);

  // Global error handler
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    
    if (response.isBoom) {
      const error = response;
      const statusCode = error.output.statusCode;
      
      // Log error untuk debugging
      console.error('API Error:', {
        statusCode,
        message: error.message,
        stack: error.stack,
        path: request.path,
        method: request.method
      });

      // Customize error response
      return h.response({
        status: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error.stack,
          details: error.data 
        })
      }).code(statusCode);
    }

    return h.continue;
  });

  // Health check endpoint
  server.route({
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return {
        status: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      };
    }
  });

  // Root endpoint
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        status: true,
        message: 'Batik Prediction API',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          motif: '/api/motif',
          history: '/api/history',
          prediction: '/api/predict'
        }
      };
    }
  });

  return server;
};

module.exports = init();