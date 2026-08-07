import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { stockAdjustmentController } from './stockAdjustment.controller.js';
import {
  listStockAdjustmentsSchema,
  stockAdjustmentIdSchema,
  createStockAdjustmentSchema,
  updateStockAdjustmentSchema,
} from './stockAdjustment.validation.js';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Stock Adjustments
 *   description: Quản lý phiếu điều chỉnh tồn kho
 */

router.get('/', authorize('stock-adjustment:read'), validate(listStockAdjustmentsSchema), stockAdjustmentController.list);
router.get('/:id', authorize('stock-adjustment:read'), validate(stockAdjustmentIdSchema), stockAdjustmentController.getById);
router.post('/', authorize('stock-adjustment:create'), validate(createStockAdjustmentSchema), stockAdjustmentController.create);
router.put('/:id', authorize('stock-adjustment:update'), validate(updateStockAdjustmentSchema), stockAdjustmentController.update);
router.post('/:id/confirm', authorize('stock-adjustment:update'), validate(stockAdjustmentIdSchema), stockAdjustmentController.confirm);
router.post('/:id/cancel', authorize('stock-adjustment:update'), validate(stockAdjustmentIdSchema), stockAdjustmentController.cancel);
router.delete('/:id', authorize('stock-adjustment:delete'), validate(stockAdjustmentIdSchema), stockAdjustmentController.remove);

export default router;
