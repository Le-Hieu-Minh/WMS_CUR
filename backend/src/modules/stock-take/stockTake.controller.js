import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { stockTakeService } from './stockTake.service.js';

export const stockTakeController = {
  list: asyncHandler(async (req, res) => {
    const result = await stockTakeService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await stockTakeService.getById(req.params.id);
    successResponse(res, item);
  }),

  warehouseProducts: asyncHandler(async (req, res) => {
    const items = await stockTakeService.getWarehouseProducts(req.query.warehouseId);
    successResponse(res, items);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await stockTakeService.create(req.body, req.user.sub);
    successResponse(res, item, 'Tạo phiếu kiểm kê thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await stockTakeService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật phiếu kiểm kê thành công');
  }),

  confirm: asyncHandler(async (req, res) => {
    const item = await stockTakeService.confirm(req.params.id, req.user.sub, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    successResponse(res, item, 'Xác nhận phiếu kiểm kê thành công');
  }),

  cancel: asyncHandler(async (req, res) => {
    const item = await stockTakeService.cancel(req.params.id);
    successResponse(res, item, 'Hủy phiếu kiểm kê thành công');
  }),

  remove: asyncHandler(async (req, res) => {
    await stockTakeService.remove(req.params.id);
    successResponse(res, null, 'Xóa phiếu kiểm kê thành công');
  }),
};
