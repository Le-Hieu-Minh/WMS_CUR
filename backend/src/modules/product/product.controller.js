import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { productService } from './product.service.js';

export const productController = {
  list: asyncHandler(async (req, res) => {
    const result = await productService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await productService.getById(req.params.id);
    successResponse(res, item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await productService.create(req.body);
    successResponse(res, item, 'Tạo sản phẩm thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await productService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật sản phẩm thành công');
  }),

  changeStatus: asyncHandler(async (req, res) => {
    const item = await productService.changeStatus(req.params.id, req.body.status);
    successResponse(res, item, 'Cập nhật trạng thái thành công');
  }),

  softDelete: asyncHandler(async (req, res) => {
    const item = await productService.softDelete(req.params.id);
    successResponse(res, item, 'Xóa sản phẩm thành công');
  }),
};
