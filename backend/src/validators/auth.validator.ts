import { body } from 'express-validator';
import { ROLE_VALUES } from '../constants/roles';

export const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').optional().isIn(ROLE_VALUES).withMessage('Invalid role'),
];

export const loginValidator = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];
