# User — API Documentation

## Overview

REST API quản lý người dùng. Base URL: `/api/v1/users`. Tất cả endpoint yêu cầu Bearer token + permission `user:*`.

## Purpose

Contract đầy đủ cho client: CRUD user, status, unlock, reset password, meta roles.

## Scope

9 endpoints. Không bao gồm Auth login hay Role CRUD.

## Workflow

Admin authenticated → authorize permission → validate → controller → service → response.

## Business Rules

| Endpoint | Rules |
|----------|-------|
| POST / | Email unique; role exists; password policy |
| PUT /:id | Last admin khi đổi role Admin |
| PATCH /:id/status | Self-check; last admin; revoke if INACTIVE |
| POST /:id/unlock | Reset lock fields |
| POST /:id/reset-password | Revoke all tokens |
| DELETE /:id | Soft delete = INACTIVE; self/last-admin |

## Technical Design

Router `authenticate` global. Route `/meta/roles` đặt **trước** `/:id` tránh conflict.

## API / Database

### Tổng hợp endpoints

| Method | URL | Permission | Mô tả |
|--------|-----|------------|-------|
| GET | `/users` | user:read | Danh sách + pagination |
| GET | `/users/meta/roles` | user:read | Options role cho form |
| GET | `/users/:id` | user:read | Chi tiết |
| POST | `/users` | user:create | Tạo user |
| PUT | `/users/:id` | user:update | Cập nhật |
| PATCH | `/users/:id/status` | user:update | ACTIVE / INACTIVE |
| POST | `/users/:id/unlock` | user:update | Mở khóa LOCKED |
| POST | `/users/:id/reset-password` | user:update | Reset mật khẩu |
| DELETE | `/users/:id` | user:delete | Soft delete |

---

### GET `/users`

| Thuộc tính | Giá trị |
|------------|---------|
| **URL** | `GET /api/v1/users` |
| **Method** | GET |
| **Auth** | Bearer + `user:read` |
| **Description** | Danh sách user có pagination, search, filter |

**Headers:** `Authorization: Bearer <token>`

**Parameters (query)**

| Param | Type | Required | Mô tả |
|-------|------|----------|-------|
| page | number | No | Trang (default pagination) |
| limit | number | No | Max 100 |
| search | string | No | ILIKE email hoặc fullName |
| status | enum | No | ACTIVE, INACTIVE, LOCKED |
| roleId | UUID | No | Lọc theo role |
| sortBy | enum | No | fullName, email, createdAt, lastLoginAt |
| sortOrder | enum | No | asc, desc |

**Response 200**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "staff@wms.com",
        "fullName": "Nguyen Van A",
        "avatarUrl": null,
        "status": "ACTIVE",
        "role": { "id": "uuid", "name": "Staff" },
        "lastLoginAt": null,
        "createdAt": "2026-08-07T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
}
```

**Status Codes:** 200, 401, 403, 500

**Business Rules:** BR-U04 — không passwordHash

**Example**

```bash
curl "http://localhost:3000/api/v1/users?page=1&limit=10&search=staff" \
  -H "Authorization: Bearer <token>"
```

---

### GET `/users/:id`

| **Auth** | Bearer + `user:read` |
| **Description** | Chi tiết user, kèm lock fields |

**Response 200:** Item như list + `failedLoginAttempts`, `lockedUntil`

**Status Codes:** 200, 401, 403, 404, 500

---

### POST `/users`

| **Auth** | Bearer + `user:create` |
| **Description** | Tạo user mới status ACTIVE |

**Body**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Email, lowercase |
| fullName | string | Yes | 2–255 chars |
| password | string | Yes | passwordPolicy |
| roleId | UUID | Yes | Role tồn tại |
| avatarUrl | string? | No | URL hoặc null |

**Response 201:** User object (no passwordHash)

**Status Codes:** 201, 400, 401, 403, 409, 500

**Error Response:** 409 — Email đã tồn tại; 400 — Vai trò không tồn tại

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@wms.com","fullName":"Nguyen Van A","password":"Staff@123","roleId":"<uuid>"}'
```

---

### PUT `/users/:id`

**Body:** `{ "fullName?", "roleId?", "avatarUrl?" }`

**Status Codes:** 200, 400, 401, 403, 404, 409, 500

**Error:** 409 — Không thể đổi vai trò Admin cuối cùng

---

### PATCH `/users/:id/status`

**Body:** `{ "status": "ACTIVE" | "INACTIVE" }`

**Side effect:** INACTIVE → revoke all refresh tokens

**Status Codes:** 200, 400, 401, 403, 404, 409, 500

**Error:** 400 — Không thể tự vô hiệu hóa; 409 — Không thể vô hiệu hóa Admin cuối cùng

---

### POST `/users/:id/unlock`

**Body:** Empty

**Effect:** status ACTIVE, failedLoginAttempts=0, lockedUntil=null

**Status Codes:** 200, 401, 403, 404, 500

---

### POST `/users/:id/reset-password`

**Body**

| Field | Required | Validation |
|-------|----------|------------|
| newPassword | Yes | passwordPolicy |
| confirmPassword | Yes | Match newPassword |

**Side effect:** Revoke all refresh tokens

**Status Codes:** 200, 400, 401, 403, 404, 500

---

### DELETE `/users/:id`

**Description:** Soft delete (= PATCH status INACTIVE)

**Status Codes:** 200, 400, 401, 403, 404, 409, 500

**Error:** 400 — Không thể xóa tài khoản của chính mình

---

### GET `/users/meta/roles`

**Response 200**

```json
{
  "success": true,
  "data": [{ "id": "uuid", "name": "Staff" }]
}
```

**Status Codes:** 200, 401, 403, 500

## Validation

Schemas: `backend/src/modules/user/user.validation.js`

## Security

Bearer + granular `user:*`. Admin-only operations in practice (seed). Reset password là privileged action.

## Error Handling

Standard `{ success: false, message }`. Validation errors 400 with details.

## Examples

Xem curl examples từng endpoint. Test flow: Admin tạo Staff → Staff login OK → Staff GET /users → 403.

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| PATCH status vs PUT | Semantic REST | Rõ activate/deactivate | Extra endpoint |
| Meta on User API | Form convenience | Single permission | Overlap Role list |

## Notes

Pagination defaults từ `parsePagination()` utility. Sort default `createdAt`.

## Checklist

- [x] 9 endpoints full spec
- [x] Query/body/response documented
- [x] Status + error codes
- [x] Business rules per endpoint
- [x] curl examples
