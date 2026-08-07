# Tài liệu WMS

## Overview

Bộ tài liệu kỹ thuật cho **Warehouse Management System (WMS)** — từ tổng quan sản phẩm đến từng module.

## Purpose

Giúp lập trình viên mới:

| Câu hỏi | Tài liệu |
|---------|----------|
| Hệ thống làm gì? | [00-overview.md](./00-overview.md) |
| Kiến trúc thế nào? | [01-architecture.md](./01-architecture.md) |
| Làm module theo thứ tự nào? | [02-sprint-plan.md](./02-sprint-plan.md) |
| Viết code/docs theo chuẩn nào? | [03-conventions.md](./03-conventions.md) |
| Dùng stack gì? | [04-tech-stack.md](./04-tech-stack.md) |
| Chạy local ra sao? | [05-getting-started.md](./05-getting-started.md) |
| Schema DB tổng? | [wms-database.md](./wms-database.md) |

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| Docs sản phẩm + module MVP Sprint 1–3 | Tài liệu vendor bên thứ ba |
| Chuẩn viết docs trong conventions | Marketing / sales materials |

## Workflow

```text
Đọc Overview → Architecture → Getting Started
↓
Chọn Module trong Sprint Plan
↓
Đọc README module → analysis → api/database → FE/BE → guides
↓
Phát triển theo Conventions
```

## Business Rules

| ID | Rule |
|----|------|
| BR-D01 | Mọi file docs tuân thủ cấu trúc chuẩn (Overview → Checklist) — xem [03-conventions.md](./03-conventions.md) |
| BR-D02 | Không lặp nội dung giữa các file — tham chiếu chéo |
| BR-D03 | Không mô tả từng dòng code |
| BR-D04 | Module README là hub; chi tiết nằm ở file con |

## Technical Design

### Tài liệu gốc

| Tài liệu | Mô tả |
|----------|--------|
| [Tổng quan sản phẩm](./00-overview.md) | Mục tiêu, phạm vi, ưu tiên MVP |
| [Kiến trúc hệ thống](./01-architecture.md) | Frontend / Backend / Database / Auth |
| [Kế hoạch Sprint](./02-sprint-plan.md) | Sprint 1–3, trạng thái module |
| [Quy ước phát triển](./03-conventions.md) | 23 mục, chuẩn docs, coding rules |
| [Tech Stack](./04-tech-stack.md) | Công nghệ bắt buộc |
| [Getting Started](./05-getting-started.md) | Cài đặt, chạy local, seed |
| [WMS Database](./wms-database.md) | ERD, bảng, FK, enums |

### Module

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

### Cấu trúc thư mục

```text
docs/
├── README.md
├── 00-overview.md … 05-getting-started.md
├── wms-database.md
├── wms-database.drawdb.json
└── modules/{module}/
    ├── README.md
    ├── analysis.md
    ├── api.md
    ├── database.md
    ├── frontend.md
    ├── backend.md
    ├── user-guide.md
    └── developer-guide.md
```

> Một số module mỏng có thể chưa đủ 8 file — xem README từng module.

## API / Database

| Liên kết nhanh | URL / Path |
|----------------|------------|
| Swagger | `http://localhost:3000/api-docs` |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000/api/v1` |
| ERD | [wms-database.md](./wms-database.md) |

## Validation

Trước khi merge docs mới:

- Đủ section bắt buộc theo conventions
- Có bảng cho API/DB/permission khi có dữ liệu dạng danh sách
- Có Checklist cuối file

## Security

Docs có thể chứa tài khoản seed **dev only**. Không ghi secrets thật (JWT, R2 keys).

## Error Handling

Phát hiện docs lệch chuẩn → sửa theo [03-conventions.md](./03-conventions.md); thiếu thông tin → ghi giả định rõ ràng.

## Examples

Đường dẫn điển hình khi làm module Role:

1. [modules/role/README.md](./modules/role/README.md)  
2. `analysis.md` → business rules  
3. `api.md` + `database.md`  
4. `frontend.md` + `backend.md`  
5. `user-guide.md` / `developer-guide.md`  

## Design Decisions

```text
Decision: Hub README + file con theo loại tài liệu.
Reason: Khớp quy trình 23 mục, tránh một file quá dài.
Advantages: Đọc đúng nhu cầu; ít conflict Git.
Trade-offs: Cần kỷ luật tham chiếu, không copy.
```

## Notes

Chuẩn viết chi tiết nằm ở [03-conventions.md](./03-conventions.md) — không lặp lại tại đây.

## Checklist

- [x] Mục lục tài liệu gốc
- [x] Bảng module + trạng thái
- [x] Workflow đọc docs
- [x] Liên kết nhanh
- [x] Design Decisions
- [x] Checklist
