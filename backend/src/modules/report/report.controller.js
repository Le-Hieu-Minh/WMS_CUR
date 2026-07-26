import { successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { reportService } from './report.service.js';

export const reportController = {
  get: asyncHandler(async (req, res) => {
    const data = await reportService.getReport(req.params.type, req.query);
    successResponse(res, data);
  }),

  export: asyncHandler(async (req, res) => {
    const format = req.query.format || 'excel';
    const file = await reportService.exportReport(req.params.type, req.query, format);
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(Buffer.from(file.buffer));
  }),
};
