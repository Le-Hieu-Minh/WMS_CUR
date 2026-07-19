# Auth – Phân tích nghiệp vụ

## 1. Giới thiệu

Nền tảng xác thực WMS: đăng nhập, duy trì phiên, đăng xuất, xem profile, đổi mật khẩu.

## 2. Mục tiêu

- Xác thực an toàn bằng JWT Access + Refresh Token  
- Chống brute-force (lockout)  
- Middleware `authenticate` / `authorize` tái sử dụng toàn hệ thống  

## 3. Nghiệp vụ

| Tác vụ | Actor |
|--------|-------|
| Login | User |
| Auto refresh | Hệ thống |
| Logout | User |
| Me | User đã login |
| Change password | User đã login |

**Status:** `ACTIVE` | `INACTIVE` | `LOCKED`

## 4. User Story (rút gọn)

- AUTH-01: Đăng nhập bằng email/password  
- AUTH-02: Duy trì phiên tự động  
- AUTH-03: Đăng xuất  
- AUTH-04: Xem thông tin tài khoản  
- AUTH-05: Đổi mật khẩu  
- AUTH-06: Khóa sau 5 lần sai  
- AUTH-07: INACTIVE không đăng nhập được  

## 5–7. Flow

```
Truy cập → có token? → /auth/me
  ├─ OK → App
  └─ 401 → refresh → OK? → App : /login
Không token → /login → POST /auth/login → lưu tokens → App
```

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-01 | Không đăng ký công khai |
| BR-02 | Email unique |
| BR-03 | Access 15m / Refresh 7d |
| BR-04 | Refresh lưu hash SHA-256 trong DB |
| BR-05 | Logout revoke token hiện tại |
| BR-06 | Đổi MK revoke tất cả tokens |
| BR-07 | 5 lần sai → LOCKED 15 phút |
| BR-08 | INACTIVE → từ chối login |
| BR-09 | bcrypt cost 12 |
| BR-10 | Không trả passwordHash |

## 9. Validation

- Login: email hợp lệ + password required  
- Change password: ≥8, có hoa + thường + số, confirm khớp  

## 10. Exception

| Case | Status |
|------|--------|
| Sai email/password | 401 (message chung) |
| INACTIVE | 403 |
| LOCKED | 423 |
| Token invalid/expired | 401 |
| Rate limit login | 429 |

## 11. Permission

Login/Refresh: Public. Logout/Me/Change-password: Authenticated (không cần permission code).

## 16. Acceptance Criteria

- Login OK → tokens + vào app  
- Sai MK → 401, không lộ email tồn tại  
- Auto refresh hoạt động  
- Logout clear session  
- Đổi MK → bắt login lại  
- Swagger đủ 5 endpoints  

## 17. Testing

Unit: validation, service helpers. Integration: health + auth scenarios. FE: authSchema.
