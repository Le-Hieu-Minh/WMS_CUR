# Kế hoạch Sprint

## Nguyên tắc

- Ưu tiên hoàn thành MVP theo từng Sprint nhỏ
- Mỗi lần chỉ tập trung đúng phạm vi Sprint/Module đang làm
- Không tự ý thiết kế hoặc code Sprint tiếp theo
- Hoàn thành một Module (phân tích → thiết kế → code → test → tài liệu) trước khi chuyển module khác

## Sprint 1 – Master Data & Auth ✅ Hoàn thành

| # | Module | Phân tích | Code | Test | Docs |
|---|--------|-----------|------|------|------|
| 1 | [Authentication](./modules/auth/README.md) | ✅ | ✅ | ✅ | ✅ |
| 2 | [User](./modules/user/README.md) | ✅ | ✅ | ✅ | ✅ |
| 3 | [Role & Permission](./modules/role/README.md) | ✅ | ✅ | ✅ | ✅ |
| 4 | [Warehouse](./modules/warehouse/README.md) | ✅ | ✅ | ✅ | ✅ |
| 5 | [Product](./modules/product/README.md) | ✅ | ✅ | ✅ | ✅ |
| 6 | [Supplier](./modules/supplier/README.md) | ✅ | ✅ | ✅ | ✅ |
| 7 | [Customer](./modules/customer/README.md) | ✅ | ✅ | ✅ | ✅ |

## Sprint 2 – Inventory Operations

| # | Module | Phân tích | Code | Test | Docs |
|---|--------|-----------|------|------|------|
| 1 | [Goods Receipt](./modules/goods-receipt/README.md) | ✅ | ✅ | ✅ | ✅ |
| 2 | [Goods Issue](./modules/goods-issue/README.md) | ✅ | ✅ | ✅ | ✅ |
| 3 | [Inventory](./modules/inventory/README.md) | ✅ | ✅ | ✅ | ✅ |
| 4 | [Dashboard](./modules/dashboard/README.md) | ✅ | ✅ | ✅ | ✅ |

> Sprint 2 hoàn thành.

## Sprint 3 – Control & Reporting ✅ Code xong (chưa Deploy)

Tổng quan: [docs/sprint-3/README.md](./sprint-3/README.md)

| # | Module | Phân tích | Code | Test | Docs |
|---|--------|-----------|------|------|------|
| 1 | [Stock Take](./modules/stock-take/README.md) | ✅ | ✅ | ✅ | ✅ |
| 2 | [Stock Adjustment](./modules/stock-adjustment/README.md) | ✅ | ✅ | ✅ | ✅ |
| 3 | [Audit Log](./modules/audit-log/README.md) | ✅ | ✅ | ✅ | ✅ |
| 4 | [Report](./modules/report/README.md) | ✅ | ✅ | ✅ | ✅ |
| 5 | [Docs / Test / Deploy](./sprint-3/deploy.md) | ✅ | ⏳ | ⏳ | ✅ |

### Thứ tự code khuyến nghị

Stock Take → Stock Adjustment → Audit Log → Report → ~~Deploy~~ (để sau)

### Báo cáo (Sprint 3) – phạm vi

- Tồn kho, nhập, xuất, kiểm kê, điều chỉnh, giá trị tồn
- Xuất Excel / PDF
