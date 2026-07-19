import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { warehouseController } from './warehouse.controller.js';
import {
  listWarehousesSchema,
  warehouseIdSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
  changeWarehouseStatusSchema,
} from './warehouse.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('warehouse:read'), validate(listWarehousesSchema), warehouseController.list);
router.get('/:id', authorize('warehouse:read'), validate(warehouseIdSchema), warehouseController.getById);
router.post('/', authorize('warehouse:create'), validate(createWarehouseSchema), warehouseController.create);
router.put('/:id', authorize('warehouse:update'), validate(updateWarehouseSchema), warehouseController.update);
router.patch(
  '/:id/status',
  authorize('warehouse:update'),
  validate(changeWarehouseStatusSchema),
  warehouseController.changeStatus
);
router.delete('/:id', authorize('warehouse:delete'), validate(warehouseIdSchema), warehouseController.softDelete);

export default router;
