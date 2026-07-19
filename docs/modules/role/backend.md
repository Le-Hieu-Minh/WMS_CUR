# Role & Permission – Backend Design

## Cấu trúc

```
backend/src/modules/role/
├── role.route.js
├── role.controller.js
├── role.service.js
├── role.repository.js
└── role.validation.js
```

Đăng ký: `router.use('/roles', roleRoutes)` trong `backend/src/routes/index.js`.

## Route + middleware

```
GET    /                      authenticate + authorize('role:read')
GET    /meta/permissions       authenticate + authorize('role:read')
GET    /:id                    authenticate + authorize('role:read')
POST   /                       authenticate + authorize('role:create') + validate
PUT    /:id                    authenticate + authorize('role:update') + validate
DELETE /:id                    authenticate + authorize('role:delete')
```

## Service methods

| Method | Business logic |
|--------|----------------|
| `listRoles` | Search ILIKE name/description, paginate, mapRole |
| `getRoleById` | 404 nếu thiếu |
| `createRole` | Unique name, assert permissions, transaction create + RolePermission |
| `updateRole` | Block rename system role, replace permissions nếu có |
| `deleteRole` | Block system role, block nếu có user, hard delete |
| `listPermissions` | Group theo module |
| `mapRole` | Thêm isSystem, userCount, flatten permissions |

## Repository

`findMany`, `count`, `findById`, `findByName`, `create` (transaction), `update` (transaction), `delete`, `listPermissions`, `findPermissionsByIds`

## Shared constants

`backend/src/constants/roles.js` → `SYSTEM_ROLE_NAMES = ['Admin', 'Manager', 'Staff']`

## Transaction

Create/update role + RolePermission dùng `prisma.$transaction`.
