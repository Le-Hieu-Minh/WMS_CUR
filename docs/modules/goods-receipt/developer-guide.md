# Goods Receipt – Developer Guide

```bash
cd backend
npx prisma db push
npm run db:seed   # cập nhật permissions mới
cd ..
npm run dev
```

Sau khi seed lại, Admin/Manager có đủ `goods-receipt:*`. Staff chỉ `goods-receipt:read`.

Module tiếp theo Sprint 2: **Goods Issue** → **Inventory** → **Dashboard**.
