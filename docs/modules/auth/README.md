# Module Authentication — Hub

## Overview

Module xác thực và quản lý phiên đăng nhập cho WMS. Cung cấp JWT Access/Refresh Token, middleware `authenticate`/`authorize` dùng chung toàn hệ thống.

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 1 – Module 1 |
| Trạng thái | ✅ Đã triển khai |
| Base path BE | `/api/v1/auth` |
| FE routes | `/login`, `/change-password` |

## Purpose

Trả lời năm câu hỏi cốt lõi:

| Câu hỏi | Trả lời |
|---------|---------|
| **Module này làm gì?** | Đăng nhập, duy trì phiên, đăng xuất, xem profile, đổi mật khẩu |
| **Ai dùng?** | Mọi người dùng nội bộ WMS |
| **Input chính?** | Email + password; refresh token; mật khẩu mới |
| **Output chính?** | JWT tokens + thông tin user kèm role/permissions |
| **Ràng buộc?** | Không đăng ký công khai; lock 5 lần sai; INACTIVE không login |

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| Login, refresh, logout, me, change-password | CRUD user → [User](../user/README.md) |
| JWT + refresh token lifecycle | CRUD role/permission → [Role](../role/README.md) |
| Account lockout, rate limit login | Đăng ký tự phục vụ, OAuth/SSO |
| Middleware xác thực/phân quyền | Reset password bởi Admin → User module |

## Workflow

```mermaid
flowchart TD
    A[Truy cập app] --> B{Có accessToken?}
    B -->|Có| C[GET /auth/me]
    B -->|Không| D[/login]
    C -->|200| E[App]
    C -->|401| F[POST /auth/refresh]
    F -->|200| E
    F -->|401| D
    D --> G[POST /auth/login]
    G --> H[Lưu tokens → App]
```

## Business Rules

| ID | Rule |
|----|------|
| BR-01 | Không đăng ký công khai — tài khoản do Admin tạo |
| BR-02 | Access token 15 phút; refresh token 7 ngày |
| BR-03 | 5 lần đăng nhập sai → LOCKED 15 phút |
| BR-04 | INACTIVE không đăng nhập; logout/change-password revoke tokens |
| BR-05 | Không trả `passwordHash` trong response |

## Technical Design

Kiến trúc layered: Route → Controller → Service → Repository. Chi tiết: [backend.md](./backend.md), [frontend.md](./frontend.md).

## API / Database

- API: [api.md](./api.md)
- Schema: [database.md](./database.md) — bảng `users`, `refresh_tokens`, `roles`, `permissions`, `role_permissions`

## Validation

Email hợp lệ; password policy (≥8 ký tự, hoa + thường + số) cho đổi mật khẩu. Chi tiết: [analysis.md](./analysis.md#validation).

## Security

Bearer JWT; refresh token hash SHA-256 trong DB; bcrypt cost 12; rate limit login 10/15 phút/IP; message lỗi login chung (không lộ email tồn tại).

## Error Handling

401 (sai credential/token), 403 (INACTIVE), 423 (LOCKED), 429 (rate limit). Chi tiết: [api.md](./api.md).

## Examples

Tài khoản seed dev: `admin@wms.com` / `Admin@123`. Ví dụ request/response: [api.md](./api.md#examples).

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| JWT Access + Refresh | Stateless scale + revoke refresh | Hiệu năng, tái sử dụng middleware | Cần quản lý refresh trong DB |
| Hash refresh token | Bảo vệ khi DB lộ | An toàn hơn lưu plain | Không tra cứu token gốc |
| Lock fields trên User | MVP đơn giản | Không cần bảng riêng | Khó audit chi tiết từng lần sai |

## Notes

- Swagger: `http://localhost:3000/api-docs` — tag **Auth**
- Permissions nằm trong access token payload — đổi role cần refresh/login lại

## Checklist

- [x] 5 endpoints triển khai
- [x] Rate limit + lockout
- [x] FE AuthProvider + interceptor
- [x] Unit tests validation + service
- [x] Audit log LOGIN/LOGOUT/CHANGE_PASSWORD

## Tài liệu con

| File | Nội dung |
|------|----------|
| [analysis.md](./analysis.md) | Nghiệp vụ, user story, flow, BR |
| [api.md](./api.md) | API đầy đủ |
| [database.md](./database.md) | Schema liên quan Auth |
| [frontend.md](./frontend.md) | UI / feature structure |
| [backend.md](./backend.md) | Layer BE |
| [user-guide.md](./user-guide.md) | Hướng dẫn người dùng |
| [developer-guide.md](./developer-guide.md) | Hướng dẫn mở rộng |

## Permissions

Login và Refresh: **Public**. Logout, Me, Change-password: **Authenticated** (không cần permission code cụ thể).
