import { successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  overview: asyncHandler(async (_req, res) => {
    const data = await dashboardService.getOverview();
    successResponse(res, data);
  }),
};
