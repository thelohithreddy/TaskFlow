import { Router } from 'express';
import authRoutes from './v1/auth.routes';
import userRoutes from './v1/user.routes';
import taskRoutes from './v1/task.routes';
import adminRoutes from './v1/admin.routes';
import healthRoutes from './v1/health.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);

export default router;
