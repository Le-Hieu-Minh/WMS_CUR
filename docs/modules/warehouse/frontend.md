# Warehouse – Frontend Design

## Routes

| Path | Page | Guard |
|------|------|-------|
| `/warehouses` | WarehousesPage | Protected + `warehouse:read` |

## Kiến trúc UI

Dùng component dùng chung `MasterDataListPage` với cấu hình module.

## WarehousesPage config

| Prop | Giá trị |
|------|---------|
| title | Kho hàng |
| queryKey | warehouses |
| api | warehouseApi |
| schema | warehouseSchema |
| permissions | create/update/delete → `warehouse:*` |

### Fields form

code, name, address (textarea), phone, email, description (textarea)

### Cột bảng

Mã · Tên kho · Điện thoại · Địa chỉ · Trạng thái · Thao tác

## Feature structure

```
frontend/src/features/
├── warehouses/pages/WarehousesPage.jsx
├── master-data/
│   ├── components/MasterDataListPage.jsx
│   ├── api/masterDataApi.js      # warehouseApi
│   └── schemas/masterDataSchema.js  # warehouseSchema
```

## Query keys

```
['warehouses', { page, search, status }]
```

## Hành vi UI

- Search + filter trạng thái  
- Dialog tạo/sửa (RHF + Zod)  
- Xóa = confirm → `api.remove` (soft delete BE)  
- Chỉ hiện nút xóa khi status ACTIVE  

## Permission UI

`usePermissions()` + `PermissionRoute permission="warehouse:read"`
