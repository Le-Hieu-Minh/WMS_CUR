# Inventory – API Design

## Overview

API **read-only** tra cứu tồn kho. Base: **`/api/v1/inventories`**.

## Purpose

Contract cho FE Inventory page và báo cáo.

## Scope

**Chỉ GET /**. Không POST/PUT/DELETE.

## Workflow

Client gọi list với filter → service map computed fields → paginated response.

## Business Rules

Response includes `isLowStock`, `stockValue` (server computed).

## Technical Design

Single endpoint; `inventoryController.list` → `inventoryService.list`.

## API / Database (nếu có)

### GET `/`

| Param | Type | Mô tả |
|-------|------|-------|
| page | int | Default 1 |
| limit | int | 1–100, default 10 |
| search | string | SP name/code, warehouse name/code |
| warehouseId | uuid | Lọc kho |
| productId | uuid | Lọc SP |
| lowStock | `true`\|`false` | Chỉ hàng sắp hết |
| sortBy | enum | quantity \| updatedAt \| createdAt |
| sortOrder | asc \| desc | |

**Permission:** `inventory:read`

### Response item

| Field | Type | Mô tả |
|-------|------|-------|
| id | uuid | PK inventory |
| warehouseId | uuid | |
| warehouse | object | `{ id, code, name }` |
| productId | uuid | |
| product | object | `{ id, code, name, unit, minStock, costPrice, price, status }` |
| quantity | number | Tồn hiện tại |
| minStock | number | Từ product |
| isLowStock | boolean | quantity <= minStock |
| stockValue | number | quantity × costPrice |
| createdAt | datetime | |
| updatedAt | datetime | |

### Pagination

Standard: `{ page, limit, total, totalPages }`.

## Validation

`listInventorySchema` — Zod query coercion.

## Security

`authenticate` + `authorize('inventory:read')`.

## Error Handling

| Code | Cause |
|------|-------|
| 400 | Invalid UUID query |
| 403 | Missing permission |

## Examples

```http
GET /api/v1/inventories?warehouseId=...&lowStock=true&page=1&limit=10
Authorization: Bearer <token>
```

```json
{
  "success": true,
  "data": [{
    "quantity": 5,
    "minStock": 10,
    "isLowStock": true,
    "stockValue": 250000
  }],
  "pagination": { "page": 1, "limit": 10, "total": 3 }
}
```

## Design Decisions

| Quyết định | Ghi chú |
|------------|---------|
| lowStock=true loads all then filters | Performance trade-off MVP; document for ops |
| No GET /:id | List đủ use case |

## Notes

Mutations **không** expose qua HTTP — dùng `inventoryRepository` từ module khác.

## Checklist

- [x] GET documented
- [x] Response fields complete
- [x] Explicit no write endpoints
