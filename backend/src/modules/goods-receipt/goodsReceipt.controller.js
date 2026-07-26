import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { goodsReceiptService } from './goodsReceipt.service.js';

export const goodsReceiptController = {
  list: asyncHandler(async (req, res) => {
    const result = await goodsReceiptService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await goodsReceiptService.getById(req.params.id);
    successResponse(res, item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await goodsReceiptService.create(req.body, req.user.sub);
    successResponse(res, item, 'Tạo phiếu nhập thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await goodsReceiptService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật phiếu nhập thành công');
  }),

  confirm: asyncHandler(async (req, res) => {
    const item = await goodsReceiptService.confirm(req.params.id, req.user.sub, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    successResponse(res, item, 'Xác nhận phiếu nhập thành công');
  }),

  cancel: asyncHandler(async (req, res) => {
    const item = await goodsReceiptService.cancel(req.params.id);
    successResponse(res, item, 'Hủy phiếu nhập thành công');
  }),

  remove: asyncHandler(async (req, res) => {
    await goodsReceiptService.remove(req.params.id);
    successResponse(res, null, 'Xóa phiếu nhập thành công');
  }),
};
