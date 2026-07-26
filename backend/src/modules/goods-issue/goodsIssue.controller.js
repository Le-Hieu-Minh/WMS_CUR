import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { goodsIssueService } from './goodsIssue.service.js';

export const goodsIssueController = {
  list: asyncHandler(async (req, res) => {
    const result = await goodsIssueService.list(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await goodsIssueService.getById(req.params.id);
    successResponse(res, item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await goodsIssueService.create(req.body, req.user.sub);
    successResponse(res, item, 'Tạo phiếu xuất thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await goodsIssueService.update(req.params.id, req.body);
    successResponse(res, item, 'Cập nhật phiếu xuất thành công');
  }),

  confirm: asyncHandler(async (req, res) => {
    const item = await goodsIssueService.confirm(req.params.id, req.user.sub, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    successResponse(res, item, 'Xác nhận phiếu xuất thành công');
  }),

  cancel: asyncHandler(async (req, res) => {
    const item = await goodsIssueService.cancel(req.params.id);
    successResponse(res, item, 'Hủy phiếu xuất thành công');
  }),

  remove: asyncHandler(async (req, res) => {
    await goodsIssueService.remove(req.params.id);
    successResponse(res, null, 'Xóa phiếu xuất thành công');
  }),
};
