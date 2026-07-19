import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError, HttpStatus } from '../utils/apiError.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedTypes = env.ALLOWED_FILE_TYPES.split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(HttpStatus.BAD_REQUEST, `File type ${file.mimetype} is not allowed`), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});
