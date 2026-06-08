import { Request, Response, NextFunction } from 'express';
import { Role } from '../constants/roles';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, 'Insufficient permissions'));
    }

    next();
  };
};
