# Dashboard – API Design

## Overview

API Dashboard read-only. Base: **`/api/v1/dashboard`**.

## Purpose

Một endpoint tổng hợp toàn bộ dữ liệu trang chủ.

## Scope

GET `/overview` only.

## Workflow

Client gọi once on mount → cache TanStack Query key `['dashboard','overview']`.

## Business Rules

Response structure cố định 5 sections.

## Technical Design

Controller `overview` → `dashboardService.getOverview()`.

## API / Database (nếu có)

### GET `/overview`

| | |
|---|---|
| **Permission** | `dashboard:read` |
| **Auth** | Bearer JWT |
| **Query** | none |

### Response `data`

#### `summary`

| Field | Type | Mô tả |
|-------|------|-------|
| totalProducts | number | SP ACTIVE |
| totalWarehouses | number | Kho ACTIVE |
| totalStockQty | number | Tổng quantity all inventories |
| totalStockValue | number | Σ(qty × costPrice) |
| receiptsToday | number | Phiếu nhập CONFIRMED hôm nay |
| issuesToday | number | Phiếu xuất CONFIRMED hôm nay |

#### `lowStock` (max 10)

| Field | Type |
|-------|------|
| id | uuid (inventory id) |
| warehouse | `{ id, code, name }` |
| product | `{ id, code, name, unit, minStock }` |
| quantity | number |
| minStock | number |

Sorted: quantity ASC. Filter: quantity <= minStock.

#### `topReceived` / `topIssued` (max 5 each)

| Field | Type |
|-------|------|
| productId | uuid |
| code | string |
| name | string |
| unit | string |
| totalQuantity | number |

Aggregate: SUM(item.quantity) WHERE parent.status=CONFIRMED, ORDER BY total DESC.

#### `monthlyChart` (12 entries)

| Field | Type | Mô tả |
|-------|------|-------|
| month | string | `MM/YYYY` |
| receipts | number | Số phiếu nhập CONFIRMED trong tháng |
| issues | number | Số phiếu xuất CONFIRMED trong tháng |

Rolling 12 months ending current month.

### Example response

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalProducts": 120,
      "totalWarehouses": 3,
      "totalStockQty": 45000,
      "totalStockValue": 9000000000,
      "receiptsToday": 2,
      "issuesToday": 5
    },
    "lowStock": [],
    "topReceived": [],
    "topIssued": [],
    "monthlyChart": [
      { "month": "09/2025", "receipts": 4, "issues": 6 }
    ]
  }
}
```

## Validation

No request body/query.

## Security

`authenticate` + `authorize('dashboard:read')`.

## Error Handling

| Code | Cause |
|------|-------|
| 401 | Unauthenticated |
| 403 | No dashboard:read |
| 500 | DB/query error |

## Examples

```http
GET /api/v1/dashboard/overview
Authorization: Bearer <token>
```

## Design Decisions

Raw SQL `$queryRawUnsafe` for top products — table names fixed internal, limit capped 1–20.

## Notes

Swagger documented on route file.

## Checklist

- [x] Full response schema
- [x] KPI definitions
- [x] Chart semantics (count not qty)
