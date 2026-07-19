# Kiến trúc hệ thống

## Tổng quan

```
┌─────────────┐     REST / JSON      ┌─────────────┐      Prisma      ┌────────────┐
│  Frontend   │ ───────────────────► │   Backend   │ ───────────────► │ PostgreSQL │
│ React + Vite│ ◄─────────────────── │ Express API │ ◄─────────────── │            │
└─────────────┘     JWT Bearer       └─────────────┘                  └────────────┘
                                            │
                                            │ Cloudflare R2
                                            ▼
                                     ┌────────────┐
                                     │ File Store │
                                     │ (ảnh/PDF)  │
                                     └────────────┘
```

## Frontend – Feature-Based Architecture

```
frontend/src/
├── features/{feature}/     # pages, components, hooks, api, schemas
├── components/ui/          # Shadcn UI
├── components/layout/      # AppLayout, Sidebar, Header
├── routes/                 # Router + guards
├── lib/                    # axios, queryClient, utils
└── config/                 # env
```

## Backend – Layered Architecture

```
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

| Layer | Trách nhiệm |
|-------|-------------|
| Route | Endpoint, middleware, Swagger |
| Controller | Request/Response only |
| Service | Business logic |
| Repository | Database access |
| Prisma | ORM |

**Quy tắc:** Business logic chỉ viết trong Service. Controller không chứa nghiệp vụ. Repository không chứa business rules.

## Authentication Flow

1. Login → Access Token (15m) + Refresh Token (7d)
2. Request API kèm `Authorization: Bearer <accessToken>`
3. Access hết hạn → Frontend gọi `/auth/refresh` → retry
4. Logout / đổi mật khẩu / deactivate → revoke refresh token trong DB

## File Storage

- Cloudflare R2 lưu file (ảnh sản phẩm, hóa đơn, PDF, Excel)
- Database chỉ lưu URL + metadata
