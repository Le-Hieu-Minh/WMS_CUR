import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { auditLogController } from './auditLog.controller.js';
import { listAuditLogsSchema, auditLogIdSchema } from './auditLog.validation.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize('audit-log:read'), validate(listAuditLogsSchema), auditLogController.list);
router.get('/:id', authorize('audit-log:read'), validate(auditLogIdSchema), auditLogController.getById);

export default router;
