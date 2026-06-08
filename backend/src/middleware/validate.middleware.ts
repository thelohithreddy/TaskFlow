import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: 'path' in err ? String(err.path) : 'unknown',
      message: err.msg,
    }));
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', formattedErrors));
  }
  next();
};
