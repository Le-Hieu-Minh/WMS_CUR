# User – Phân tích nghiệp vụ (tổng hợp 23 mục)

## 1. Giới thiệu

Quản lý vòng đời tài khoản nội bộ: tạo, xem, cập nhật, vô hiệu hóa, mở khóa, reset mật khẩu, gán role.

## 2. Mục tiêu

- Admin quản lý user và gán đúng role  
- Soft deactivate, unlock LOCKED, reset password  
- Phân quyền `user:*`  
- Không CRUD Role (thuộc Module Role & Permission)  

## 3. Nghiệp vụ

| Tác vụ | Actor |
|--------|-------|
| List / Search / Filter | Admin |
| Create / Update | Admin |
| Change status / Unlock | Admin |
| Reset password | Admin |
| Soft delete | Admin |

## 4. User Story

| ID | Story | P |
|----|-------|---|
| USR-01 | Xem danh sách (search/filter/page) | Must |
| USR-02 | Tạo tài khoản | Must |
| USR-03 | Xem chi tiết | Must |
| USR-04 | Cập nhật fullName/role/avatar | Must |
| USR-05 | Vô hiệu hóa / kích hoạt | Must |
| USR-06 | Mở khóa LOCKED | Must |
| USR-07 | Reset mật khẩu | Must |
| USR-08 | Không tự deactivate/delete mình | Must |
| USR-09 | Không đụng Admin cuối cùng | Must |
| USR-10 | Manager/Staff không truy cập | Must |

## 5. Use Case

- UC-List, UC-Create, UC-Update, UC-Status/Unlock, UC-ResetPassword, UC-SoftDelete  

## 6–7. Flow

Admin → `/users` (cần `user:read`) → Table + filters → Create Dialog / Detail → Update | Status | Unlock | Reset | Soft delete  

Create: validate → check email → hash password → insert → 201  

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-U01 | Chỉ có `user:*` mới thao tác |
| BR-U02 | Email unique, lowercase |
| BR-U03 | Password policy giống Auth |
| BR-U04 | Không trả passwordHash |
| BR-U05 | Cấm self deactivate/delete |
| BR-U06 | Bảo vệ last Admin ACTIVE |
| BR-U07 | Soft delete = INACTIVE + revoke tokens |
| BR-U08 | Unlock reset attempts + lockedUntil |
| BR-U09 | Reset password → revoke all tokens |
| BR-U10 | Chỉ gán roleId có sẵn |
| BR-U11 | Không sửa email (MVP) |

## 9. Validation

- Create: email, fullName (2–255), password policy, roleId UUID  
- Update: fullName, roleId, avatarUrl optional  
- Status: ACTIVE \| INACTIVE  
- Reset: newPassword + confirm  
- List query: page, limit, search, status, roleId, sortBy, sortOrder  

## 10. Exception

400 validation / self · 401 · 403 · 404 · 409 email/last-admin · 500  

## 11. Permission Matrix

| Endpoint | Permission |
|----------|------------|
| GET list/detail | user:read |
| POST create | user:create |
| PUT / PATCH status / unlock / reset | user:update |
| DELETE soft | user:delete |

## 12–15. Design

Xem [database.md](./database.md), [api.md](./api.md), [frontend.md](./frontend.md), [backend.md](./backend.md).

## 16. Acceptance Criteria

- CRUD + filter OK  
- Create → login được  
- Email trùng 409  
- Deactivate → không login  
- Unlock / reset password đúng side-effect  
- Self / last-admin được bảo vệ  
- Manager/Staff → 403  
- Không leak passwordHash  

## 17. Testing Strategy

Unit: service rules + validation  
Integration: mỗi endpoint Success/400/401/403/404/409  
FE: schemas + hooks helpers  

## 18–23. Docs

Đã tách thành các file trong thư mục này (API, DB, FE, BE, User Guide, Developer Guide).
