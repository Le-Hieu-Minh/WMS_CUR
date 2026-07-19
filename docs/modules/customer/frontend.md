# Customer – Frontend Design

## Route

`/customers` → CustomersPage (`customer:read`)

## Config MasterDataListPage

- **Fields:** code, name, contactPerson, phone, email, address, notes  
- **Columns:** Mã, Tên, Liên hệ, Điện thoại  
- **API:** customerApi · **Schema:** customerSchema  
- **Permissions:** customer:create|update|delete  

## Structure

```
frontend/src/features/customers/pages/CustomersPage.jsx
frontend/src/features/master-data/...
```

## Query key

`['customers', { page, search, status }]`

## HomePage stats

`statsApi.getCounts()` gọi pagination total của products, warehouses, suppliers, customers.
