import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { goodsReceiptController } from './goodsReceipt.controller.js';
import {
  listGoodsReceiptsSchema,
  goodsReceiptIdSchema,
  createGoodsReceiptSchema,
  updateGoodsReceiptSchema,
} from './goodsReceipt.validation.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Goods Receipts
 *   description: Quản lý phiếu nhập kho
 */

router.get(
  '/',
  authorize('goods-receipt:read'),
  validate(listGoodsReceiptsSchema),
  goodsReceiptController.list
);

router.get(
  '/:id',
  authorize('goods-receipt:read'),
  validate(goodsReceiptIdSchema),
  goodsReceiptController.getById
);

router.post(
  '/',
  authorize('goods-receipt:create'),
  validate(createGoodsReceiptSchema),
  goodsReceiptController.create
);

router.put(
  '/:id',
  authorize('goods-receipt:update'),
  validate(updateGoodsReceiptSchema),
  goodsReceiptController.update
);

router.post(
  '/:id/confirm',
  authorize('goods-receipt:update'),
  validate(goodsReceiptIdSchema),
  goodsReceiptController.confirm
);

router.post(
  '/:id/cancel',
  authorize('goods-receipt:update'),
  validate(goodsReceiptIdSchema),
  goodsReceiptController.cancel
);

router.delete(
  '/:id',
  authorize('goods-receipt:delete'),
  validate(goodsReceiptIdSchema),
  goodsReceiptController.remove
);

export default router;
