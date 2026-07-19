import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { supplierService } from './supplier.service.js';

export const supplierController = {
  list: asyncHandler(async (req, res) => {
    const result = await supplierService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await supplierService.getById(req.params.id);
    successResponse(res, item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await supplierService.create(req.body);
    successResponse(res, item, 'Tạo nhà cung cấp thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await supplierService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật nhà cung cấp thành công');
  }),

  changeStatus: asyncHandler(async (req, res) => {
    const item = await supplierService.changeStatus(req.params.id, req.body.status);
    successResponse(res, item, 'Cập nhật trạng thái thành công');
  }),

  softDelete: asyncHandler(async (req, res) => {
    const item = await supplierService.softDelete(req.params.id);
    successResponse(res, item, 'Xóa nhà cung cấp thành công');
  }),
};
