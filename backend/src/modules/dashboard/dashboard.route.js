import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { dashboardController } from './dashboard.controller.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Dashboard overview KPIs and charts
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/overview', authorize('dashboard:read'), dashboardController.overview);

export default router;
