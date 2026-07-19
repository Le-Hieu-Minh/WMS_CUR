# Warehouse – Phân tích nghiệp vụ (tổng hợp 23 mục)

## 1. Giới thiệu

Quản lý danh mục kho hàng — thông tin địa điểm, liên hệ, trạng thái. Nền tảng cho nghiệp vụ tồn kho Sprint 2.

## 2. Mục tiêu

- CRUD master data kho  
- Mã kho unique, chuẩn hóa UPPERCASE  
- Soft delete = INACTIVE  
- Phân quyền `warehouse:*`  

## 3. Nghiệp vụ

| Tác vụ | Actor |
|--------|-------|
| List / Search / Filter status | Admin, Manager |
| Create / Update | Admin, Manager |
| Đổi trạng thái / Xóa (soft) | Admin, Manager |

## 4. User Story

| ID | Story | P |
|----|-------|---|
| WH-01 | Xem danh sách kho + search | Must |
| WH-02 | Tạo kho mới | Must |
| WH-03 | Sửa thông tin kho | Must |
| WH-04 | Vô hiệu hóa kho (soft delete) | Must |
| WH-05 | Mã kho không trùng | Must |

## 5. Use Case

UC-List · UC-Create · UC-Update · UC-ChangeStatus · UC-SoftDelete  

## 6–7. Flow

Admin → `/warehouses` → Search / filter ACTIVE|INACTIVE → Dialog tạo/sửa → Lưu  
Xóa: confirm → DELETE → set INACTIVE  

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-W01 | `code` unique, normalize UPPERCASE |
| BR-W02 | Tạo mới mặc định ACTIVE |
| BR-W03 | DELETE = soft (INACTIVE) |
| BR-W04 | Search: code, name, address |

## 9. Validation

- code: 1–50, required  
- name: 2–255  
- address max 500, phone max 20, email format, description max 1000  
- status: ACTIVE \| INACTIVE  
- List: page, limit, search, status, sortBy (code|name|createdAt)  

## 10. Exception

400 · 401 · 403 · 404 · 409 mã trùng · 500  

## 11. Permission Matrix

| Endpoint | Permission |
|----------|------------|
| GET list/detail | warehouse:read |
| POST create | warehouse:create |
| PUT update / PATCH status | warehouse:update |
| DELETE soft | warehouse:delete |

## 12–15. Design

Xem [database.md](./database.md), [api.md](./api.md), [frontend.md](./frontend.md), [backend.md](./backend.md).

## 16. Acceptance Criteria

- CRUD + filter OK  
- Mã trùng → 409  
- Soft delete → status INACTIVE  
- FE dùng MasterDataListPage  

## 17. Testing Strategy

Unit: normalizeCode, assertCodeUnique  
Integration: CRUD endpoints  
FE: warehouseSchema validation  

## 18–23. Docs

Đã tách thành các file trong thư mục này.
