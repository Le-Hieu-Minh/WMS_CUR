# Tech Stack

## Overview

Danh sách công nghệ **bắt buộc** cho WMS. Không thay stack trừ khi có quyết định kiến trúc mới được ghi nhận.

## Purpose

Thống nhất công nghệ giữa FE/BE/DB/Auth/Test để tránh lệch chuẩn và giảm chi phí onboarding.

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| Công nghệ runtime, UI, ORM, auth, test | Hướng dẫn cài đặt từng tool (xem Getting Started) |
| Vai trò từng thư viện | So sánh vendor ngoài phạm vi quyết định đã chốt |

## Workflow

```text
Chọn công nghệ từ bảng dưới
↓
Cài qua npm workspaces
↓
Cấu hình .env
↓
Chạy dev / test theo scripts gốc repo
```

## Business Rules

| ID | Rule |
|----|------|
| BR-T01 | Frontend và Backend dùng **JavaScript (ES6+)**, không TypeScript |
| BR-T02 | UI dùng Shadcn + Tailwind; không tự ý đổi design system |
| BR-T03 | ORM bắt buộc Prisma + PostgreSQL |
| BR-T04 | Validation BE/FE dùng Zod |
| BR-T05 | API docs dùng Swagger/OpenAPI gắn với Express |

## Technical Design

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| React + Vite | SPA |
| JavaScript (ES6+) | Ngôn ngữ |
| React Router | Routing |
| Axios | HTTP client |
| TanStack Query | Server state |
| React Hook Form + Zod | Form + validation |
| Shadcn UI + Tailwind CSS | UI |
| TanStack Table | Bảng dữ liệu |
| Recharts | Biểu đồ |
| Lucide React | Icons |
| Vitest + RTL | Test |

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js + Express | REST API |
| Prisma ORM | Database access |
| PostgreSQL | Database |
| JWT + Refresh Token | Authentication |
| Multer + Cloudflare R2 | Upload file |
| Pino | Logger |
| Swagger/OpenAPI | API docs |
| Zod | Validation |
| Jest + Supertest | Test |

### Database

PostgreSQL — chuẩn hóa, index hợp lý, toàn vẹn dữ liệu, dễ mở rộng.

## API / Database

| Mục | Giá trị |
|-----|---------|
| Node | >= 20 |
| PostgreSQL | >= 14 |
| npm | >= 10 |
| API style | REST/JSON |

## Validation

Phiên bản Node/npm/Postgres dưới mức yêu cầu → không hỗ trợ chính thức.

## Security

| Thành phần | Ghi chú |
|------------|---------|
| JWT | Access + Refresh secrets riêng trong `.env` |
| R2 | Access key không commit |
| bcrypt | Hash mật khẩu (Auth/User) |

## Error Handling

Thiếu dependency hoặc sai runtime version → fail sớm khi `npm install` / `db:generate` / start server. Xử lý theo [05-getting-started.md](./05-getting-started.md).

## Examples

### Package scripts (root)

| Command | Stack liên quan |
|---------|-----------------|
| `npm run dev` | Vite + Express |
| `npm test` | Vitest + Jest/Supertest |
| `npm run db:generate` | Prisma |

## Design Decisions

```text
Decision: JavaScript only (không TypeScript).
Reason: Khớp ràng buộc dự án và tốc độ MVP 2–3 tuần.
Advantages: Đơn giản, ít tooling.
Trade-offs: Ít type-safety compile-time — bù bằng Zod validation + test.
```

```text
Decision: Prisma thay vì query builder thuần.
Reason: Schema-first, migrate rõ, DX tốt với PostgreSQL.
Advantages: Type-safe client (JS), quan hệ rõ.
Trade-offs: Query rất phức tạp có thể cần raw SQL.
```

## Notes

- Kiến trúc dùng stack này: [01-architecture.md](./01-architecture.md).
- Cài đặt: [05-getting-started.md](./05-getting-started.md).

## Checklist

- [x] Bảng FE/BE/DB đầy đủ
- [x] Business Rules ràng buộc stack
- [x] Security notes
- [x] Design Decisions
- [x] Checklist
