import { param, query } from 'express-validator';

export const objectIdParam = (name: string) =>
  param(name).isMongoId().withMessage(`Invalid ${name}`);

export const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];
