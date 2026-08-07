# Goods Issue – Frontend

## Overview

UI phiếu xuất tại **`/goods-issues`**. Cấu trúc mirror Goods Receipts.

## Purpose

CRUD phiếu xuất, confirm/cancel với phân quyền.

## Scope

List, dialog form, dynamic items. Không hiển thị tồn realtime trên form (MVP).

## Workflow

`GoodsIssuesPage` → `goodsIssueApi` + `goodsIssueSchema` + `useFieldArray`.

Options dialog: warehouses, products, **customers** (ACTIVE).

## Business Rules

UI ẩn Sửa/Xóa/Confirm khi không DRAFT hoặc thiếu permission.

## Technical Design

| File | Role |
|------|------|
| `pages/GoodsIssuesPage.jsx` | Main page |
| `api/goodsIssueApi.js` | HTTP |
| `schemas/goodsIssueSchema.js` | Zod form |

Default: `issueDate = today`, `items: [{ quantity: 1, unitPrice: 0 }]`.

## API / Database (nếu có)

Mapping 1:1 [api.md](./api.md).

## Validation

| Field | Rule |
|-------|------|
| warehouseId | required |
| customerId | optional |
| items[].unitPrice | min 0 |

Test: `schemas/__tests__/goodsIssueSchema.test.js`.

## Security

Permissions `goods-issue:*` via `usePermissions`.

## Error Handling

409 insufficient stock hiển thị message API trên ConfirmDialog.

## Examples

Confirm mutation → invalidate `['goods-issues']`.

## Design Decisions

Reuse layout goods-receipt — giảm cognitive load cho user kho.

## Notes

Pagination limit 10; filter status + search.

## Checklist

- [x] Full CRUD UI
- [x] Confirm/Cancel
- [ ] Show available qty on line (future)
