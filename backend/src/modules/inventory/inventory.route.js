import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { inventoryController } from './inventory.controller.js';
import { listInventorySchema } from './inventory.validation.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Xem tồn kho
 */

router.get('/', authorize('inventory:read'), validate(listInventorySchema), inventoryController.list);

export default router;
