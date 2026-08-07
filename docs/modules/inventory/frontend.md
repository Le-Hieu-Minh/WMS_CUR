# Inventory – Frontend

## Overview

Trang **Tồn kho** tại `/inventories` — read-only table với search và filter.

## Purpose

Hiển thị tồn, cảnh báo sắp hết, giá trị tồn.

## Scope

List + filter. Không form edit.

## Workflow

```text
InventoryPage
  → warehousesQuery (options)
  → listQuery (inventoryApi.list)
  → Table + Pagination + Badge low stock
```

## Business Rules

| UI | Rule |
|----|------|
| Badge "Sắp hết" | isLowStock |
| Filter LOW | query lowStock=true |
| Không nút Sửa | Read-only by design |

## Technical Design

| File | Role |
|------|------|
| `pages/InventoryPage.jsx` | Page |
| `api/inventoryApi.js` | `list(params)` only |

Columns: Kho, SP, ĐVT, Tồn, Min, Giá trị, Trạng thái.

## API / Database (nếu có)

`inventoryApi.list({ page, limit: 10, search, warehouseId, lowStock })`.

## Validation

Client: filter state only; server validates UUID.

## Security

Trang cần `inventory:read` (route guard app-level).

## Error Handling

Loading spinner `Loader2`; empty state khi no rows.

## Examples

User chọn kho HN + "Sắp hết" → chỉ rows quantity <= minStock tại kho đó.

## Design Decisions

No edit UI reinforces document-driven stock changes.

## Notes

Format number vi-VN có thể dùng `toLocaleString` (page hiện tại hiển thị raw/format tùy implement).

## Checklist

- [x] List + pagination
- [x] Warehouse filter
- [x] Low stock filter
- [x] Search
- [ ] Export CSV (future)
