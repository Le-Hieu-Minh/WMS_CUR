# Role & Permission — API Documentation

## Overview

REST API quản lý vai trò và meta permissions. Base URL: `/api/v1/roles`. Bearer + `role:*` required.

## Purpose

Contract đầy đủ cho CRUD role và API permissions grouped cho form UI.

## Scope

6 endpoints. Permission CRUD không exposed — seed only.

## Workflow

Authenticated → authorize → validate → controller → service (transaction for create/update permissions).

## Business Rules

Per-endpoint rules in [analysis.md](./analysis.md#business-rules).

## Technical Design

Route `/meta/permissions` before `/:id`. Repository uses `prisma.$transaction` for role + role_permissions.

## API / Database

### Tổng hợp endpoints

| Method | URL | Permission | Mô tả |
|--------|-----|------------|-------|
| GET | `/roles` | role:read | Danh sách + pagination |
| GET | `/roles/meta/permissions` | role:read | Quyền nhóm theo module |
| GET | `/roles/:id` | role:read | Chi tiết role |
| POST | `/roles` | role:create | Tạo role |
| PUT | `/roles/:id` | role:update | Cập nhật role |
| DELETE | `/roles/:id` | role:delete | Xóa role (hard) |

---

### GET `/roles`

| Thuộc tính | Giá trị |
|------------|---------|
| **URL** | `GET /api/v1/roles` |
| **Method** | GET |
| **Auth** | Bearer + `role:read` |
| **Description** | Danh sách role với userCount, isSystem, permissions |

**Parameters (query)**

| Param | Type | Required | Mô tả |
|-------|------|----------|-------|
| page | number | No | Pagination |
| limit | number | No | Max 100 |
| search | string | No | ILIKE name/description |
| sortBy | enum | No | name, createdAt |
| sortOrder | enum | No | asc, desc |

**Response 200**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Staff",
        "description": "Nhân viên kho",
        "isSystem": true,
        "userCount": 2,
        "permissions": [
          { "id": "uuid", "code": "warehouse:read", "name": "Xem kho", "module": "warehouse" }
        ],
        "createdAt": "2026-08-07T00:00:00.000Z",
        "updatedAt": "2026-08-07T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
  }
}
```

**Status Codes:** 200, 401, 403, 500

**Example**

```bash
curl "http://localhost:3000/api/v1/roles?page=1&search=Staff" \
  -H "Authorization: Bearer <token>"
```

---

### GET `/roles/meta/permissions`

| **Auth** | Bearer + `role:read` |
| **Description** | Tất cả permissions nhóm theo `module` cho checkbox UI |

**Response 200**

```json
{
  "success": true,
  "data": {
    "user": [{ "id": "uuid", "code": "user:read", "name": "Xem người dùng" }],
    "warehouse": [{ "id": "uuid", "code": "warehouse:create", "name": "Tạo kho" }]
  }
}
```

**Status Codes:** 200, 401, 403, 500

**Business Rules:** Read-only catalog from seed

---

### GET `/roles/:id`

**Response 200:** Single role object (same shape as list item)

**Status Codes:** 200, 401, 403, 404, 500

---

### POST `/roles`

| **Auth** | Bearer + `role:create` |
| **Description** | Tạo role tùy chỉnh + gán permissions |

**Body**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | 2–100 chars |
| description | string? | No | max 500 |
| permissionIds | UUID[] | Yes | min 1, all must exist |

**Response 201:** Role object

**Status Codes:** 201, 400, 401, 403, 409, 500

**Error Response:** 409 — Tên vai trò đã tồn tại; 400 — Một hoặc nhiều quyền không tồn tại

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/roles \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Warehouse Clerk","description":"Chỉ quản lý kho","permissionIds":["<uuid1>","<uuid2>"]}'
```

---

### PUT `/roles/:id`

**Body:** `{ "name?", "description?", "permissionIds?" }`

**Business Rules:** BR-R04 — không đổi tên system role; BR-R07 — replace permissions if permissionIds sent

**Status Codes:** 200, 400, 401, 403, 404, 409, 500

**Error:** 400 — Không thể đổi tên vai trò hệ thống

---

### DELETE `/roles/:id`

| **Description** | Hard delete role + cascade role_permissions |

**Business Rules:** BR-R03, BR-R06

**Response 200:** Success message

**Status Codes:** 200, 400, 401, 403, 404, 409, 500

**Error:** 400 — Không thể xóa vai trò hệ thống; 409 — Không thể xóa vai trò đang được gán cho người dùng

## Validation

`backend/src/modules/role/role.validation.js`

## Security

Admin-only in practice. Changing role permissions affects users on next login/refresh (JWT stale until then).

## Error Handling

Standard error envelope. 409 for business conflicts.

## Examples

Delete flow: assign users to another role first → DELETE succeeds.

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Meta endpoint separate | Route ordering | Clean `/:id` | Extra API |
| Flatten permissions in role response | FE convenience | One payload | Larger response |

## Notes

Swagger tag likely **Roles** at `/api-docs`. Permission codes format: `{module}:{action}`.

## Checklist

- [x] 6 endpoints documented
- [x] Full request/response shapes
- [x] Status + error codes
- [x] Business rules per endpoint
- [x] curl examples
