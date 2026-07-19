import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { customerService } from './customer.service.js';

export const customerController = {
  list: asyncHandler(async (req, res) => {
    const result = await customerService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await customerService.getById(req.params.id);
    successResponse(res, item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await customerService.create(req.body);
    successResponse(res, item, 'Tạo khách hàng thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await customerService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật khách hàng thành công');
  }),

  changeStatus: asyncHandler(async (req, res) => {
    const item = await customerService.changeStatus(req.params.id, req.body.status);
    successResponse(res, item, 'Cập nhật trạng thái thành công');
  }),

  softDelete: asyncHandler(async (req, res) => {
    const item = await customerService.softDelete(req.params.id);
    successResponse(res, item, 'Xóa khách hàng thành công');
  }),
};
