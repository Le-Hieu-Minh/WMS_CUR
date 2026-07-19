# Customer – Developer Guide

## Trạng thái

✅ **Đã triển khai**

## Pattern

Identical với Supplier — chỉ khác tên module và permission prefix `customer:`.

## Files

- `backend/src/modules/customer/*`  
- `frontend/src/features/customers/pages/CustomersPage.jsx`  

## statsApi

`masterDataApi.js` có `statsApi.getCounts()` dùng cho HomePage — đảm bảo permission read tương ứng khi gọi.

## Test

```bash
# CRUD /customers
# Soft delete → status INACTIVE, vẫn GET được trong list filter
```
