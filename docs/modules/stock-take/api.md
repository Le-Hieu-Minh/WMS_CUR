# Stock Take – API

## Overview

REST API quản lý phiếu kiểm kê. Base path: `/api/v1/stock-takes`. Tất cả endpoint yêu cầu Bearer token.

## Purpose

Mô tả contract HTTP cho client (frontend, integration test, Swagger).

## Scope

CRUD phiếu, confirm/cancel, meta lấy sản phẩm theo kho. Không có endpoint sửa tồn trực tiếp.

## Workflow

Typical flow: `POST /` → `PUT /:id` (optional) → `POST /:id/confirm`.

## Business Rules

Confirm chỉ chấp nhận khi `status = DRAFT`. Response item luôn có `variance = countedQty - systemQty`.

## Technical Design

Middleware: `authenticate` → `authorize(permission)` → `validate(zod)` → controller → service.

## API / Database

### Endpoints

| Method | Path | Permission | Mô tả |
|--------|------|------------|-------|
| GET | `/` | stock-take:read | Danh sách (phân trang) |
| GET | `/meta/warehouse-products?warehouseId=` | stock-take:create hoặc update | SP + system_qty tại kho |
| GET | `/:id` | stock-take:read | Chi tiết |
| POST | `/` | stock-take:create | Tạo DRAFT |
| PUT | `/:id` | stock-take:update | Sửa DRAFT |
| POST | `/:id/confirm` | stock-take:update | Xác nhận → cập nhật tồn |
| POST | `/:id/cancel` | stock-take:update | Hủy DRAFT |
| DELETE | `/:id` | stock-take:delete | Xóa DRAFT |

### Query list

| Param | Kiểu | Mô tả |
|-------|------|-------|
| page, limit | number | Phân trang (limit max 100) |
| search | string | Tìm code, note |
| status | DRAFT \| CONFIRMED \| CANCELLED | Lọc trạng thái |
| warehouseId | uuid | Lọc kho |
| sortBy | createdAt \| takeDate \| code | Sắp xếp |
| sortOrder | asc \| desc | |

### Request body (create / update)

```json
{
  "warehouseId": "uuid",
  "takeDate": "2026-08-07",
  "note": "Kiểm kê cuối tháng",
  "items": [
    {
      "productId": "uuid",
      "countedQty": 95,
      "note": "Thiếu 5 do vỡ"
    }
  ]
}
```

### Response item (detail)

| Field | Kiểu | Mô tả |
|-------|------|-------|
| systemQty | number | Tồn hệ thống lúc snapshot |
| countedQty | number | Số đếm |
| variance | number | countedQty - systemQty |
| product | object | code, name, unit |

### Response envelope

Chuẩn `{ success, data, pagination? }` qua `successResponse`.

## Validation

Zod schema `takeBodySchema`: items min 1; `countedQty` coerce number ≥ 0.

## Security

JWT bắt buộc. Permission granular theo hành động (confirm dùng `update`, không tách `confirm` riêng).

## Error Handling

| Message (VN) | HTTP |
|--------------|------|
| Không tìm thấy phiếu kiểm kê | 404 |
| Chỉ thao tác được trên phiếu ở trạng thái Nháp | 409 |
| Kho không tồn tại hoặc đã ngừng hoạt động | 400 |
| Không được trùng sản phẩm trong cùng phiếu kiểm kê | 400 |

## Examples

```http
POST /api/v1/stock-takes/uuid/confirm
Authorization: Bearer <token>
```

→ 200, `status: CONFIRMED`, `confirmedBy`, `confirmedAt` populated.

## Design Decisions

| Quyết định | Lý do |
|------------|-------|
| Meta endpoint riêng | Tránh over-fetch list API |
| Không nhận systemQty từ body | Tránh client giả mạo snapshot |

## Notes

Swagger tag: `Stock Takes`. Confirm trigger audit bất đồng bộ sau transaction.

## Checklist

- [x] Document 8 endpoints
- [x] Body/query tables
- [x] Error mapping
- [ ] Postman collection export
