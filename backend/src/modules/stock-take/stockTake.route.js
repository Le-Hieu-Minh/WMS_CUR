import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { stockTakeController } from './stockTake.controller.js';
import {
  listStockTakesSchema,
  stockTakeIdSchema,
  createStockTakeSchema,
  updateStockTakeSchema,
  warehouseProductsSchema,
} from './stockTake.validation.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Stock Takes
 *   description: Quản lý phiếu kiểm kê
 */

router.get('/', authorize('stock-take:read'), validate(listStockTakesSchema), stockTakeController.list);
router.get(
  '/meta/warehouse-products',
  authorize('stock-take:create', 'stock-take:update'),
  validate(warehouseProductsSchema),
  stockTakeController.warehouseProducts
);
router.get('/:id', authorize('stock-take:read'), validate(stockTakeIdSchema), stockTakeController.getById);
router.post('/', authorize('stock-take:create'), validate(createStockTakeSchema), stockTakeController.create);
router.put('/:id', authorize('stock-take:update'), validate(updateStockTakeSchema), stockTakeController.update);
router.post(
  '/:id/confirm',
  authorize('stock-take:update'),
  validate(stockTakeIdSchema),
  stockTakeController.confirm
);
router.post(
  '/:id/cancel',
  authorize('stock-take:update'),
  validate(stockTakeIdSchema),
  stockTakeController.cancel
);
router.delete('/:id', authorize('stock-take:delete'), validate(stockTakeIdSchema), stockTakeController.remove);

export default router;
