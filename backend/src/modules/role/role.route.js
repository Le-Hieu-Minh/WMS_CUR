import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { roleController } from './role.controller.js';
import {
  listRolesSchema,
  roleIdSchema,
  createRoleSchema,
  updateRoleSchema,
} from './role.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('role:read'), validate(listRolesSchema), roleController.list);
router.get('/meta/permissions', authorize('role:read'), roleController.listPermissions);
router.get('/:id', authorize('role:read'), validate(roleIdSchema), roleController.getById);
router.post('/', authorize('role:create'), validate(createRoleSchema), roleController.create);
router.put('/:id', authorize('role:update'), validate(updateRoleSchema), roleController.update);
router.delete('/:id', authorize('role:delete'), validate(roleIdSchema), roleController.delete);

export default router;
