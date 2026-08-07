# Role & Permission — Backend Documentation

## Overview

Thiết kế layered backend module Role: CRUD vai trò, meta permissions, transaction gán quyền, bảo vệ system roles.

## Purpose

Mô tả kiến trúc BE, service logic, repository transactions và constants cho dev bảo trì.

## Scope

`backend/src/modules/role/*` — 6 endpoints under `/api/v1/roles`.

## Workflow

```
Request → authenticate → authorize('role:*') → validate
       → roleController → roleService → roleRepository (transaction)
```

## Business Rules

`roleService`: unique name, system role rename/delete block, userCount check, assertPermissionsExist, replace permissions on update.

## Technical Design

### Cấu trúc file

```
backend/src/modules/role/
├── role.route.js
├── role.controller.js
├── role.service.js
├── role.repository.js
└── role.validation.js
```

Đăng ký: `router.use('/roles', roleRoutes)` in `backend/src/routes/index.js`.

### Route + middleware

| Method | Path | Permission | Validate |
|--------|------|------------|----------|
| GET | `/` | role:read | listRolesSchema |
| GET | `/meta/permissions` | role:read | — |
| GET | `/:id` | role:read | roleIdSchema |
| POST | `/` | role:create | createRoleSchema |
| PUT | `/:id` | role:update | updateRoleSchema |
| DELETE | `/:id` | role:delete | roleIdSchema |

### Service methods

| Method | Logic |
|--------|-------|
| `listRoles` | Search ILIKE name/description, paginate, mapRole |
| `getRoleById` | 404 if missing |
| `createRole` | Unique name; assert permissions; repository transaction |
| `updateRole` | Block rename system; optional permission replace |
| `deleteRole` | Block system; block if users; hard delete |
| `listPermissions` | Group by module for meta API |
| `mapRole` | Add isSystem, userCount, flatten permissions |

### Repository

| Method | Notes |
|--------|-------|
| `findMany` / `count` | Include `_count.users`, permissions join |
| `findById` | Full relations |
| `findByName` | Uniqueness check |
| `create(data, permissionIds)` | `$transaction` — role + role_permissions |
| `update(id, data, permissionIds?)` | Transaction; delete+insert permissions if ids provided |
| `delete(id)` | Hard delete |
| `listPermissions` | All permissions ordered |
| `findPermissionsByIds` | Validation helper |

### Shared constants

```javascript
// backend/src/constants/roles.js
export const SYSTEM_ROLE_NAMES = ['Admin', 'Manager', 'Staff'];
export const ADMIN_ROLE_NAME = 'Admin';
```

Permission catalog: `backend/src/constants/permissions.js`.

## API / Database

[api.md](./api.md), [database.md](./database.md).

## Validation

`role.validation.js` — Zod schemas. permissionIds min 1 on create; optional on update but min 1 if present.

## Security

All routes authenticated + authorized. No endpoint to mutate Permission rows.

## Error Handling

| Service | Status | Message |
|---------|--------|---------|
| Name exists | 409 | Tên vai trò đã tồn tại |
| System delete | 400 | Không thể xóa vai trò hệ thống |
| System rename | 400 | Không thể đổi tên vai trò hệ thống |
| Has users | 409 | Không thể xóa vai trò đang được gán cho người dùng |
| Bad permission id | 400 | Một hoặc nhiều quyền không tồn tại |
| Not found | 404 | Không tìm thấy vai trò |

## Examples

```bash
cd backend && npm test -- role
```

Manual: Admin DELETE role Admin → 400; create role + assign user → DELETE → 409.

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Transaction on create/update | Atomic role+permissions | No partial state | Lock duration |
| mapRole in service | Single mapper | Consistent API shape | Service responsibility |
| Hard delete | Cleanup unused roles | Simple model | No soft-delete audit |

## Notes

JWT permissions refresh on login only — updating role permissions doesn't kick active sessions until token refresh/expiry. Document for ops when changing critical roles.

## Checklist

- [x] Layer structure + routes
- [x] Service + repository methods
- [x] Transaction boundaries
- [x] System role constants
- [x] Error matrix
