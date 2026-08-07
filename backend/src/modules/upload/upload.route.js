import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { uploadController } from './upload.controller.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Upload file lên Cloudflare R2
 */

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Upload file (R2)
 *     tags: [Uploads]
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           enum: [uploads, products, avatars]
 *           default: uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload thành công
 *       400:
 *         description: File không hợp lệ
 *       503:
 *         description: R2 chưa được cấu hình
 */
router.post(
  '/',
  authorize('product:update', 'user:update'),
  upload.single('file'),
  uploadController.upload
);

export default router;
