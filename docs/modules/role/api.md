# Role & Permission – API Design

Base URL: `/api/v1/roles`  
Tất cả endpoint yêu cầu Bearer token + permission tương ứng.

## Tổng hợp endpoints

| Method | Endpoint | Permission | Mô tả |
|--------|----------|------------|--------|
| GET | `/` | role:read | Danh sách + pagination |
| GET | `/meta/permissions` | role:read | Quyền nhóm theo module |
| GET | `/:id` | role:read | Chi tiết role |
| POST | `/` | role:create | Tạo role |
| PUT | `/:id` | role:update | Cập nhật role |
| DELETE | `/:id` | role:delete | Xóa role (hard) |

> Đặt `/meta/permissions` **trước** `/:id` để tránh conflict.

## GET `/roles`

**Query:** `page`, `limit`, `search`, `sortBy` (name|createdAt), `sortOrder`

**Response 200:** `data[]` + `pagination`  
Mỗi item: id, name, description, isSystem, userCount, permissions[], createdAt, updatedAt

## GET `/roles/meta/permissions`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": [{ "id": "uuid", "code": "user:read", "name": "Xem người dùng" }],
    "warehouse": [{ "id": "uuid", "code": "warehouse:create", "name": "Tạo kho" }]
  }
}
```

**Errors:** 401, 403, 500

## GET `/roles/:id`

**Response 200:** object role đầy đủ  
**Errors:** 401, 403, 404, 500

## POST `/roles`

**Body:**
```json
{
  "name": "Warehouse Clerk",
  "description": "Chỉ quản lý kho",
  "permissionIds": ["uuid-1", "uuid-2"]
}
```

**Response 201** · **Errors:** 400, 401, 403, 409, 500

## PUT `/roles/:id`

**Body:** `{ "name?", "description?", "permissionIds?" }`  
Không đổi tên nếu là system role.  
**Errors:** 400, 401, 403, 404, 409, 500

## DELETE `/roles/:id`

Hard delete. Cấm system role và role có user.  
**Response 200** · **Errors:** 400, 401, 403, 404, 409, 500
