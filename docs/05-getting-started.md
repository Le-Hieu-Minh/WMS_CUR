# Getting Started

## Overview

Hướng dẫn cài đặt và chạy WMS local (npm workspaces: backend + frontend).

## Purpose

Giúp developer mới clone repo → cấu hình → seed → chạy FE/BE trong thời gian ngắn.

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| Local/dev setup, Neon/Postgres, R2 optional, scripts | Deploy production (xem `sprint-3/deploy.md`) |
| Seed Admin mặc định | Hướng dẫn nghiệp vụ module |

## Workflow

```text
1. Cài Node >= 20, PostgreSQL >= 14, npm >= 10
2. npm install (root)
3. Copy .env.example → .env (backend + frontend)
4. Cấu hình DATABASE_URL + JWT secrets (+ R2 nếu cần upload)
5. npm run db:generate → db:migrate → db:seed
6. npm run dev
7. Đăng nhập admin@wms.com / Admin@123
```

```mermaid
flowchart TD
  A[Clone repo] --> B[npm install]
  B --> C[Cấu hình .env]
  C --> D[Prisma generate/migrate/seed]
  D --> E[npm run dev]
  E --> F[FE :5173 / BE :3000]
```

## Business Rules

| ID | Rule |
|----|------|
| BR-G01 | Không commit file `.env` |
| BR-G02 | JWT secrets ≥ 32 ký tự; Access và Refresh **khác nhau** |
| BR-G03 | Neon: dùng host pooled (`-pooler`) + `sslmode=require` cho runtime |
| BR-G04 | Thiếu cấu hình R2 → module khác vẫn chạy; chỉ API upload báo lỗi cấu hình |

## Technical Design

Repo monorepo:

```text
WMS_Cur/
├── docs/
├── frontend/          # workspace: wms-frontend
├── backend/           # workspace: wms-backend
├── package.json       # root workspaces + scripts
├── package-lock.json
└── README.md
```

## API / Database

### Cài đặt

```bash
npm install
```

### Cấu hình môi trường

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env` tối thiểu:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require&schema=public"
JWT_ACCESS_SECRET=<chuỗi >= 32 ký tự>
JWT_REFRESH_SECRET=<chuỗi >= 32 ký tự khác>
```

### Cloudflare R2 (tùy chọn)

```env
R2_ACCOUNT_ID=<Cloudflare Account ID>
R2_ACCESS_KEY_ID=<R2 API Token Access Key>
R2_SECRET_ACCESS_KEY=<R2 API Token Secret>
R2_BUCKET_NAME=wms-files
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

| Biến | Cách lấy |
|------|----------|
| `R2_ACCOUNT_ID` | Cloudflare Dashboard → R2 Overview |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 → Manage R2 API Tokens |
| `R2_BUCKET_NAME` | Tên bucket |
| `R2_PUBLIC_URL` | R2.dev subdomain hoặc custom domain (không `/` cuối) |

### Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

DB đã tạo bằng `db:push` trước đó: đánh dấu migration baseline đã áp dụng (không chạy lại SQL):

```bash
cd backend
npx prisma migrate resolve --applied 20260808000000_init
```

Production / CI: `npm run db:migrate:deploy` (không dùng `db:push`).

Seed tạo:

- Roles: Admin, Manager, Staff
- Permissions (Sprint 1–3)
- User: `admin@wms.com` / `Admin@123`

## Validation

| Kiểm tra | Kỳ vọng |
|----------|---------|
| `node -v` | >= 20 |
| `npm -v` | >= 10 |
| `DATABASE_URL` | Kết nối được |
| JWT secrets | Đủ dài, khác nhau |

## Security

- Đổi mật khẩu Admin ngay trên môi trường dùng chung
- Không dùng seed password trên production
- Không commit secrets R2/JWT

## Error Handling

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|-------------|------------------------|------------|
| Prisma P1001 | Sai `DATABASE_URL` / DB down | Kiểm tra connection string |
| 401 liên tục sau login | Sai JWT secret giữa các lần chạy | Đồng bộ `.env`, seed lại token nếu cần |
| Upload fail | Thiếu R2 env | Điền R2 hoặc bỏ qua upload |
| Port in use | 3000/5173 đang chiếm | Đổi port hoặc tắt process cũ |

## Examples

### Chạy development

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000/api/v1 |
| Swagger | http://localhost:3000/api-docs |

### Scripts hữu ích

| Command | Mô tả |
|---------|--------|
| `npm install` | Cài deps monorepo |
| `npm run dev` | FE + BE |
| `npm run dev:backend` | Chỉ BE |
| `npm run dev:frontend` | Chỉ FE |
| `npm test` | Test BE + FE |
| `npm run test:backend` | Test backend |
| `npm run test:frontend` | Test frontend |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed dữ liệu |

## Design Decisions

```text
Decision: npm workspaces monorepo.
Reason: Một lockfile, script gốc thống nhất, onboard đơn giản.
Advantages: `npm install` / `npm run dev` một lần.
Trade-offs: Coupling phiên bản Node chung cho cả hai workspace.
```

## Notes

- ERD: [wms-database.md](./wms-database.md).
- Tổng quan sản phẩm: [00-overview.md](./00-overview.md).

## Checklist

- [x] Workflow cài đặt đầy đủ
- [x] Config DB / JWT / R2
- [x] Security notes
- [x] Error Handling thường gặp
- [x] Ví dụ scripts + URL
- [x] Design Decisions
- [x] Checklist
