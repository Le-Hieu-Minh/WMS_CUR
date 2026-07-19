# Supplier – Developer Guide

## Trạng thái

✅ **Đã triển khai** — clone pattern warehouse/customer.

## Copy module nhanh

Supplier và Customer gần như identical (fields contactPerson, notes). Khi sửa một bên, cân nhắc đồng bộ validation FE/BE.

## Files

- `backend/src/modules/supplier/*`  
- `frontend/src/features/suppliers/pages/SuppliersPage.jsx`  

## Sprint 2

Goods Receipt sẽ reference `supplierId` — giữ soft delete.
