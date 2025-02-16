import app from './app.js';
import config from './config/index.js';
import { closeDatabasePool, connectToDatabase } from './helpers/db.js';

let server;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	errorconsole.log('Uncaught Exception:', error);
	process.exit(1);
});

// Start the server after connecting to the database
(async () => {
	try {
		await connectToDatabase(); // Initialize the connection pool

		// Start the server
		server = app.listen(config.port, () => {
			console.log(`Application listening on port ${config.port}`);
		});
	} catch (error) {
		errorconsole.log('Failed to start the server:', error);
		process.exit(1);
	}
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
	errorconsole.log('Unhandled Rejection:', error);
	if (server) {
		server.close(async () => {
			console.log('Server is shutting down due to unhandled rejection');
			await closeDatabasePool(); // Close database pool gracefully
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});

// Gracefully handle SIGTERM
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	if (server) {
		server.close(async () => {
			console.log('Server closed');
			await closeDatabasePool(); // Close database pool gracefully
		});
	}
});
