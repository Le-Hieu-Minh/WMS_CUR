import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { reportController } from './report.controller.js';

const router = Router();
router.use(authenticate);

const TYPES = 'inventory|stock-value|goods-receipts|goods-issues|stock-takes|stock-adjustments';

router.get(`/:type(${TYPES})/export`, authorize('report:export'), reportController.export);
router.get(`/:type(${TYPES})`, authorize('report:read'), reportController.get);

export default router;
