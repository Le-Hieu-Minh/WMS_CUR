# User – Backend Design

## Cấu trúc dự kiến

```
backend/src/modules/user/
├── user.route.js
├── user.controller.js
├── user.service.js
├── user.repository.js
└── user.validation.js
```

Đăng ký: `router.use('/users', userRoutes)`.

## Route + middleware

```
GET    /                 authenticate + authorize('user:read')
GET    /meta/roles       authenticate + authorize('user:read')
GET    /:id              authenticate + authorize('user:read')
POST   /                 authenticate + authorize('user:create') + validate
PUT    /:id              authenticate + authorize('user:update') + validate
PATCH  /:id/status       authenticate + authorize('user:update') + validate
POST   /:id/unlock       authenticate + authorize('user:update')
POST   /:id/reset-password  authenticate + authorize('user:update') + validate
DELETE /:id              authenticate + authorize('user:delete')
```

> Đặt `/meta/roles` **trước** `/:id` để tránh conflict.

## Service methods

| Method | Business logic |
|--------|----------------|
| `listUsers` | Filter, search ILIKE, paginate |
| `getUserById` | 404 nếu thiếu |
| `createUser` | Check email + role, bcrypt |
| `updateUser` | Last-admin khi đổi role |
| `changeStatus` | Self-check, last-admin, revoke nếu INACTIVE |
| `unlockUser` | Reset lock fields |
| `resetPassword` | Policy + hash + revoke all |
| `softDelete` | Delegate → INACTIVE |
| `listRoleOptions` | id + name |

## Repository

`findMany`, `count`, `findById`, `findByEmail`, `create`, `update`, `countActiveAdmins`, `findRoleById`

Reuse: `authRepository.revokeAllUserTokens`.

## Shared

- Tách `passwordPolicy` dùng chung Auth/User  
- Mapper không bao giờ trả `passwordHash`  

## Transaction

Reset password + revoke tokens: nên dùng `prisma.$transaction`.
