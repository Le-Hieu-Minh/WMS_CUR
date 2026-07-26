import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { stockAdjustmentService } from './stockAdjustment.service.js';

export const stockAdjustmentController = {
  list: asyncHandler(async (req, res) => {
    const result = await stockAdjustmentService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),
  getById: asyncHandler(async (req, res) => {
    successResponse(res, await stockAdjustmentService.getById(req.params.id));
  }),
  create: asyncHandler(async (req, res) => {
    const item = await stockAdjustmentService.create(req.body, req.user.sub);
    successResponse(res, item, 'Tạo phiếu điều chỉnh thành công', HttpStatus.CREATED);
  }),
  update: asyncHandler(async (req, res) => {
    successResponse(res, await stockAdjustmentService.update(req.params.id, req.body), 'Cập nhật thành công');
  }),
  confirm: asyncHandler(async (req, res) => {
    const item = await stockAdjustmentService.confirm(req.params.id, req.user.sub, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    successResponse(res, item, 'Xác nhận phiếu điều chỉnh thành công');
  }),
  cancel: asyncHandler(async (req, res) => {
    successResponse(res, await stockAdjustmentService.cancel(req.params.id), 'Hủy phiếu thành công');
  }),
  remove: asyncHandler(async (req, res) => {
    await stockAdjustmentService.remove(req.params.id);
    successResponse(res, null, 'Xóa phiếu thành công');
  }),
};
