import { paginatedResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { inventoryService } from './inventory.service.js';

export const inventoryController = {
  list: asyncHandler(async (req, res) => {
    const result = await inventoryService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),
};
