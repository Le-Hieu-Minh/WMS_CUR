import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { userController } from './user.controller.js';
import {
  listUsersSchema,
  userIdSchema,
  createUserSchema,
  updateUserSchema,
  changeUserStatusSchema,
  resetPasswordSchema,
} from './user.validation.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

router.get('/', authorize('user:read'), validate(listUsersSchema), userController.list);
router.get('/meta/roles', authorize('user:read'), userController.listRoleOptions);
router.get('/:id', authorize('user:read'), validate(userIdSchema), userController.getById);
router.post('/', authorize('user:create'), validate(createUserSchema), userController.create);
router.put('/:id', authorize('user:update'), validate(updateUserSchema), userController.update);
router.patch(
  '/:id/status',
  authorize('user:update'),
  validate(changeUserStatusSchema),
  userController.changeStatus
);
router.post('/:id/unlock', authorize('user:update'), validate(userIdSchema), userController.unlock);
router.post(
  '/:id/reset-password',
  authorize('user:update'),
  validate(resetPasswordSchema),
  userController.resetPassword
);
router.delete('/:id', authorize('user:delete'), validate(userIdSchema), userController.softDelete);

export default router;
