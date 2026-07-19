# Warehouse – API Design

Base URL: `/api/v1/warehouses`  
Tất cả endpoint yêu cầu Bearer token + permission tương ứng.

## Tổng hợp endpoints

| Method | Endpoint | Permission | Mô tả |
|--------|----------|------------|--------|
| GET | `/` | warehouse:read | Danh sách + pagination |
| GET | `/:id` | warehouse:read | Chi tiết kho |
| POST | `/` | warehouse:create | Tạo kho |
| PUT | `/:id` | warehouse:update | Cập nhật kho |
| PATCH | `/:id/status` | warehouse:update | Đổi ACTIVE/INACTIVE |
| DELETE | `/:id` | warehouse:delete | Soft delete → INACTIVE |

## GET `/warehouses`

**Query:** `page`, `limit`, `search`, `status`, `sortBy` (code|name|createdAt), `sortOrder`

**Response 200:** `data[]` + `pagination`  
Fields: id, code, name, address, phone, email, description, status, createdAt, updatedAt

## GET `/warehouses/:id`

**Errors:** 401, 403, 404, 500

## POST `/warehouses`

**Body:**
```json
{
  "code": "WH-001",
  "name": "Kho chính",
  "address": "123 Đường ABC",
  "phone": "0901234567",
  "email": "kho@company.com",
  "description": null
}
```

Mã `code` được normalize UPPERCASE server-side.  
**Response 201** · **Errors:** 400, 401, 403, 409, 500

## PUT `/warehouses/:id`

**Body:** tất cả field optional (code, name, address, phone, email, description)  
**Errors:** 400, 401, 403, 404, 409, 500

## PATCH `/warehouses/:id/status`

**Body:** `{ "status": "INACTIVE" }`  
**Errors:** 401, 403, 404, 500

## DELETE `/warehouses/:id`

Gọi nội bộ `changeStatus(id, 'INACTIVE')`.  
**Response 200** · **Errors:** 401, 403, 404, 500
