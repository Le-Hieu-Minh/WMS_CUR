# Module Authentication

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 1 – Module 1 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/auth` |
| FE route | `/login`, `/change-password` |

## Tài liệu con

| File | Nội dung |
|------|----------|
| [analysis.md](./analysis.md) | Nghiệp vụ, User Story, Rules, AC |
| [api.md](./api.md) | API Design |
| [database.md](./database.md) | Schema liên quan Auth |
| [frontend.md](./frontend.md) | UI / feature structure |
| [backend.md](./backend.md) | Layer BE |
| [user-guide.md](./user-guide.md) | Hướng dẫn người dùng |
| [developer-guide.md](./developer-guide.md) | Hướng dẫn dev |

## Tóm tắt nhanh

- Đăng nhập email + password (JWT)
- Access 15 phút, Refresh 7 ngày (hash trong DB)
- Lock 5 lần sai / 15 phút
- Không đăng ký công khai
- API: login, refresh, logout, me, change-password

## Tài khoản seed

`admin@wms.com` / `Admin@123`
