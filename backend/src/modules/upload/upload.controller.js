import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { uploadFile } from '../../services/upload.service.js';

const ALLOWED_FOLDERS = new Set(['uploads', 'products', 'avatars']);

export const uploadController = {
  upload: asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'File is required');
    }

    const folder = req.query.folder || 'uploads';
    if (!ALLOWED_FOLDERS.has(folder)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid upload folder');
    }

    const result = await uploadFile(req.file, folder);
    successResponse(res, result, 'Upload thành công', HttpStatus.CREATED);
  }),
};
