# Dashboard – Database Schema

## Overview

Dashboard **không có bảng riêng** — đọc aggregate từ bảng hiện có.

## Purpose

Liệt kê bảng/cột tham gia mỗi KPI.

## Scope

Read queries only.

## Workflow

```text
dashboard.service
  → prisma.product.count / warehouse.count
  → prisma.inventory.findMany (summary, lowStock)
  → prisma.goodsReceipt/Issue.count (today)
  → prisma.goodsReceipt/Issue.findMany (monthly chart)
  → $queryRawUnsafe (top products from items)
```

## Business Rules

Chỉ CONFIRMED documents vào top/chart (trừ today count cũng CONFIRMED).

## Technical Design

No migrations for dashboard module.

## API / Database (nếu có)

### Bảng sử dụng

| Bảng | Usage |
|------|-------|
| products | totalProducts (status=ACTIVE); costPrice for value; minStock for low |
| warehouses | totalWarehouses (ACTIVE) |
| inventories | totalStockQty/Value; lowStock |
| goods_receipts | receiptsToday; monthlyChart receipts |
| goods_receipt_items | topReceived SUM(quantity) |
| goods_issues | issuesToday; monthlyChart issues |
| goods_issue_items | topIssued SUM(quantity) |

### Query: top products (conceptual)

```sql
SELECT p.id, p.code, p.name, p.unit, SUM(i.quantity)::float AS total_quantity
FROM goods_receipt_items i
INNER JOIN goods_receipts d ON d.id = i.goods_receipt_id
INNER JOIN products p ON p.id = i.product_id
WHERE d.status = 'CONFIRMED'
GROUP BY p.id, p.code, p.name, p.unit
ORDER BY total_quantity DESC
LIMIT 5;
```

(Issue variant: `goods_issue_items` + `goods_issues`.)

### Date filtering

| Metric | Column | Logic |
|--------|--------|-------|
| receiptsToday | goods_receipts.receipt_date | gte/lte start/end of today |
| issuesToday | goods_issues.issue_date | same |
| monthlyChart | receipt_date / issue_date | >= first day 11 months ago |

## Validation

N/A.

## Security

DB user app — same as other modules; authorization at API.

## Error Handling

SQL injection mitigated: table names hardcoded in service, limit numeric bounded.

## Examples

Inventory row qty=3, minStock=10 → appears in lowStock.

## Design Decisions

No materialized views MVP — refresh on each page load.

## Notes

Server timezone affects "today" boundaries.

## Checklist

- [x] Source tables mapped
- [x] CONFIRMED filter noted
- [x] No dedicated dashboard tables
