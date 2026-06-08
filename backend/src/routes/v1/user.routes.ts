import { Router } from 'express';
import { userController } from '../../controllers/User.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import {
  updateProfileValidator,
  changePasswordValidator,
} from '../../validators/user.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

router.use(authenticate);

router.get('/profile', asyncHandler(userController.getProfile));
router.patch('/profile', updateProfileValidator, validate, asyncHandler(userController.updateProfile));
router.patch('/change-password', changePasswordValidator, validate, asyncHandler(userController.changePassword));

export default router;
