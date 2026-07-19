import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { userService } from './user.service.js';

export const userController = {
  list: asyncHandler(async (req, res) => {
    const result = await userService.listUsers(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    successResponse(res, user);
  }),

  create: asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    successResponse(res, user, 'Tạo người dùng thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body, req.user.sub);
    successResponse(res, user, 'Cập nhật người dùng thành công');
  }),

  changeStatus: asyncHandler(async (req, res) => {
    const user = await userService.changeStatus(req.params.id, req.body.status, req.user.sub);
    successResponse(res, user, 'Cập nhật trạng thái thành công');
  }),

  unlock: asyncHandler(async (req, res) => {
    const user = await userService.unlockUser(req.params.id);
    successResponse(res, user, 'Mở khóa tài khoản thành công');
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await userService.resetPassword(req.params.id, req.body.newPassword);
    successResponse(res, null, 'Reset mật khẩu thành công');
  }),

  softDelete: asyncHandler(async (req, res) => {
    const user = await userService.softDelete(req.params.id, req.user.sub);
    successResponse(res, user, 'Xóa người dùng thành công');
  }),

  listRoleOptions: asyncHandler(async (_req, res) => {
    const roles = await userService.listRoleOptions();
    successResponse(res, roles);
  }),
};
