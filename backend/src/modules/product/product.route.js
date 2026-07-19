import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { productController } from './product.controller.js';
import {
  listProductsSchema,
  productIdSchema,
  createProductSchema,
  updateProductSchema,
  changeProductStatusSchema,
} from './product.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('product:read'), validate(listProductsSchema), productController.list);
router.get('/:id', authorize('product:read'), validate(productIdSchema), productController.getById);
router.post('/', authorize('product:create'), validate(createProductSchema), productController.create);
router.put('/:id', authorize('product:update'), validate(updateProductSchema), productController.update);
router.patch(
  '/:id/status',
  authorize('product:update'),
  validate(changeProductStatusSchema),
  productController.changeStatus
);
router.delete('/:id', authorize('product:delete'), validate(productIdSchema), productController.softDelete);

export default router;
