# Customer – Phân tích nghiệp vụ (tổng hợp 23 mục)

## 1. Giới thiệu

Quản lý khách hàng (KH) — master data cho phiếu xuất kho Sprint 2.

## 2. Mục tiêu

- CRUD khách hàng  
- Mã KH unique UPPERCASE  
- Soft delete INACTIVE  
- `customer:*` permissions  

## 3. Nghiệp vụ

List/Search · Create · Update · Soft delete — Admin, Manager.

## 4. User Story

| ID | Story | P |
|----|-------|---|
| CUS-01 | Danh sách + search | Must |
| CUS-02 | Tạo KH | Must |
| CUS-03 | Sửa liên hệ | Must |
| CUS-04 | Vô hiệu hóa | Must |

## 5–7. Flow

`/customers` → MasterDataListPage → CRUD.

## 8. Business Rules

- code unique, UPPERCASE  
- Search: code, name, contactPerson, phone  
- DELETE = INACTIVE  

## 9. Validation

Giống Supplier: code, name, contactPerson, phone, email, address, notes

## 10. Exception

400 · 401 · 403 · 404 · 409 · 500  

## 11. Permission Matrix

GET → customer:read · POST → create · PUT/PATCH → update · DELETE → delete

## 12–15. Design

Xem database, api, frontend, backend.

## 16. AC

CRUD đầy đủ, soft delete, phân quyền.

## 17. Testing

Unit + integration + FE customerSchema.

## 18–23. Docs

File con trong thư mục module.
