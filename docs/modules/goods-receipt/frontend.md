# Goods Receipt – Frontend

## Overview

Giao diện quản lý phiếu nhập tại route **`/goods-receipts`**. React + React Hook Form + Zod + TanStack Query.

## Purpose

Cho phép người dùng tạo, sửa, xem, confirm, cancel và xóa phiếu nhập theo phân quyền.

## Scope

| Có | Không |
|----|-------|
| List + pagination + filter status | In phiếu PDF |
| Dialog create/edit/view | Import Excel |
| Dynamic line items | Mobile scanner |

## Workflow

```text
GoodsReceiptsPage
  → listQuery (goodsReceiptApi.list)
  → Dialog form (goodsReceiptSchema)
  → Mutations: create / update / confirm / cancel / remove
  → Invalidate ['goods-receipts']
```

## Business Rules

| UI rule | Implementation |
|---------|----------------|
| Chỉ DRAFT: Sửa, Xóa, Confirm, Cancel | Nút theo `status` + `hasPermission` |
| CONFIRMED/CANCELLED: chỉ xem | Read-only dialog |
| Min 1 dòng SP | useFieldArray + Zod min(1) |

## Technical Design

| File | Vai trò |
|------|---------|
| `pages/GoodsReceiptsPage.jsx` | Page chính |
| `api/goodsReceiptApi.js` | HTTP client |
| `schemas/goodsReceiptSchema.js` | Form validation |
| `components/shared/StatusBadge` | Badge DRAFT/CONFIRMED/CANCELLED |
| `components/shared/ConfirmDialog` | Confirm/Cancel/Delete |
| `hooks/usePermissions` | Ẩn/hiện action |

### State local

| State | Mục đích |
|-------|----------|
| page, search, statusFilter | List |
| dialogOpen, editing, viewing | Form modes |
| confirmTarget, cancelTarget, deleteTarget | Confirm dialogs |

### Options query

Load khi mở dialog: warehouses, products, suppliers (ACTIVE, limit 100).

## API / Database (nếu có)

FE gọi REST qua `goodsReceiptApi` — mapping 1:1 với [api.md](./api.md).

## Validation

`goodsReceiptSchema.js`:

| Field | Rule |
|-------|------|
| warehouseId | required string |
| supplierId | optional |
| receiptDate | required |
| items | min 1 |
| items[].quantity | positive |
| items[].unitCost | min 0 |

Lỗi API hiển thị qua `error.response.data.message`.

## Security

| Permission | UI |
|------------|-----|
| goods-receipt:create | Nút "Tạo phiếu" |
| goods-receipt:update | Sửa, Confirm, Cancel |
| goods-receipt:delete | Xóa DRAFT |
| goods-receipt:read | Truy cập trang |

## Error Handling

- `getErrorMessage(error)` → message API hoặc fallback "Có lỗi xảy ra".
- Form errors từ RHF + Zod resolver.
- Loading: `Loader2` spinner trên bảng và submit.

## Examples

**Thêm dòng SP:** `append({ productId: '', quantity: 1, unitCost: 0, note: '' })`.

**Confirm flow:** User click Confirm → `ConfirmDialog` → `goodsReceiptApi.confirm(id)`.

## Design Decisions

| Quyết định | Lý do |
|------------|-------|
| Dialog thay full page | Đồng bộ goods-issue, stock modules |
| Load options lazy (enabled: dialogOpen) | Giảm request khi chỉ xem list |
| Default receiptDate = hôm nay | UX nhập nhanh |

## Notes

- Pagination limit cố định 10.
- Search debounce: reset page về 1 khi đổi filter.
- Unit test schema: `schemas/__tests__/goodsReceiptSchema.test.js`.

## Checklist

- [x] List + filters
- [x] CRUD dialog DRAFT
- [x] Confirm / Cancel / Delete
- [x] Permission gates
- [x] StatusBadge
- [ ] E2E Playwright
