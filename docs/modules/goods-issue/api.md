# Goods Issue – API Design

## Overview

REST API phiếu xuất kho. Base: **`/api/v1/goods-issues`**.

## Purpose

Contract HTTP đầy đủ cho client.

## Scope

7 endpoints CRUD + confirm/cancel. Không reservation API.

## Workflow

Mirror goods-receipt; confirm gọi `decreaseStock`.

## Business Rules

Confirm chỉ DRAFT; thiếu tồn → 409 toàn phiếu.

## Technical Design

Envelope `{ success, data, pagination? }`.

## API / Database (nếu có)

### Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | goods-issue:read |
| GET | `/:id` | goods-issue:read |
| POST | `/` | goods-issue:create |
| PUT | `/:id` | goods-issue:update |
| POST | `/:id/confirm` | goods-issue:update |
| POST | `/:id/cancel` | goods-issue:update |
| DELETE | `/:id` | goods-issue:delete |

### GET `/` — Query

| Param | Type | Mô tả |
|-------|------|-------|
| page, limit | int | Phân trang |
| search | string | code, note |
| status | enum | DRAFT \| CONFIRMED \| CANCELLED |
| warehouseId | uuid | |
| customerId | uuid | |
| sortBy | enum | createdAt \| issueDate \| code |
| sortOrder | asc \| desc | |

### List / Detail fields

| Field | Type | Ghi chú |
|-------|------|---------|
| id, code | uuid, string | GI-YYYYMMDD-XXXX |
| warehouseId, warehouse | uuid, object | |
| customerId, customer | uuid\|null, object\|null | |
| status | DocumentStatus | |
| issueDate | date | |
| note | string\|null | |
| createdBy, confirmedBy | user objects | |
| confirmedAt | datetime\|null | |
| itemCount | int | List only |
| items[] | array | Detail |
| items[].quantity | number | > 0 |
| items[].unitPrice | number | >= 0 |
| items[].product | object | code, name, unit |

### POST / PUT body

| Field | Required | Validation |
|-------|----------|------------|
| warehouseId | ✓ | UUID, ACTIVE |
| customerId | | Optional UUID |
| issueDate | ✓ | Date string |
| note | | Max 1000 |
| items | ✓ | Min 1 |
| items[].productId | ✓ | Unique, ACTIVE |
| items[].quantity | ✓ | Positive |
| items[].unitPrice | | Min 0, default 0 |
| items[].note | | Max 500 |

### POST confirm

- Body: none
- Success 200: status CONFIRMED
- Error 409: insufficient stock message

## Validation

`goodsIssue.validation.js` — Zod schemas.

## Security

JWT + authorize per route.

## Error Handling

| Code | Message |
|------|---------|
| 409 | Không đủ tồn kho cho sản phẩm {code}. Hiện có: {n} |
| 409 | Chỉ thao tác được trên phiếu ở trạng thái Nháp |

## Examples

```json
POST /api/v1/goods-issues
{
  "warehouseId": "...",
  "customerId": "...",
  "issueDate": "2026-08-07",
  "items": [{ "productId": "...", "quantity": 5, "unitPrice": 80000 }]
}
```

## Design Decisions

Confirm dùng permission `update` (không tách `confirm` permission).

## Notes

FE: `goodsIssueApi.js`.

## Checklist

- [x] Endpoints + fields
- [x] Confirm error 409 documented
- [ ] OpenAPI sync
