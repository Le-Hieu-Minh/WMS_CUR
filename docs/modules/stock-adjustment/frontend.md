# Stock Adjustment – Frontend

## Overview

UI phiếu điều chỉnh tại `/stock-adjustments`, feature `frontend/src/features/stock-adjustments/`.

## Purpose

Form tạo/sửa phiếu với chọn loại INCREASE/DECREASE, lý do và confirm có kiểm tra quyền.

## Scope

| File | Vai trò |
|------|---------|
| StockAdjustmentsPage.jsx | List + dialog |
| stockAdjustmentApi.js | HTTP client |
| stockAdjustmentSchema.js | Zod form |

## Workflow

User chọn kho → thêm dòng SP + type + quantity + reason header → save DRAFT → confirm.

## Business Rules

UI không cho quantity ≤ 0. Select type bắt buộc. Nút confirm chỉ khi DRAFT + permission update.

## Technical Design

React Query, react-hook-form, useFieldArray, ConfirmDialog. Product list từ `productApi` master data (không auto-load tồn như stock take).

Permissions: `stock-adjustment:create|update|delete`.

## API / Database

`stockAdjustmentApi`: list, getById, create, update, confirm, cancel, remove.

## Validation

`stockAdjustmentSchema`: reason min 3; item type enum; quantity positive.

## Security

usePermissions gates actions. Route-level auth in app.

## Error Handling

Hiển thị API 409 insufficient stock message trên confirm.

## Examples

Table columns: code, kho, ngày, reason (truncate), status, item count.

## Design Decisions

Manual product pick — adjustment thường ít dòng, không cần preload all warehouse inventory.

## Notes

Schema test: `schemas/__tests__/stockAdjustmentSchema.test.js`.

## Checklist

- [x] CRUD UI
- [x] Type select INCREASE/DECREASE
- [x] Reason field
- [ ] Show current stock hint on DECREASE (future UX)
