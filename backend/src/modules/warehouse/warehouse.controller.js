import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { warehouseService } from './warehouse.service.js';

export const warehouseController = {
  list: asyncHandler(async (req, res) => {
    const result = await warehouseService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await warehouseService.getById(req.params.id);
    successResponse(res, item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await warehouseService.create(req.body);
    successResponse(res, item, 'Tạo kho thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await warehouseService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật kho thành công');
  }),

  changeStatus: asyncHandler(async (req, res) => {
    const item = await warehouseService.changeStatus(req.params.id, req.body.status);
    successResponse(res, item, 'Cập nhật trạng thái thành công');
  }),

  softDelete: asyncHandler(async (req, res) => {
    const item = await warehouseService.softDelete(req.params.id);
    successResponse(res, item, 'Xóa kho thành công');
  }),
};
