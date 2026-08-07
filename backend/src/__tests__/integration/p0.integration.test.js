import { describeIntegration, integrationEnv, teardownIntegrationOnce } from '../helpers/integrationEnv.js';
import {
  authDelete,
  authGet,
  authPatch,
  authPost,
  loginAs,
  loginRequest,
  publicPost,
  publicPut,
} from '../helpers/httpClient.js';

describeIntegration('P0 API (integration)', () => {
  let adminToken;
  let staffToken;
  let managerToken;
  let staffRoleId;

  function receiptPayload(overrides = {}) {
    const { warehouse, product, supplier } = integrationEnv.fixtures;
    return {
      warehouseId: warehouse.id,
      supplierId: supplier.id,
      receiptDate: '2026-01-15',
      note: 'Integration test receipt',
      items: [{ productId: product.id, quantity: 10, unitCost: 80000 }],
      ...overrides,
    };
  }

  function issuePayload(overrides = {}) {
    const { warehouse, product, customer } = integrationEnv.fixtures;
    return {
      warehouseId: warehouse.id,
      customerId: customer.id,
      issueDate: '2026-01-16',
      note: 'Integration test issue',
      items: [{ productId: product.id, quantity: 5, unitPrice: 100000 }],
      ...overrides,
    };
  }

  beforeAll(async () => {
    adminToken = (await loginAs('admin@wms.com', 'Admin@123')).accessToken;
    staffToken = (await loginAs('staff@wms.com', 'Staff@123')).accessToken;
    managerToken = (await loginAs('manager@wms.com', 'Manager@123')).accessToken;
    staffRoleId = integrationEnv.fixtures.roles.STAFF.id;

    const createRes = await authPost(managerToken, '/goods-receipts', {
      ...receiptPayload(),
      items: [{ productId: integrationEnv.fixtures.product.id, quantity: 100, unitCost: 80000 }],
    });
    await authPost(managerToken, `/goods-receipts/${createRes.body.data.id}/confirm`);
  });

  afterAll(async () => {
    await teardownIntegrationOnce();
  });

  describe('Auth API', () => {
    describe('POST /auth/login', () => {
      it('returns 200 with tokens for valid admin credentials', async () => {
        const res = await loginRequest('admin@wms.com', 'Admin@123');
        expect(res.status).toBe(200);
        expect(res.body.data.accessToken).toBeDefined();
      });

      it('returns 400 for invalid email format', async () => {
        const res = await loginRequest('not-an-email', 'Admin@123');
        expect(res.status).toBe(400);
      });

      it('returns 401 for wrong password', async () => {
        const res = await loginRequest('admin@wms.com', 'WrongPassword1');
        expect(res.status).toBe(401);
      });
    });

    describe('GET /auth/me', () => {
      it('returns 401 without token', async () => {
        const res = await authGet('', '/auth/me');
        expect(res.status).toBe(401);
      });

      it('returns 200 with current user profile', async () => {
        const res = await authGet(adminToken, '/auth/me');
        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe('admin@wms.com');
      });
    });

    describe('POST /auth/refresh', () => {
      it('returns 200 with new access token', async () => {
        const { refreshToken } = await loginAs('admin@wms.com', 'Admin@123');
        const res = await publicPost('/auth/refresh', { refreshToken });
        expect(res.status).toBe(200);
        expect(res.body.data.accessToken).toBeDefined();
      });

      it('returns 401 for invalid refresh token', async () => {
        const res = await publicPost('/auth/refresh', { refreshToken: 'invalid-token' });
        expect(res.status).toBe(401);
      });
    });

    describe('POST /auth/logout', () => {
      it('returns 200 and revokes refresh token', async () => {
        const { accessToken, refreshToken } = await loginAs('admin@wms.com', 'Admin@123');
        const logoutRes = await authPost(accessToken, '/auth/logout', { refreshToken });
        expect(logoutRes.status).toBe(200);

        const refreshRes = await publicPost('/auth/refresh', { refreshToken });
        expect(refreshRes.status).toBe(401);
      });
    });

    describe('PUT /auth/change-password', () => {
      it('returns 400 when confirm password mismatch', async () => {
        const res = await publicPut(staffToken, '/auth/change-password', {
          currentPassword: 'Staff@123',
          newPassword: 'Staff@4567',
          confirmPassword: 'Different@456',
        });
        expect(res.status).toBe(400);
      });
    });
  });

  describe('User API', () => {
    describe('GET /users', () => {
      it('returns 401 without token', async () => {
        const res = await authGet('', '/users');
        expect(res.status).toBe(401);
      });

      it('returns 403 for manager without user:read', async () => {
        const res = await authGet(managerToken, '/users');
        expect(res.status).toBe(403);
      });

      it('returns 200 paginated list for admin', async () => {
        const res = await authGet(adminToken, '/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe('POST /users', () => {
      it('returns 403 for staff without user:create', async () => {
        const res = await authPost(staffToken, '/users', {
          email: 'blocked@wms.com',
          fullName: 'Blocked User',
          password: 'Blocked@123',
          roleId: staffRoleId,
        });
        expect(res.status).toBe(403);
      });

      it('returns 400 for invalid payload', async () => {
        const res = await authPost(adminToken, '/users', {
          email: 'bad-email',
          fullName: 'X',
          password: 'weak',
          roleId: staffRoleId,
        });
        expect(res.status).toBe(400);
      });

      it('returns 201 when admin creates user', async () => {
        const email = `integration-${Date.now()}@wms.com`;
        const res = await authPost(adminToken, '/users', {
          email,
          fullName: 'Integration User',
          password: 'Integration@123',
          roleId: staffRoleId,
        });
        expect(res.status).toBe(201);
        expect(res.body.data.email).toBe(email);
      });

      it('returns 409 for duplicate email', async () => {
        const email = `dup-${Date.now()}@wms.com`;
        const payload = {
          email,
          fullName: 'Dup User',
          password: 'DupUser@123',
          roleId: staffRoleId,
        };
        await authPost(adminToken, '/users', payload);
        const res = await authPost(adminToken, '/users', payload);
        expect(res.status).toBe(409);
      });
    });

    describe('GET /users/:id', () => {
      it('returns 404 for unknown user', async () => {
        const res = await authGet(adminToken, '/users/550e8400-e29b-41d4-a716-446655440000');
        expect(res.status).toBe(404);
      });

      it('returns 200 for existing user', async () => {
        const res = await authGet(adminToken, `/users/${integrationEnv.fixtures.users.admin.id}`);
        expect(res.status).toBe(200);
      });
    });

    describe('PATCH /users/:id/status', () => {
      it('returns 400 when admin tries to deactivate self', async () => {
        const res = await authPatch(
          adminToken,
          `/users/${integrationEnv.fixtures.users.admin.id}/status`,
          { status: 'INACTIVE' }
        );
        expect(res.status).toBe(400);
      });
    });

    describe('DELETE /users/:id', () => {
      it('returns 400 when admin tries to delete self', async () => {
        const res = await authDelete(adminToken, `/users/${integrationEnv.fixtures.users.admin.id}`);
        expect(res.status).toBe(400);
      });
    });
  });

  describe('Goods Receipt API', () => {
    describe('GET /goods-receipts', () => {
      it('returns 401 without token', async () => {
        const res = await authGet('', '/goods-receipts');
        expect(res.status).toBe(401);
      });

      it('returns 200 for staff with read permission', async () => {
        const res = await authGet(staffToken, '/goods-receipts');
        expect(res.status).toBe(200);
      });
    });

    describe('POST /goods-receipts', () => {
      it('returns 403 for staff without create permission', async () => {
        const res = await authPost(staffToken, '/goods-receipts', receiptPayload());
        expect(res.status).toBe(403);
      });

      it('returns 400 for invalid payload', async () => {
        const res = await authPost(managerToken, '/goods-receipts', {
          warehouseId: integrationEnv.fixtures.warehouse.id,
          receiptDate: '2026-01-15',
          items: [],
        });
        expect(res.status).toBe(400);
      });

      it('returns 201 when manager creates draft receipt', async () => {
        const res = await authPost(managerToken, '/goods-receipts', receiptPayload());
        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe('DRAFT');
      });
    });

    describe('GET /goods-receipts/:id', () => {
      it('returns 404 for unknown receipt', async () => {
        const res = await authGet(
          adminToken,
          '/goods-receipts/550e8400-e29b-41d4-a716-446655440000'
        );
        expect(res.status).toBe(404);
      });
    });

    describe('POST /goods-receipts/:id/confirm', () => {
      it('returns 200 and updates inventory on confirm', async () => {
        const createRes = await authPost(managerToken, '/goods-receipts', receiptPayload());
        const confirmRes = await authPost(
          managerToken,
          `/goods-receipts/${createRes.body.data.id}/confirm`
        );
        expect(confirmRes.status).toBe(200);
        expect(confirmRes.body.data.status).toBe('CONFIRMED');
      });

      it('returns 409 when confirming non-draft receipt', async () => {
        const createRes = await authPost(managerToken, '/goods-receipts', receiptPayload());
        const receiptId = createRes.body.data.id;
        await authPost(managerToken, `/goods-receipts/${receiptId}/confirm`);
        const res = await authPost(managerToken, `/goods-receipts/${receiptId}/confirm`);
        expect(res.status).toBe(409);
      });
    });

    describe('DELETE /goods-receipts/:id', () => {
      it('returns 200 when deleting draft receipt', async () => {
        const createRes = await authPost(managerToken, '/goods-receipts', receiptPayload());
        const res = await authDelete(managerToken, `/goods-receipts/${createRes.body.data.id}`);
        expect(res.status).toBe(200);
      });
    });
  });

  describe('Goods Issue API', () => {
    describe('GET /goods-issues', () => {
      it('returns 401 without token', async () => {
        const res = await authGet('', '/goods-issues');
        expect(res.status).toBe(401);
      });

      it('returns 200 for staff with read permission', async () => {
        const res = await authGet(staffToken, '/goods-issues');
        expect(res.status).toBe(200);
      });
    });

    describe('POST /goods-issues', () => {
      it('returns 403 for staff without create permission', async () => {
        const res = await authPost(staffToken, '/goods-issues', issuePayload());
        expect(res.status).toBe(403);
      });

      it('returns 400 for invalid payload', async () => {
        const res = await authPost(managerToken, '/goods-issues', {
          warehouseId: integrationEnv.fixtures.warehouse.id,
          issueDate: '2026-01-16',
          items: [],
        });
        expect(res.status).toBe(400);
      });

      it('returns 201 when manager creates draft issue', async () => {
        const res = await authPost(managerToken, '/goods-issues', issuePayload());
        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe('DRAFT');
      });
    });

    describe('GET /goods-issues/:id', () => {
      it('returns 404 for unknown issue', async () => {
        const res = await authGet(
          adminToken,
          '/goods-issues/550e8400-e29b-41d4-a716-446655440000'
        );
        expect(res.status).toBe(404);
      });
    });

    describe('POST /goods-issues/:id/confirm', () => {
      it('returns 200 when sufficient stock', async () => {
        const createRes = await authPost(managerToken, '/goods-issues', issuePayload());
        const res = await authPost(managerToken, `/goods-issues/${createRes.body.data.id}/confirm`);
        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('CONFIRMED');
      });

      it('returns 409 when stock is insufficient', async () => {
        const createRes = await authPost(
          managerToken,
          '/goods-issues',
          issuePayload({
            items: [
              { productId: integrationEnv.fixtures.product.id, quantity: 99999, unitPrice: 1 },
            ],
          })
        );
        const res = await authPost(
          managerToken,
          `/goods-issues/${createRes.body.data.id}/confirm`
        );
        expect(res.status).toBe(409);
      });

      it('returns 409 when confirming non-draft issue', async () => {
        const createRes = await authPost(managerToken, '/goods-issues', issuePayload());
        const issueId = createRes.body.data.id;
        await authPost(managerToken, `/goods-issues/${issueId}/confirm`);
        const res = await authPost(managerToken, `/goods-issues/${issueId}/confirm`);
        expect(res.status).toBe(409);
      });
    });
  });
});
