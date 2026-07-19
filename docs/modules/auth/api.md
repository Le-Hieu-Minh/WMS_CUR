# Auth – API Documentation

Base URL: `/api/v1/auth`

## Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| POST | `/login` | Public | Đăng nhập |
| POST | `/refresh` | Public | Cấp access token mới |
| POST | `/logout` | Bearer | Đăng xuất (revoke refresh) |
| GET | `/me` | Bearer | Thông tin user hiện tại |
| PUT | `/change-password` | Bearer | Đổi mật khẩu |

## POST `/login`

**Rate limit:** 10 request / 15 phút / IP

**Body:**
```json
{
  "email": "admin@wms.com",
  "password": "Admin@123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "admin@wms.com",
      "fullName": "System Admin",
      "avatarUrl": null,
      "role": {
        "id": "uuid",
        "name": "Admin",
        "permissions": ["user:read", "..."]
      }
    }
  }
}
```

**Errors:** 400, 401, 403, 423, 429, 500

## POST `/refresh`

**Body:** `{ "refreshToken": "..." }`

**Response 200:**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "...",
    "expiresIn": 900
  }
}
```

**Errors:** 400, 401, 500

## POST `/logout`

**Headers:** `Authorization: Bearer <accessToken>`  
**Body:** `{ "refreshToken": "..." }`  
**Response 200:** message đăng xuất thành công  

## GET `/me`

**Response 200:** user profile + role + permissions + `lastLoginAt`  
**Errors:** 401, 404, 500

## PUT `/change-password`

**Body:**
```json
{
  "currentPassword": "Admin@123",
  "newPassword": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

**Side effect:** revoke tất cả refresh tokens → bắt đăng nhập lại  
**Errors:** 400, 401, 500

## Swagger

`http://localhost:3000/api-docs` — tag **Auth**
