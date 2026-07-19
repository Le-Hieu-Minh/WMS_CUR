# Product – Frontend Design

## Routes

| Path | Page | Guard |
|------|------|-------|
| `/products` | ProductsPage | Protected + `product:read` |

## ProductsPage

Dùng `MasterDataListPage` với config sản phẩm.

### Fields

code, name, category, unit, price (number), costPrice (number), minStock (number), description

### Columns

Mã · Tên · Danh mục · ĐVT · Giá bán (format `vi-VN`)

### Permissions

`product:create` · `product:update` · `product:delete`

## Feature structure

```
frontend/src/features/products/pages/ProductsPage.jsx
frontend/src/features/master-data/api/masterDataApi.js       # productApi
frontend/src/features/master-data/schemas/masterDataSchema.js # productSchema
```

## Query keys

```
['products', { page, search, status }]
```

## Ghi chú UI

- Default unit `pcs`, price/costPrice/minStock = 0  
- Chưa có upload imageUrl trên FE (field có trên BE)
