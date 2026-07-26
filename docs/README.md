# Tài liệu WMS

Bộ tài liệu tổng hợp cho dự án **Warehouse Management System (WMS)**.

## Mục lục

| Tài liệu | Mô tả |
|----------|--------|
| [Tổng quan sản phẩm](./00-overview.md) | Mục tiêu, phạm vi, ưu tiên MVP |
| [Kiến trúc hệ thống](./01-architecture.md) | Frontend / Backend / Database / Auth |
| [Kế hoạch Sprint](./02-sprint-plan.md) | Sprint 1–3, trạng thái module |
| [Quy ước phát triển](./03-conventions.md) | Quy trình phân tích, DoD, coding rules |
| [Tech Stack](./04-tech-stack.md) | Công nghệ bắt buộc |
| [Getting Started](./05-getting-started.md) | Cài đặt, chạy local, seed |

## Module

| Module | Trạng thái | Tài liệu |
|--------|------------|----------|
| Authentication | ✅ Đã triển khai | [modules/auth](./modules/auth/README.md) |
| User | ✅ Đã triển khai | [modules/user](./modules/user/README.md) |
| Role & Permission | ✅ Đã triển khai | [modules/role](./modules/role/README.md) |
| Warehouse | ✅ Đã triển khai | [modules/warehouse](./modules/warehouse/README.md) |
| Product | ✅ Đã triển khai | [modules/product](./modules/product/README.md) |
| Supplier | ✅ Đã triển khai | [modules/supplier](./modules/supplier/README.md) |
| Customer | ✅ Đã triển khai | [modules/customer](./modules/customer/README.md) |
| Goods Receipt | ✅ Đã triển khai | [modules/goods-receipt](./modules/goods-receipt/README.md) |
| Goods Issue | ✅ Đã triển khai | [modules/goods-issue](./modules/goods-issue/README.md) |
| Inventory | ✅ Đã triển khai | [modules/inventory](./modules/inventory/README.md) |
| Dashboard | ✅ Đã triển khai | [modules/dashboard](./modules/dashboard/README.md) |
| Stock Take | ✅ Đã triển khai | [modules/stock-take](./modules/stock-take/README.md) |
| Stock Adjustment | ✅ Đã triển khai | [modules/stock-adjustment](./modules/stock-adjustment/README.md) |
| Audit Log | ✅ Đã triển khai | [modules/audit-log](./modules/audit-log/README.md) |
| Report | ✅ Đã triển khai | [modules/report](./modules/report/README.md) |
| Sprint 3 Overview | ✅ Code xong (chưa Deploy) | [sprint-3](./sprint-3/README.md) |

## Cấu trúc thư mục docs

```
docs/
├── README.md                 # Mục lục này
├── 00-overview.md
├── 01-architecture.md
├── 02-sprint-plan.md
├── 03-conventions.md
├── 04-tech-stack.md
├── 05-getting-started.md
└── modules/
    ├── auth/
    ├── user/
    ├── role/
    ├── warehouse/
    ├── product/
    ├── supplier/
    └── customer/
        ├── README.md
        ├── analysis.md
        ├── api.md
        ├── database.md
        ├── frontend.md
        ├── backend.md
        ├── user-guide.md
        └── developer-guide.md
```

## Liên kết nhanh

- Swagger API: `http://localhost:3000/api-docs`
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api/v1`
