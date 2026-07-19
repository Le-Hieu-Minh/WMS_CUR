# Getting Started

## Yêu cầu

- Node.js >= 20  
- PostgreSQL >= 14  
- npm >= 10  

## Cài đặt

```bash
# Từ thư mục gốc WMS_Cur
npm run install:all
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
# hoặc từ backend:
cd backend
npx prisma db push
npm run db:seed
```

Seed tạo:

- Roles: Admin, Manager, Staff  
- Permissions Sprint 1  
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
| `npm run dev` | FE + BE |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed dữ liệu |
| `cd backend && npm test` | Test backend |
| `cd frontend && npm test` | Test frontend |

## Cấu trúc repo

```
WMS_Cur/
├── docs/           # Tài liệu tổng hợp
├── frontend/       # React SPA
├── backend/        # Express API
├── package.json
└── README.md
```
