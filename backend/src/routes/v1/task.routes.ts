import { Router } from 'express';
import { taskController } from '../../controllers/Task.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { objectIdParam } from '../../validators/common.validator';
import {
  createTaskValidator,
  updateTaskValidator,
  taskQueryValidator,
} from '../../validators/task.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

router.use(authenticate);

router.post('/', createTaskValidator, validate, asyncHandler(taskController.create));
router.get('/', taskQueryValidator, validate, asyncHandler(taskController.getAll));
router.get('/:id', objectIdParam('id'), validate, asyncHandler(taskController.getById));
router.patch('/:id', objectIdParam('id'), updateTaskValidator, validate, asyncHandler(taskController.update));
router.delete('/:id', objectIdParam('id'), validate, asyncHandler(taskController.delete));

export default router;
