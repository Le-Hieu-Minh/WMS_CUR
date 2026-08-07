# Product – Frontend

## Overview

UI quản lý sản phẩm tại `/products`, cấu hình `MasterDataListPage` với fields giá, danh mục và format tiền tệ.

## Purpose

Mô tả cấu trúc component, form fields và hành vi list/search phía client.

## Scope

Trang ProductsPage và shared master-data layer. Không gồm chọn SP trên phiếu.

## Workflow

ProductsPage → MasterDataListPage → productApi + productSchema → CRUD dialog/table.

## Business Rules

| UI | Rule |
|----|------|
| Xóa | Chỉ ACTIVE |
| Giá bán cột | `toLocaleString('vi-VN')` |
| Default form | unit=pcs, price/costPrice/minStock=0 |
| Permissions | product:create/update/delete |

## Technical Design

| File | Role |
|------|------|
| `features/products/pages/ProductsPage.jsx` | Page config |
| `master-data/components/MasterDataListPage.jsx` | Shared UI |
| `master-data/api/masterDataApi.js` | productApi |
| `master-data/schemas/masterDataSchema.js` | productSchema |

**Fields:** code, name, category, unit, price, costPrice, minStock, description

**Columns:** code, name, category, unit, price (formatted)

**Không có:** imageUrl field trên form (BE hỗ trợ qua API)

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

productSchema: code/name required; price/costPrice coerce ≥0; minStock int ≥0.

Number fields giữ giá trị 0; string fields empty → null khi submit.

## Security

usePermissions cho nút Thêm/Sửa/Xóa.

## Error Handling

getErrorMessage từ API response; formError trong dialog.

## Examples

Thêm SP: PRD-001, Laptop Dell, Electronics, giá 15000000.

## Design Decisions

| Decision | Reason |
|----------|--------|
| Number inputs for price | HTML step 0.01 |
| No category dropdown | Free text match BE |
| Shared page component | Consistency |

## Notes

List limit=10 fixed. No category filter on UI (API supports category param).

## Checklist

- [x] Fields/columns match ProductsPage.jsx
- [x] Price formatting documented
- [ ] Add category filter UI (optional)
