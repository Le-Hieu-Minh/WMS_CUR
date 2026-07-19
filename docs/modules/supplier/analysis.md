# Supplier – Phân tích nghiệp vụ (tổng hợp 23 mục)

## 1. Giới thiệu

Quản lý nhà cung cấp (NCC) — mã, tên, liên hệ, địa chỉ. Dùng cho phiếu nhập kho Sprint 2.

## 2. Mục tiêu

- CRUD NCC master data  
- Mã unique UPPERCASE  
- Soft delete INACTIVE  
- `supplier:*` permissions  

## 3. Nghiệp vụ

List/Search · Create · Update · Soft delete — Actor: Admin, Manager.

## 4. User Story

| ID | Story | P |
|----|-------|---|
| SUP-01 | Danh sách + search | Must |
| SUP-02 | Tạo NCC | Must |
| SUP-03 | Sửa thông tin liên hệ | Must |
| SUP-04 | Vô hiệu hóa | Must |

## 5–7. Flow

`/suppliers` → MasterDataListPage → CRUD tương tự Warehouse.

## 8. Business Rules

- code unique, UPPERCASE  
- Search: code, name, contactPerson, phone  
- DELETE = INACTIVE  

## 9. Validation

code 1–50, name 2–255, contactPerson max 255, phone 20, email, address 500, notes 1000

## 10. Exception

400 · 401 · 403 · 404 · 409 · 500  

## 11. Permission Matrix

GET → supplier:read · POST → create · PUT/PATCH → update · DELETE → delete

## 12–15. Design

Xem file con database, api, frontend, backend.

## 16. AC

CRUD, mã trùng 409, soft delete.

## 17. Testing

Unit service + FE supplierSchema + integration CRUD.

## 18–23. Docs

Tách file trong thư mục module.
