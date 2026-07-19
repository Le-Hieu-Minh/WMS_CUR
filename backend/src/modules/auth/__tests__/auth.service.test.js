import { authService } from '../auth.service.js';

describe('authService helpers', () => {
  it('hashToken returns consistent sha256 hash', () => {
    const hash = authService.hashToken('sample-token');
    expect(hash).toHaveLength(64);
    expect(hash).toBe(authService.hashToken('sample-token'));
  });

  it('getExpiresInSeconds converts minutes', () => {
    expect(authService.getExpiresInSeconds('15m')).toBe(900);
  });

  it('mapUserResponse excludes password hash', () => {
    const user = {
      id: 'user-1',
      email: 'admin@wms.com',
      fullName: 'Admin',
      avatarUrl: null,
      status: 'ACTIVE',
      lastLoginAt: null,
      role: {
        id: 'role-1',
        name: 'Admin',
        permissions: [{ permission: { code: 'user:read' } }],
      },
    };

    const mapped = authService.mapUserResponse(user);

    expect(mapped.email).toBe('admin@wms.com');
    expect(mapped.role.permissions).toEqual(['user:read']);
    expect(mapped.passwordHash).toBeUndefined();
  });
});
