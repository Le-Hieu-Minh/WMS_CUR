# Supplier – API Design

Base URL: `/api/v1/suppliers`

## Endpoints

| Method | Endpoint | Permission | Mô tả |
|--------|----------|------------|--------|
| GET | `/` | supplier:read | Danh sách |
| GET | `/:id` | supplier:read | Chi tiết |
| POST | `/` | supplier:create | Tạo |
| PUT | `/:id` | supplier:update | Cập nhật |
| PATCH | `/:id/status` | supplier:update | Đổi trạng thái |
| DELETE | `/:id` | supplier:delete | Soft delete |

## GET `/suppliers`

**Query:** `page`, `limit`, `search`, `status`, `sortBy` (code|name|createdAt), `sortOrder`

## POST `/suppliers`

**Body:**
```json
{
  "code": "SUP-001",
  "name": "Công ty ABC",
  "contactPerson": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "abc@supplier.com",
  "address": "Hà Nội",
  "notes": null
}
```

**Errors:** 400, 401, 403, 409, 500

## PUT / PATCH / DELETE

Giống pattern Warehouse. DELETE → INACTIVE.
