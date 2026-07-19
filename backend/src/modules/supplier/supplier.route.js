import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { supplierController } from './supplier.controller.js';
import {
  listSuppliersSchema,
  supplierIdSchema,
  createSupplierSchema,
  updateSupplierSchema,
  changeSupplierStatusSchema,
} from './supplier.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('supplier:read'), validate(listSuppliersSchema), supplierController.list);
router.get('/:id', authorize('supplier:read'), validate(supplierIdSchema), supplierController.getById);
router.post('/', authorize('supplier:create'), validate(createSupplierSchema), supplierController.create);
router.put('/:id', authorize('supplier:update'), validate(updateSupplierSchema), supplierController.update);
router.patch(
  '/:id/status',
  authorize('supplier:update'),
  validate(changeSupplierStatusSchema),
  supplierController.changeStatus
);
router.delete('/:id', authorize('supplier:delete'), validate(supplierIdSchema), supplierController.softDelete);

export default router;
