import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { goodsIssueController } from './goodsIssue.controller.js';
import {
  listGoodsIssuesSchema,
  goodsIssueIdSchema,
  createGoodsIssueSchema,
  updateGoodsIssueSchema,
} from './goodsIssue.validation.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Goods Issues
 *   description: Quản lý phiếu xuất kho
 */

router.get('/', authorize('goods-issue:read'), validate(listGoodsIssuesSchema), goodsIssueController.list);
router.get('/:id', authorize('goods-issue:read'), validate(goodsIssueIdSchema), goodsIssueController.getById);
router.post('/', authorize('goods-issue:create'), validate(createGoodsIssueSchema), goodsIssueController.create);
router.put('/:id', authorize('goods-issue:update'), validate(updateGoodsIssueSchema), goodsIssueController.update);
router.post(
  '/:id/confirm',
  authorize('goods-issue:update'),
  validate(goodsIssueIdSchema),
  goodsIssueController.confirm
);
router.post(
  '/:id/cancel',
  authorize('goods-issue:update'),
  validate(goodsIssueIdSchema),
  goodsIssueController.cancel
);
router.delete('/:id', authorize('goods-issue:delete'), validate(goodsIssueIdSchema), goodsIssueController.remove);

export default router;
