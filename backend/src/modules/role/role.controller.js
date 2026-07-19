import { HttpStatus } from '../../utils/apiError.js';
import { paginatedResponse, successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { roleService } from './role.service.js';

export const roleController = {
  list: asyncHandler(async (req, res) => {
    const result = await roleService.listRoles(req.query);
    paginatedResponse(res, result.items, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const role = await roleService.getRoleById(req.params.id);
    successResponse(res, role);
  }),

  create: asyncHandler(async (req, res) => {
    const role = await roleService.createRole(req.body);
    successResponse(res, role, 'Tạo vai trò thành công', HttpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const role = await roleService.updateRole(req.params.id, req.body);
    successResponse(res, role, 'Cập nhật vai trò thành công');
  }),

  delete: asyncHandler(async (req, res) => {
    await roleService.deleteRole(req.params.id);
    successResponse(res, null, 'Xóa vai trò thành công');
  }),

  listPermissions: asyncHandler(async (_req, res) => {
    const permissions = await roleService.listPermissions();
    successResponse(res, permissions);
  }),
};
