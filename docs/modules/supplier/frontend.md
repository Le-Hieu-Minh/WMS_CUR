# Supplier – Frontend Design

## Route

`/suppliers` → SuppliersPage (`supplier:read`)

## Config MasterDataListPage

- **Fields:** code, name, contactPerson, phone, email, address, notes  
- **Columns:** Mã, Tên, Liên hệ, Điện thoại  
- **API:** supplierApi · **Schema:** supplierSchema  
- **Permissions:** supplier:create|update|delete  

## Structure

```
frontend/src/features/suppliers/pages/SuppliersPage.jsx
frontend/src/features/master-data/...
```

## Query key

`['suppliers', { page, search, status }]`
