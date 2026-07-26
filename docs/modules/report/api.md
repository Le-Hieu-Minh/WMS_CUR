# Report – API

Base: `/api/v1/reports`

## Xem dữ liệu (JSON)

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/inventory` | report:read |
| GET | `/goods-receipts` | report:read |
| GET | `/goods-issues` | report:read |
| GET | `/stock-takes` | report:read |
| GET | `/stock-adjustments` | report:read |
| GET | `/stock-value` | report:read |

**Query chung:** `dateFrom`, `dateTo`, `warehouseId`, `page`, `limit` (một số báo cáo)

## Export

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/:type/export?format=excel\|pdf&...filters` | report:export |

`type` ∈ `inventory|goods-receipts|goods-issues|stock-takes|stock-adjustments|stock-value`

**Response:** `Content-Disposition: attachment` + binary file.
