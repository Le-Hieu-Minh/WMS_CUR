import { successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authService } from './auth.service.js';

export const authController = {
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    successResponse(res, result, 'Đăng nhập thành công');
  }),

  refresh: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    successResponse(res, result, 'Token refreshed');
  }),

  logout: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    successResponse(res, null, 'Đăng xuất thành công');
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.sub);
    successResponse(res, user);
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.sub, { currentPassword, newPassword });
    successResponse(res, null, 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
  }),
};
