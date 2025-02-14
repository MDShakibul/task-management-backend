import app from './app.js';
import config from './config/index.js';
import { connectToDatabase, closeDatabasePool } from './helpers/db.js';
import { logger, errorlogger } from './shared/logger.js';

let server;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  errorlogger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server after connecting to the database
(async () => {
  try {
    await connectToDatabase(); // Initialize the connection pool

    // Start the server
    server = app.listen(config.port, () => {
      logger.info(`Application listening on port ${config.port}`);
    });
  } catch (error) {
    errorlogger.error('Failed to start the server:', error);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  errorlogger.error('Unhandled Rejection:', error);
  if (server) {
    server.close(async () => {
      logger.info('Server is shutting down due to unhandled rejection');
      await closeDatabasePool(); // Close database pool gracefully
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Gracefully handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  if (server) {
    server.close(async () => {
      logger.info('Server closed');
      await closeDatabasePool(); // Close database pool gracefully
    });
  }
});
