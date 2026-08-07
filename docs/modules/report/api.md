# Report – API

## Overview

API báo cáo JSON và export file. Base `/api/v1/reports`.

## Purpose

Document endpoints, query params và response formats.

## Scope

Dynamic route `/:type` và `/:type/export` với type whitelist.

## Workflow

GET data → UI table. GET export → binary blob with Content-Disposition.

## Business Rules

Types: `inventory`, `stock-value`, `goods-receipts`, `goods-issues`, `stock-takes`, `stock-adjustments`.

## Technical Design

Express regex route param `:type(inventory|...)`. export defaults format=excel.

## API / Database

### Endpoints

| Method | Path | Permission | Mô tả |
|--------|------|------------|-------|
| GET | `/:type` | report:read | JSON preview |
| GET | `/:type/export` | report:export | File download |

### Query parameters (chung)

| Param | Áp dụng | Mô tả |
|-------|---------|-------|
| warehouseId | Tất cả | Lọc theo kho |
| dateFrom, dateTo | GR, GI, ST, SA | Khoảng ngày |
| format | export only | `excel` (default) \| `pdf` |

### JSON response

```json
{
  "success": true,
  "data": {
    "type": "inventory",
    "title": "Báo cáo tồn kho",
    "total": 42,
    "rows": [ { "warehouseCode": "...", "quantity": 100 } ]
  }
}
```

### Export response

| Format | Content-Type | Filename |
|--------|--------------|----------|
| excel | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | `{type}-{timestamp}.xlsx` |
| pdf | application/pdf | `{type}-{timestamp}.pdf` |

Headers: `Content-Disposition: attachment; filename="..."`

### Row schemas (keys)

| type | Columns |
|------|---------|
| inventory | warehouseCode, warehouseName, productCode, productName, unit, quantity, minStock, stockValue |
| stock-value | Same as inventory |
| goods-receipts | code, date, warehouseCode, supplierName, productCode, productName, quantity, unitCost |
| goods-issues | code, date, warehouseCode, customerName, productCode, productName, quantity, unitPrice |
| stock-takes | code, date, warehouseCode, productCode, productName, systemQty, countedQty, variance |
| stock-adjustments | code, date, warehouseCode, reason, productCode, productName, type, quantity |

## Validation

Invalid type → 404 Loại báo cáo không hỗ trợ. Invalid format → 400.

## Security

Both endpoints require JWT. export stricter permission.

## Error Handling

Standard ApiError envelope for JSON routes; export errors as JSON if middleware catches before stream.

## Examples

```
GET /api/v1/reports/stock-takes/export?warehouseId=uuid&dateFrom=2026-08-01&format=pdf
Authorization: Bearer ...
```

## Design Decisions

Single controller export/get — DRY via reportService.

## Notes

No request body. GET only.

## Checklist

- [x] All 6 types
- [x] Export formats
- [x] Query param table
- [ ] OpenAPI path regex doc
