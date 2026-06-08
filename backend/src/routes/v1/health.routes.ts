import { Router } from 'express';
import { healthController } from '../../controllers/Health.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Service health monitoring
 */

router.get('/', healthController.check);

export default router;
