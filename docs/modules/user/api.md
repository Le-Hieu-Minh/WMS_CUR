# User – API Design

Base URL: `/api/v1/users`  
Tất cả endpoint yêu cầu Bearer token + permission tương ứng.

## Tổng hợp endpoints

| Method | Endpoint | Permission | Mô tả |
|--------|----------|------------|--------|
| GET | `/` | user:read | Danh sách + pagination |
| GET | `/:id` | user:read | Chi tiết |
| POST | `/` | user:create | Tạo user |
| PUT | `/:id` | user:update | Cập nhật |
| PATCH | `/:id/status` | user:update | ACTIVE / INACTIVE |
| POST | `/:id/unlock` | user:update | Mở khóa LOCKED |
| POST | `/:id/reset-password` | user:update | Reset mật khẩu |
| DELETE | `/:id` | user:delete | Soft delete |
| GET | `/meta/roles` | user:read | Options role cho form |

## GET `/users`

**Query:** `page`, `limit`, `search`, `status`, `roleId`, `sortBy`, `sortOrder`

**Response 200:** `data[]` + `pagination`  
Mỗi item: id, email, fullName, avatarUrl, status, role `{id,name}`, lastLoginAt, createdAt

## GET `/users/:id`

Thêm field vận hành: `failedLoginAttempts`, `lockedUntil`  
**Errors:** 401, 403, 404, 500

## POST `/users`

**Body:**
```json
{
  "email": "staff@wms.com",
  "fullName": "Nguyen Van A",
  "password": "Staff@123",
  "roleId": "uuid",
  "avatarUrl": null
}
```

**Response 201** · **Errors:** 400, 401, 403, 409, 500

## PUT `/users/:id`

**Body:** `{ "fullName", "roleId", "avatarUrl" }`  
**Errors:** thêm 409 nếu vi phạm last Admin

## PATCH `/users/:id/status`

**Body:** `{ "status": "INACTIVE" }`  
INACTIVE → revoke all refresh tokens

## POST `/users/:id/unlock`

Body rỗng. Set ACTIVE + reset lock fields.

## POST `/users/:id/reset-password`

**Body:**
```json
{
  "newPassword": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

Revoke all tokens.

## DELETE `/users/:id`

Soft delete (= INACTIVE + revoke tokens).  
Cấm self / last Admin.

## GET `/users/meta/roles`

```json
{
  "success": true,
  "data": [{ "id": "uuid", "name": "Staff" }]
}
```
