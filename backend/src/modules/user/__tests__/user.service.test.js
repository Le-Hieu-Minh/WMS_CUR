import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { ApiError } from '../../../utils/apiError.js';

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findRoleById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  isAdminUser: jest.fn(),
  countActiveAdmins: jest.fn(),
};

const mockAuthRepository = {
  revokeAllUserTokens: jest.fn(),
};

jest.unstable_mockModule('../user.repository.js', () => ({
  userRepository: mockUserRepository,
}));

jest.unstable_mockModule('../../auth/auth.repository.js', () => ({
  authRepository: mockAuthRepository,
}));

const { userService } = await import('../user.service.js');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createUser rejects duplicate email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing' });

    await expect(
      userService.createUser({
        email: 'dup@wms.com',
        fullName: 'Test User',
        password: 'Test@1234',
        roleId: 'role-1',
      })
    ).rejects.toThrow(ApiError);
  });

  it('changeStatus blocks self deactivate', async () => {
    await expect(userService.changeStatus('user-1', 'INACTIVE', 'user-1')).rejects.toThrow(
      'Không thể tự vô hiệu hóa tài khoản của mình'
    );
  });

  it('softDelete blocks self delete', async () => {
    await expect(userService.softDelete('user-1', 'user-1')).rejects.toThrow(
      'Không thể xóa tài khoản của chính mình'
    );
  });
});
