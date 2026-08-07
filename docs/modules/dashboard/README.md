# Module Dashboard

## Overview

Module **Dashboard** cung cấp tổng quan KPI và biểu đồ hoạt động kho. Trang chủ sau đăng nhập (`/`). Dữ liệu **read-only**, aggregate từ products, warehouses, inventories, goods receipts/issues.

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 2 – Module 4 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/dashboard` |
| FE route | `/` |

## Purpose

- KPI: sản phẩm, kho, tồn, giá trị tồn, phiếu nhập/xuất hôm nay.
- Cảnh báo hàng sắp hết (top 10).
- Top sản phẩm nhập/xuất (top 5).
- Biểu đồ số phiếu nhập/xuất 12 tháng.

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| GET overview | Drill-down chi tiết |
| KPI + charts | Real-time websocket |
| Permission gate | Custom dashboard per user |

## Workflow

```text
User login → DashboardPage
  → if dashboard:read → GET /dashboard/overview
  → Render KPI cards + Recharts bar + tables
  → else welcome message (no permission)
```

## Business Rules

| ID | Quy tắc |
|----|---------|
| BR-DB01 | Chỉ đếm SP/Kho `ACTIVE` trong summary |
| BR-DB02 | receiptsToday/issuesToday = CONFIRMED + date = hôm nay |
| BR-DB03 | lowStock: quantity <= minStock, sort asc qty, limit 10 |
| BR-DB04 | topReceived/topIssued: SUM qty từ items CONFIRMED only |
| BR-DB05 | monthlyChart: **đếm số phiếu**/tháng (không phải tổng qty) |

## Technical Design

| Layer | Path |
|-------|------|
| BE | `dashboard.service.js`, `dashboard.route.js` |
| FE | `DashboardPage.jsx`, `dashboardApi.js` |
| Chart | Recharts BarChart |

## API / Database (nếu có)

- [api.md](./api.md) · [database.md](./database.md)

## Validation

Không query params (single overview endpoint).

## Security

`dashboard:read` required. FE ẩn data nếu thiếu quyền.

## Error Handling

FE banner lỗi khi overview query fail.

## Examples

7 phiếu nhập CONFIRMED hôm nay → `summary.receiptsToday = 7`.

## Design Decisions

| Quyết định | Lý do |
|------------|-------|
| Single overview endpoint | Giảm round-trip |
| Raw SQL for top products | SUM aggregate hiệu quả |
| Count docs in chart | MVP đơn giản; có thể đổi sang qty sau |

## Notes

Tests: `dashboard.service.test.js`.

## Checklist

- [x] Overview API
- [x] KPI cards
- [x] Chart 12 tháng
- [x] Permission UI fallback
- [ ] Configurable date range (future)

## Tài liệu con

[analysis](./analysis.md) · [api.md](./api.md) · [database.md](./database.md) · [frontend](./frontend.md) · [backend](./backend.md) · [user-guide](./user-guide.md) · [developer-guide](./developer-guide.md)
