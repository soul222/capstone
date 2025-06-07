// File: server.js
require('dotenv').config();
const app = require('./src/app');

const init = async () => {
  try {
    await app.start();
    console.log('🚀 Server running on %s', app.info.uri);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

// Handle process termination gracefully
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await app.stop();
  process.exit(0);
});

init();