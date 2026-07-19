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
├── frontend/          # React SPA (Feature-Based Architecture)
├── backend/           # Express API (Route → Controller → Service → Repository)
├── package.json       # Root scripts
└── README.md
```

## Prerequisites

- Node.js >= 20
- PostgreSQL >= 14
- npm >= 10

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Chỉnh sửa `backend/.env` với thông tin PostgreSQL và JWT secret.

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
| Sprint 3 | Stock Take, Stock Adjustment, Report, Audit Log, Deploy |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:frontend` | Run frontend only |
| `npm run dev:backend` | Run backend only |
| `npm run build` | Build frontend for production |
| `npm run start` | Start backend production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
