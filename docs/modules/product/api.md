# Product – API Design

Base URL: `/api/v1/products`  
Tất cả endpoint yêu cầu Bearer token + permission tương ứng.

## Tổng hợp endpoints

| Method | Endpoint | Permission | Mô tả |
|--------|----------|------------|--------|
| GET | `/` | product:read | Danh sách + pagination |
| GET | `/:id` | product:read | Chi tiết |
| POST | `/` | product:create | Tạo sản phẩm |
| PUT | `/:id` | product:update | Cập nhật |
| PATCH | `/:id/status` | product:update | Đổi trạng thái |
| DELETE | `/:id` | product:delete | Soft delete |

## GET `/products`

**Query:** `page`, `limit`, `search`, `status`, `category`, `sortBy` (code|name|price|createdAt), `sortOrder`

**Response 200:** price/costPrice là number trong JSON

## POST `/products`

**Body:**
```json
{
  "code": "PRD-001",
  "name": "Laptop Dell",
  "description": null,
  "category": "Electronics",
  "unit": "pcs",
  "price": 15000000,
  "costPrice": 12000000,
  "minStock": 5,
  "imageUrl": null
}
```

**Response 201** · **Errors:** 400, 401, 403, 409, 500

## PUT `/products/:id`

Body: tất cả field optional như create.  
**Errors:** 400, 401, 403, 404, 409, 500

## PATCH `/products/:id/status`

**Body:** `{ "status": "INACTIVE" }`

## DELETE `/products/:id`

Soft delete → INACTIVE.
