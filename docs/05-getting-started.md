# Getting Started

## Yêu cầu

- Node.js >= 20  
- PostgreSQL >= 14  
- npm >= 10  

## Cài đặt

Repo là **npm workspaces** (backend + frontend trong một repo).

```bash
# Từ thư mục gốc WMS_Cur — cài cả root, backend, frontend
npm install
```

## Cấu hình môi trường

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Chỉnh `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wms_db?schema=public"
JWT_ACCESS_SECRET=<chuỗi >= 32 ký tự>
JWT_REFRESH_SECRET=<chuỗi >= 32 ký tự khác>
```

## Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Seed tạo:

- Roles: Admin, Manager, Staff  
- Permissions (Sprint 1–3)  
- User: `admin@wms.com` / `Admin@123`  

## Chạy development

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000/api/v1 |
| Swagger | http://localhost:3000/api-docs |

## Scripts hữu ích

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

## Cấu trúc repo

```
WMS_Cur/
├── docs/              # Tài liệu
├── frontend/          # workspace: wms-frontend
├── backend/           # workspace: wms-backend
├── package.json       # root workspaces + scripts
├── package-lock.json  # lockfile chung
└── README.md
```
