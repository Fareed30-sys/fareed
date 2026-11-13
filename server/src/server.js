import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  🌾 AgroAI Agriculture Advisory Backend Server`);
  console.log(`  🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  📡 Running on : http://localhost:${PORT}`);
  console.log(`  🔗 API Root   : http://localhost:${PORT}/api/v1`);
  console.log(`  🩺 Health     : http://localhost:${PORT}/api/v1/health`);
  console.log(`===============================================`);
});

// Graceful Shutdown Handling
const handleTermination = (signal) => {
  console.log(`[SERVER] Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.log('[SERVER] Closed out remaining connections.');
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections hang
  setTimeout(() => {
    console.error('[SERVER] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleTermination('SIGTERM'));
process.on('SIGINT', () => handleTermination('SIGINT'));

