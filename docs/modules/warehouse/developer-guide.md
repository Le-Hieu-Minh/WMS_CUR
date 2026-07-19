# Warehouse – Developer Guide

## Trạng thái

✅ **Đã triển khai** — pattern master data dùng chung với Product, Supplier, Customer.

## Pattern Master Data

```
BE: route → controller → service → repository → validation
FE: {module}Page.jsx → MasterDataListPage + warehouseApi + warehouseSchema
```

## File chính

| Layer | Path |
|-------|------|
| BE module | `backend/src/modules/warehouse/*` |
| FE page | `frontend/src/features/warehouses/pages/WarehousesPage.jsx` |
| Shared FE | `frontend/src/features/master-data/*` |

## Khi thêm field mới

1. Cập nhật Prisma model + `db push`  
2. validation BE + FE schema  
3. service create/update  
4. Thêm vào `fields` và `columns` trong WarehousesPage  

## Test thủ công

```bash
npm run dev
# /warehouses → CRUD, thử mã trùng
```

## Sprint 2

Warehouse sẽ được chọn trong phiếu nhập/xuất — giữ `code` ổn định, tránh hard delete.
