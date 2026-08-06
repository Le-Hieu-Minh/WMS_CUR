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
# Local PostgreSQL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/wms_db?schema=public"

# Neon (khuyến nghị) – copy connection string từ Neon Console
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require&schema=public"

JWT_ACCESS_SECRET=<chuỗi >= 32 ký tự>
JWT_REFRESH_SECRET=<chuỗi >= 32 ký tự khác>
```

Với Neon: dùng **pooled** host (`-pooler`) cho app runtime; thêm `sslmode=require`. Không commit file `.env` (đã có trong `.gitignore`).

### Cloudflare R2 (upload file)

Dùng khi cần lưu file (avatar, đính kèm). Backend dùng AWS SDK → endpoint R2.

```env
R2_ACCOUNT_ID=<Cloudflare Account ID>
R2_ACCESS_KEY_ID=<R2 API Token Access Key>
R2_SECRET_ACCESS_KEY=<R2 API Token Secret>
R2_BUCKET_NAME=wms-files
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

| Biến | Cách lấy |
|------|----------|
| `R2_ACCOUNT_ID` | Cloudflare Dashboard → bên phải / R2 Overview |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 → Manage R2 API Tokens → Create |
| `R2_BUCKET_NAME` | Tên bucket đã tạo |
| `R2_PUBLIC_URL` | R2.dev subdomain hoặc custom domain (không có `/` cuối) |

Nếu để trống R2, API upload sẽ trả lỗi “File storage is not configured” — các module khác vẫn chạy bình thường.

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
