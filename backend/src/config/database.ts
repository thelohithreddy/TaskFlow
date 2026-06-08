import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDatabase = async (): Promise<void> => {
  let retries = 0;

  const connect = async (): Promise<void> => {
    try {
      await mongoose.connect(env.MONGODB_URI);
      logger.info('MongoDB connected successfully');
    } catch (error) {
      retries += 1;
      logger.error(`MongoDB connection failed (attempt ${retries}/${MAX_RETRIES})`, { error });

      if (retries >= MAX_RETRIES) {
        logger.error('Max MongoDB connection retries exceeded. Exiting.');
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connect();
    }
  };

  await connect();

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
};

export const getDatabaseStatus = (): 'connected' | 'disconnected' | 'connecting' => {
  const state = mongoose.connection.readyState;
  if (state === 1) return 'connected';
  if (state === 2) return 'connecting';
  return 'disconnected';
};
