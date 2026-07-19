import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function startServer() {
  try {
    await connectDatabase();
    logger.info('Database connected');

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
      logger.info(`API: http://localhost:${env.PORT}${env.API_PREFIX}`);
      logger.info(`Swagger: http://localhost:${env.PORT}/api-docs`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received, shutting down...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
