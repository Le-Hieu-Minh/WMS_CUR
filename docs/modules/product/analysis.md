# Product – Phân tích nghiệp vụ (tổng hợp 23 mục)

## 1. Giới thiệu

Quản lý danh mục sản phẩm: mã, tên, danh mục, đơn vị, giá, tồn tối thiểu. Nền tảng cho inventory và báo cáo.

## 2. Mục tiêu

- CRUD sản phẩm master data  
- Mã SP unique, UPPERCASE  
- Giá bán / giá vốn Decimal  
- Soft delete = INACTIVE  
- Phân quyền `product:*`  

## 3. Nghiệp vụ

| Tác vụ | Actor |
|--------|-------|
| List / Search / Filter | Admin, Manager |
| Create / Update sản phẩm | Admin, Manager |
| Vô hiệu hóa sản phẩm | Admin, Manager |

## 4. User Story

| ID | Story | P |
|----|-------|---|
| PRD-01 | Danh sách + search + filter category/status | Must |
| PRD-02 | Tạo sản phẩm với giá và ĐVT | Must |
| PRD-03 | Sửa thông tin / giá | Must |
| PRD-04 | minStock cho cảnh báo (Sprint 2) | Must |
| PRD-05 | Mã không trùng | Must |

## 5. Use Case

UC-List · UC-Create · UC-Update · UC-ChangeStatus · UC-SoftDelete  

## 6–7. Flow

`/products` → filter → Dialog form → Lưu. Xóa = soft INACTIVE.

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-P01 | code unique, UPPERCASE |
| BR-P02 | unit default `pcs` |
| BR-P03 | price, costPrice ≥ 0 |
| BR-P04 | minStock ≥ 0 integer |
| BR-P05 | mapProduct convert Decimal → Number |

## 9. Validation

- code 1–50, name 2–255  
- description max 2000, category max 100, unit max 20  
- price/costPrice min 0, minStock int min 0  
- imageUrl URL optional (BE); FE MVP chưa upload  
- List: + filter `category`, sortBy code|name|price|createdAt  

## 10. Exception

400 · 401 · 403 · 404 · 409 · 500  

## 11. Permission Matrix

| Endpoint | Permission |
|----------|------------|
| GET | product:read |
| POST | product:create |
| PUT / PATCH | product:update |
| DELETE | product:delete |

## 12–15. Design

Xem các file database, api, frontend, backend trong thư mục.

## 16. Acceptance Criteria

- CRUD OK, giá hiển thị locale vi-VN  
- Filter category/status  
- Soft delete  

## 17. Testing Strategy

Unit: mapProduct, assertCodeUnique  
FE: productSchema  
Integration: full CRUD  

## 18–23. Docs

Đã tách file con.
