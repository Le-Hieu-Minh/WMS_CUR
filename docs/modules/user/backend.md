# User — Backend Documentation

## Overview

Thiết kế layered backend module User: routes, service business rules, repository Prisma, validation Zod.

## Purpose

Mô tả kiến trúc BE, middleware chain, service methods và integration với Auth module.

## Scope

`backend/src/modules/user/*` — 9 endpoints under `/api/v1/users`.

## Workflow

```
Request → authenticate (router.use)
       → authorize('user:*')
       → validate(schema)
       → userController
       → userService (BR enforcement)
       → userRepository / authRepository
```

## Business Rules

Enforced in `user.service.js`: last admin (`assertNotLastAdmin`), self-action, role exists, email unique, token revoke on INACTIVE/reset.

## Technical Design

### Cấu trúc file

```
backend/src/modules/user/
├── user.route.js
├── user.controller.js
├── user.service.js
├── user.repository.js
└── user.validation.js
```

Đăng ký: `router.use('/users', userRoutes)`.

### Route + middleware

| Method | Path | Permission | Validate |
|--------|------|------------|----------|
| GET | `/` | user:read | listUsersSchema |
| GET | `/meta/roles` | user:read | — |
| GET | `/:id` | user:read | userIdSchema |
| POST | `/` | user:create | createUserSchema |
| PUT | `/:id` | user:update | updateUserSchema |
| PATCH | `/:id/status` | user:update | changeUserStatusSchema |
| POST | `/:id/unlock` | user:update | userIdSchema |
| POST | `/:id/reset-password` | user:update | resetPasswordSchema |
| DELETE | `/:id` | user:delete | userIdSchema |

> `/meta/roles` **trước** `/:id`.

### Service methods

| Method | Logic |
|--------|-------|
| `listUsers` | buildWhere (search ILIKE), paginate, mapUser |
| `getUserById` | 404 if missing; includeLockFields |
| `createUser` | email conflict 409; assertRoleExists; bcrypt |
| `updateUser` | last-admin on role change from Admin |
| `changeStatus` | self + last-admin; revoke if INACTIVE |
| `unlockUser` | ACTIVE + reset lock fields |
| `resetPassword` | hash + revokeAllUserTokens |
| `softDelete` | delegate changeStatus INACTIVE |
| `listRoleOptions` | id + name from roles |

### Repository methods

`findMany`, `count`, `findById`, `findByEmail`, `create`, `update`, `countActiveAdmins`, `findRoleById`, `listRoleOptions`, `isAdminUser`

### Shared dependencies

| Import | Usage |
|--------|-------|
| `authRepository.revokeAllUserTokens` | Deactivate, reset |
| `passwordPolicy` | Validation |
| `ADMIN_ROLE_NAME` | Last admin check |
| `parsePagination` / `buildPagination` | List |

### Mapper

`mapUser(user, { includeLockFields })` — never exposes `passwordHash`.

## API / Database

[api.md](./api.md), [database.md](./database.md).

## Validation

`user.validation.js` — Zod schemas per endpoint. Email transform lowercase on create.

## Security

All routes authenticated. Granular authorize per action. bcrypt rounds = 12 on create/reset.

## Error Handling

| Service | Status | Message |
|---------|--------|---------|
| Email exists | 409 | Email đã tồn tại |
| Last admin | 409 | Không thể vô hiệu hóa/đổi vai trò Admin cuối cùng |
| Self deactivate | 400 | Không thể tự vô hiệu hóa... |
| Self delete | 400 | Không thể xóa tài khoản của chính mình |
| Not found | 404 | Không tìm thấy người dùng |
| Bad role | 400 | Vai trò không tồn tại |

## Examples

```bash
cd backend && npm test -- user
```

Tests: `user.service.test.js`, `user.validation.test.js`.

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| softDelete → changeStatus | DRY | One code path | DELETE semantics |
| isAdminUser by role name | Match seed | Simple | Fragile if rename |
| No transaction on reset | MVP | Fewer locks | Partial failure edge case |

## Notes

`actorId` từ `req.user.sub` trong controller. Audit log integration planned Sprint 3.

## Checklist

- [x] File structure + route order
- [x] Service + repository methods
- [x] Auth integration (revoke)
- [x] Error matrix
- [x] Test commands
