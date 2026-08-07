# User — Developer Guide

## Overview

Hướng dẫn dev triển khai, mở rộng và test module User, tích hợp với Auth và Role.

## Purpose

Checklist thứ tự implement, dependencies, patterns tái sử dụng và manual test scenarios.

## Scope

`backend/src/modules/user/`, `frontend/src/features/users/`, shared password policy, Auth revoke.

## Workflow

### Thứ tự triển khai đã áp dụng

```
1. Shared passwordPolicy (tách từ Auth)
2. user.validation.js → repository → service → controller → route
3. GET /users/meta/roles (trước /:id)
4. Backend unit tests (user.service, user.validation)
5. FE: userSchema → userApi → UsersPage
6. PermissionRoute user:read + Sidebar
```

### Chạy và verify

```bash
npm run db:push
npm run db:seed
npm run dev

# Admin → CRUD /users
# Tạo Staff → login staff → GET /users expect 403
```

## Business Rules

Khi mở rộng: preserve last-admin checks; always revoke on INACTIVE/reset; never return passwordHash; lowercase email on create.

## Technical Design

### Phụ thuộc

| Module | Quan hệ |
|--------|---------|
| [Auth](../auth/README.md) | Login fields, revoke tokens, password policy |
| [Role](../role/README.md) | Assign roleId; meta roles read-only |
| Audit Log | Ghi create/update/status (Sprint 3+) |

### File map

**Backend:** `backend/src/modules/user/*`

**Frontend:** `frontend/src/features/users/*`, cập nhật Sidebar + routes

**Tests:**

```bash
cd backend && npm test -- user
cd frontend && npm test -- userSchema
```

### Mở rộng gợi ý

| Task | Approach |
|------|----------|
| Cho phép đổi email | Thêm field update + unique check + audit |
| Hard delete | Chỉ khi không còn FK — cân nhắc GDPR |
| Bulk import | Endpoint riêng + transaction |
| Tách UsersPage components | UserTable, CreateUserDialog, ... |

## API / Database

[api.md](./api.md), [database.md](./database.md).

## Validation

Extend `user.validation.js`. Reuse `passwordPolicy` — không duplicate regex.

## Security

- Test 403 với Staff token trên mọi endpoint
- Verify revoke: deactivate → refresh token fail
- Không log password trong request body

## Error Handling

Follow `ApiError` pattern. FE map `response.data.message`.

## Examples

Last admin check pattern:

```javascript
await assertNotLastAdmin(userId, 'Không thể vô hiệu hóa Admin cuối cùng');
```

Revoke after deactivate:

```javascript
if (status === 'INACTIVE') {
  await authRepository.revokeAllUserTokens(id);
}
```

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Meta roles on User API | Decouple from role:read | User form works with user:read only | Duplicate role list |
| Implement after Auth+Role seed | FK roleId | Valid test data | Order dependency |

## Notes

- `actorId` passed from controller for self-checks
- `ADMIN_ROLE_NAME` from `constants/roles.js` must match seed
- Integration tests: `p0.integration.test.js` if user scenarios added

## Checklist

- [x] Implementation order documented
- [x] Dependencies listed
- [x] Test commands
- [x] Extension suggestions
- [x] Security test scenarios
- [x] Cross-ref Auth/Role
