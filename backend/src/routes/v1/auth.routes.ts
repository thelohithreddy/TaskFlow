import { Router } from 'express';
import { authController } from '../../controllers/Auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import {
  registerValidator,
  loginValidator,
  refreshValidator,
} from '../../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post('/register', registerValidator, validate, asyncHandler(authController.register));
router.post('/login', loginValidator, validate, asyncHandler(authController.login));
router.post('/refresh', refreshValidator, validate, asyncHandler(authController.refresh));
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.me));

export default router;
