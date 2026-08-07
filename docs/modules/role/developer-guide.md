# Role & Permission — Developer Guide

## Overview

Hướng dẫn dev triển khai, mở rộng permission catalog, bảo trì system roles và test module Role.

## Purpose

Checklist implement, dependencies, extension points khi thêm module/permission mới.

## Scope

`backend/src/modules/role/`, `frontend/src/features/roles/`, seed, constants.

## Workflow

### Thứ tự triển khai đã áp dụng

```
1. Prisma: Role, Permission, RolePermission + seed
2. role.validation.js → repository → service → controller → route
3. GET /meta/permissions (trước /:id)
4. FE: roleSchema → roleApi → RolesPage (checkbox permissions)
5. PermissionRoute role:read + Sidebar
```

### Test thủ công

```bash
npm run db:seed
npm run dev

# Admin → /roles → CRUD role tùy chỉnh
# DELETE Admin → 400
# Tạo role + gán user → DELETE role → 409
```

## Business Rules

When extending: keep `SYSTEM_ROLE_NAMES` synced with seed; permissionIds update = full replace; never expose Permission write API without review.

## Technical Design

### Phụ thuộc

| Module | Quan hệ |
|--------|---------|
| [Auth](../auth/README.md) | JWT + authorize middleware |
| [User](../user/README.md) | Gán roleId; `/users/meta/roles` reads roles table |
| Seed | `permissions.js` + `seed.js` |

### Mở rộng Sprint sau — thêm module mới

1. Append entries to `PERMISSIONS` in `constants/permissions.js`
2. Update `ROLE_DEFINITIONS` (Manager/Staff filters if needed)
3. Run `npm run db:seed` — Admin gets all new codes automatically
4. Add `authorize('new-module:action')` on new routes
5. FE: permissions appear in `/roles/meta/permissions` grouped by module

### Điểm cần nhớ khi sửa

| Topic | Detail |
|-------|--------|
| `SYSTEM_ROLE_NAMES` | Must match seed role names exactly |
| Update permissionIds | Repository deletes all RolePermission then inserts |
| `mapRole.isSystem` | Derived from name — no DB column |
| FE validation | Client checks min 1 permission; BE also validates |
| Active JWT | Role permission change not immediate for logged-in users |

### File map

| Path | Role |
|------|------|
| `backend/src/modules/role/*` | Module code |
| `backend/src/constants/permissions.js` | Permission catalog |
| `backend/src/constants/roles.js` | System role names |
| `backend/prisma/seed.js` | Seed roles + permissions |
| `frontend/src/features/roles/*` | UI |

### Tests

```bash
cd backend && npm test -- role
cd frontend && npm test -- roleSchema
```

## API / Database

[api.md](./api.md), [database.md](./database.md).

## Validation

Extend `createRoleSchema` / `updateRoleSchema` in `role.validation.js`. Keep sync with FE `roleFormSchema`.

## Security

Review permission assignments for Manager/Staff on seed changes. Avoid removing all admins via role update.

## Error Handling

Use `ApiError` with 409 for name conflict and role-has-users.

## Examples

Add permission:

```javascript
// constants/permissions.js
{ code: 'inventory:export', name: 'Xuất tồn kho', module: 'inventory' },
```

Repository transaction pattern:

```javascript
await prisma.$transaction([
  prisma.role.create({ data }),
  prisma.rolePermission.createMany({ data: permissionRows }),
]);
```

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Seed-driven permissions | Controlled RBAC | Consistent across envs | Requires redeploy |
| Name-based isSystem | No schema change | Fast | Fragile to renames |
| Full permission replace | Simpler update | No merge bugs | Larger payloads |

## Notes

- User module's `listRoleOptions` is read-only subset — Role module owns permission assignment
- Consider audit log for role changes in future sprint
- ERD: `docs/wms-database.md`

## Checklist

- [x] Implementation order
- [x] New module extension steps
- [x] Constants sync warnings
- [x] Test scenarios
- [x] Cross-ref Auth/User
- [x] Transaction pattern documented
