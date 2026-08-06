# WMS – Warehouse Management System

Hệ thống quản lý kho (WMS) cho doanh nghiệp vừa và nhỏ.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, TanStack Query, Shadcn UI, Tailwind CSS |
| Backend | Node.js, Express, Prisma, PostgreSQL |
| Auth | JWT + Refresh Token |
| Storage | Cloudflare R2 |
| Docs | Swagger/OpenAPI |

## Documentation

Tài liệu tổng hợp nằm trong thư mục [`docs/`](./docs/README.md):

- Tổng quan, kiến trúc, Sprint, quy ước, tech stack, getting started  
- **Sprint 1 (✅ hoàn thành):** [Auth](./docs/modules/auth/README.md) · [User](./docs/modules/user/README.md) · [Role](./docs/modules/role/README.md) · [Warehouse](./docs/modules/warehouse/README.md) · [Product](./docs/modules/product/README.md) · [Supplier](./docs/modules/supplier/README.md) · [Customer](./docs/modules/customer/README.md)  

## Project Structure

```
WMS_Cur/
├── docs/              # Tài liệu tổng hợp
├── frontend/          # React SPA (workspace: wms-frontend)
├── backend/           # Express API (workspace: wms-backend)
├── package.json       # Root monorepo (npm workspaces)
├── package-lock.json  # Lockfile chung
└── README.md
```

Repo dùng **npm workspaces**: một lần `npm install` ở root là đủ cho cả backend và frontend.

## Prerequisites

- Node.js >= 20
- PostgreSQL >= 14
- npm >= 10

## Quick Start

### 1. Install dependencies

```bash
# Từ thư mục gốc repo
npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Chỉnh sửa `backend/.env` với Neon `DATABASE_URL` (hoặc Postgres local), JWT secret (≥ 32 ký tự), và tùy chọn Cloudflare R2 (`R2_*`) cho upload file.

### 3. Setup database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Seed admin: `admin@wms.com` / `Admin@123`

### 4. Run development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs

## Development Sprints

| Sprint | Modules |
|--------|---------|
| Sprint 1 | Auth, User, Role & Permission, Warehouse, Product, Supplier, Customer |
| Sprint 2 | Goods Receipt, Goods Issue, Inventory, Dashboard |
| Sprint 3 | Stock Take, Stock Adjustment, Report, Audit Log (Deploy để sau) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Cài deps cho root + backend + frontend |
| `npm run dev` | Chạy frontend + backend |
| `npm run dev:frontend` | Chỉ frontend |
| `npm run dev:backend` | Chỉ backend |
| `npm run build` | Build frontend |
| `npm run start` | Start backend (production) |
| `npm test` | Chạy test BE + FE |
| `npm run test:backend` | Test backend |
| `npm run test:frontend` | Test frontend |
| `npm run db:generate` | Prisma generate |
| `npm run db:push` | Prisma db push |
| `npm run db:migrate` | Prisma migrate |
| `npm run db:seed` | Seed dữ liệu |
| `npm run db:studio` | Prisma Studio |
