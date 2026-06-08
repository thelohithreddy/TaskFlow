import { Request, Response } from 'express';
import { getDatabaseStatus } from '../config/database';
import { ResponseHandler } from '../utils/ApiResponse';

const startTime = Date.now();

export class HealthController {
  check = (_req: Request, res: Response): void => {
    const dbStatus = getDatabaseStatus();
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    ResponseHandler.success(res, 'Service is healthy', {
      status: 'ok',
      database: dbStatus,
      uptime,
      timestamp: new Date().toISOString(),
    });
  };
}

export const healthController = new HealthController();
