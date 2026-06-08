import { Response } from 'express';
import { ApiResponse, PaginatedData } from '../types/api.types';

export class ResponseHandler {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200): Response {
    const response: ApiResponse<T> = { success: true, message, data };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: PaginatedData<T>,
    statusCode = 200
  ): Response {
    const response: ApiResponse<PaginatedData<T>> = { success: true, message, data };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    const response: ApiResponse = { success: false, message, errors };
    return res.status(statusCode).json(response);
  }
}
