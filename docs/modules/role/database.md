# Role & Permission – Database Documentation

## Bảng liên quan

| Bảng | Mô tả |
|------|--------|
| `roles` | Vai trò người dùng |
| `permissions` | Quyền seed theo module |
| `role_permissions` | N-N Role ↔ Permission |

## Model `Role`

| Field | Type | Ghi chú |
|-------|------|---------|
| id | UUID PK | |
| name | String UNIQUE | Admin, Manager, Staff = system |
| description | String? | |
| created_at | DateTime | |
| updated_at | DateTime | |

**Relations:** users (1-N), permissions qua RolePermission

## Model `Permission`

| Field | Type | Ghi chú |
|-------|------|---------|
| id | UUID PK | |
| code | String UNIQUE | `{module}:{action}` |
| name | String | Nhãn hiển thị |
| module | String | Nhóm module |
| created_at | DateTime | |
| updated_at | DateTime | |

**Index:** `module`

## Model `RolePermission`

| Field | Type | Ghi chú |
|-------|------|---------|
| role_id | UUID FK | PK composite |
| permission_id | UUID FK | PK composite |

**On delete:** Cascade cả hai phía

## Relationship

```
roles N ─── M permissions  (qua role_permissions)
roles 1 ─── N users
```

## Seed

- 3 system roles: Admin, Manager, Staff  
- Permissions theo từng module Sprint 1  
- Admin có full quyền  

## Migration

Schema nằm trong `backend/prisma/schema.prisma`. Chạy `npm run db:push` + `npm run db:seed`.
