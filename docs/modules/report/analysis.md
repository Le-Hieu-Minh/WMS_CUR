# Report – Phân tích nghiệp vụ

## Overview

Phân tích nhu cầu báo cáo Sprint 3 và nguồn dữ liệu từng loại.

## Purpose

Map report type → bảng/query → cột output cho BA và dev.

## Scope

Operational reporting MVP; không data warehouse.

## Workflow

User chọn report → apply filters → preview → export optional.

## Business Rules

| Type | Nguồn | Filter ngày |
|------|-------|-------------|
| inventory | inventories | Không (chỉ warehouseId) |
| stock-value | inventories + costPrice | Không |
| goods-receipts | goods_receipt_items (CONFIRMED) | receiptDate |
| goods-issues | goods_issue_items (CONFIRMED) | issueDate |
| stock-takes | stock_take_items (CONFIRMED) | takeDate |
| stock-adjustments | stock_adjustment_items (CONFIRMED) | adjustDate |

## Technical Design

REPORT_HANDLERS map type string → async function(query).

Row shape = flat object; Excel/PDF headers = Object.keys(first row).

## API / Database

Read-only queries — xem database.md.

## Validation

dateTo inclusive end of day (23:59:59.999).

## Security

Export permission tách read — staff có thể xem nhưng không tải file.

## Error Handling

Empty dataset → response rows=[]; Excel sheet "Không có dữ liệu".

## Examples

stock-takes row: code, date, warehouseCode, productCode, systemQty, countedQty, variance.

## Design Decisions

Item-level reports (not header-only) — chi tiết theo dòng SP.

## Notes

Variance computed at report time from stored system_qty/counted_qty.

## Checklist

- [x] Source table per type
- [x] CONFIRMED filter
- [ ] Business sign-off column list
