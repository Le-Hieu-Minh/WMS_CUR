import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { auditService } from './audit.service.js';

export const auditLogController = {
  list: asyncHandler(async (req, res) => {
    const result = await auditService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),
  getById: asyncHandler(async (req, res) => {
    successResponse(res, await auditService.getById(req.params.id));
  }),
};
