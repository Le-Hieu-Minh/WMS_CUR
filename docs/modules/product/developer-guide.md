# Product – Developer Guide

## Trạng thái

✅ **Đã triển khai**

## Khác biệt so với Warehouse

- `mapProduct` xử lý Prisma Decimal  
- Filter thêm `category`  
- sortBy có `price`  
- FE format giá cột bảng  

## File

- BE: `backend/src/modules/product/*`  
- FE: `frontend/src/features/products/pages/ProductsPage.jsx`  

## imageUrl

BE hỗ trợ URL; upload R2 có thể bổ sung Sprint sau mà không đổi API contract.

## Test

```bash
# POST product → GET list → verify price number
# Duplicate code → 409
```
