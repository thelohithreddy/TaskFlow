import { Router } from 'express';
import { adminController } from '../../controllers/Admin.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { objectIdParam, paginationQuery } from '../../validators/common.validator';
import { ROLES } from '../../constants/roles';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin platform management
 */

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/users', paginationQuery, validate, asyncHandler(adminController.getUsers));
router.delete('/users/:id', objectIdParam('id'), validate, asyncHandler(adminController.deleteUser));
router.get('/tasks', paginationQuery, validate, asyncHandler(adminController.getTasks));
router.get('/analytics', asyncHandler(adminController.getAnalytics));
router.get('/audit-logs', paginationQuery, validate, asyncHandler(adminController.getAuditLogs));

export default router;
