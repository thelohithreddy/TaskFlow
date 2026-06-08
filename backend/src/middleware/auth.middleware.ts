import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/Token.service';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access token required');
    }

    const token = authHeader.split(' ')[1];
    const payload = tokenService.verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
