# Customer – API Design

Base URL: `/api/v1/customers`

## Endpoints

| Method | Endpoint | Permission | Mô tả |
|--------|----------|------------|--------|
| GET | `/` | customer:read | Danh sách |
| GET | `/:id` | customer:read | Chi tiết |
| POST | `/` | customer:create | Tạo |
| PUT | `/:id` | customer:update | Cập nhật |
| PATCH | `/:id/status` | customer:update | Đổi trạng thái |
| DELETE | `/:id` | customer:delete | Soft delete |

## GET `/customers`

**Query:** `page`, `limit`, `search`, `status`, `sortBy` (code|name|createdAt), `sortOrder`

## POST `/customers`

**Body:**
```json
{
  "code": "CUS-001",
  "name": "Công ty Alpha",
  "contactPerson": "Trần Thị B",
  "phone": "0912345678",
  "email": "alpha@customer.com",
  "address": "TP.HCM",
  "notes": null
}
```

**Errors:** 400, 401, 403, 409, 500

## PUT / PATCH / DELETE

Pattern giống Supplier. DELETE → INACTIVE.
