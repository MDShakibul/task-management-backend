import mysql from 'mysql2/promise';
import config from '../config/index.js';
import { errorlogger, logger } from '../shared/logger.js';

let pool;

export async function connectToDatabase() {
  try {
    // Create a pool of connections to the MySQL database
    pool = mysql.createPool({
      host: config.database_host,
      user: config.database_user,
      password: config.database_password,
      database: config.database_name,
      waitForConnections: true,
      connectionLimit: 300, // Maximum number of connections in the pool
      queueLimit: 0, // Unlimited waiting queue for connections
    });

    logger.info('Database connected successfully');
    // Optional: log pool statistics for debugging
    logger.info(
        `Pool Status - Active Connections: ${pool.pool?.connections?.length || 0}, Idle Connections: ${
          pool.pool?.available || 0
        }`
      );
    

    return pool; // Return the pool for use elsewhere
  } catch (error) {
    errorlogger.error('Failed to connect to the database:', error);
    process.exit(1); // Exit process if connection fails
  }
}

export async function closeDatabasePool() {
  if (pool) {
    try {
      await pool.end(); // Closes all the connections in the pool
      logger.info('Database pool closed successfully');
    } catch (error) {
      errorlogger.error('Error while closing database pool:', error);
    }
  } else {
    logger.warn('No database pool to close');
  }
}

export function getConnection() {
  if (!pool) {
    throw new Error(
      'Database pool has not been established. Call connectToDatabase first.'
    );
  }
  return pool.getConnection(); // Get a connection from the pool
}
