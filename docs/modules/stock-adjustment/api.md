# Stock Adjustment – API

## Overview

REST API phiếu điều chỉnh tồn. Base: `/api/v1/stock-adjustments`.

## Purpose

Contract HTTP cho client và kiểm thử.

## Scope

7 endpoints CRUD + confirm/cancel. Không có meta warehouse-products (user chọn SP từ master list).

## Workflow

POST create → PUT update (optional) → POST confirm.

## Business Rules

Body gửi `type` + `quantity`; server không tính type từ delta.

## Technical Design

Pattern giống stock-take module; permission prefix `stock-adjustment:`.

## API / Database

### Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | stock-adjustment:read |
| GET | `/:id` | stock-adjustment:read |
| POST | `/` | stock-adjustment:create |
| PUT | `/:id` | stock-adjustment:update |
| POST | `/:id/confirm` | stock-adjustment:update |
| POST | `/:id/cancel` | stock-adjustment:update |
| DELETE | `/:id` | stock-adjustment:delete |

### Query list

| Param | Mô tả |
|-------|-------|
| page, limit | Phân trang |
| search | code, reason, note |
| status | DRAFT \| CONFIRMED \| CANCELLED |
| warehouseId | Lọc kho |
| sortBy | createdAt \| adjustDate \| code |

### Request body

```json
{
  "warehouseId": "uuid",
  "adjustDate": "2026-08-07",
  "reason": "Hàng hư do ẩm mốc",
  "note": "",
  "items": [
    {
      "productId": "uuid",
      "type": "DECREASE",
      "quantity": 5,
      "note": null
    }
  ]
}
```

### Item response

| Field | Mô tả |
|-------|-------|
| type | INCREASE \| DECREASE |
| quantity | Số lượng điều chỉnh |
| product | Thông tin SP |

## Validation

Zod: `reason` min 3; `quantity` positive; `type` enum.

## Security

JWT + authorize per route.

## Error Handling

| Message | HTTP |
|---------|------|
| Không đủ tồn kho cho sản phẩm {code}. Hiện có: {n} | 409 |
| Chỉ thao tác được trên phiếu ở trạng thái Nháp | 409 |
| Lý do phải có ít nhất 3 ký tự | 400 |

## Examples

Confirm INCREASE tạo inventory row nếu SP chưa có tồn tại kho (via increaseStock).

## Design Decisions

Confirm dùng permission `update` thay vì tách `confirm` — đồng bộ GR/GI/ST.

## Notes

Swagger chưa tag riêng — có thể bổ sung mirror stock-take.

## Checklist

- [x] Endpoint table
- [x] Body schema
- [x] Error 409 insufficient stock
- [ ] OpenAPI examples
