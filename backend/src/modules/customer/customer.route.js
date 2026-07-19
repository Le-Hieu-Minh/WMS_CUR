import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { customerController } from './customer.controller.js';
import {
  listCustomersSchema,
  customerIdSchema,
  createCustomerSchema,
  updateCustomerSchema,
  changeCustomerStatusSchema,
} from './customer.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('customer:read'), validate(listCustomersSchema), customerController.list);
router.get('/:id', authorize('customer:read'), validate(customerIdSchema), customerController.getById);
router.post('/', authorize('customer:create'), validate(createCustomerSchema), customerController.create);
router.put('/:id', authorize('customer:update'), validate(updateCustomerSchema), customerController.update);
router.patch(
  '/:id/status',
  authorize('customer:update'),
  validate(changeCustomerStatusSchema),
  customerController.changeStatus
);
router.delete('/:id', authorize('customer:delete'), validate(customerIdSchema), customerController.softDelete);

export default router;
