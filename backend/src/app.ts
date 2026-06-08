import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { corsMiddleware } from './config/cors';
import { generalLimiter, authLimiter } from './config/rateLimit';
import { morganStream } from './config/logger';
import { setupSwagger } from './config/swagger';
import routes from './routes';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(corsMiddleware);
  app.use(generalLimiter);
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(mongoSanitize());

  app.use(
    morgan(':method :url :status :response-time ms', { stream: morganStream })
  );

  setupSwagger(app);

  app.use('/api/v1/auth', authLimiter);
  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
