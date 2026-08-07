# Kế hoạch Sprint

## Overview

Lộ trình phát triển WMS theo 3 Sprint: Master Data & Auth → Inventory Operations → Control & Reporting.

## Purpose

Giúp team biết thứ tự ưu tiên, trạng thái từng module, và không nhảy cóc phạm vi.

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| Sprint 1–3 MVP | Tính năng ngoài [00-overview.md](./00-overview.md) |
| Trạng thái phân tích / code / test / docs | Chi tiết deploy production đầy đủ |

## Workflow

```text
Chọn Module trong Sprint hiện tại
↓
Phân tích 23 mục
↓
Design DB + API + FE + BE
↓
Code + Test
↓
Viết docs theo chuẩn
↓
Module Done → Module tiếp theo
```

## Business Rules

| ID | Rule |
|----|------|
| BR-S01 | Ưu tiên hoàn thành MVP theo từng Sprint nhỏ |
| BR-S02 | Mỗi lần chỉ tập trung đúng phạm vi Sprint/Module đang làm |
| BR-S03 | Không tự ý thiết kế hoặc code Sprint tiếp theo khi chưa xong hiện tại |
| BR-S04 | Hoàn thành một Module (phân tích → thiết kế → code → test → tài liệu) trước khi chuyển module khác |

## Technical Design

Không áp dụng thiết kế kỹ thuật riêng — đây là kế hoạch sản phẩm. Chi tiết kỹ thuật theo từng module trong `docs/modules/`.

## API / Database

Không có API riêng. Database tổng: [wms-database.md](./wms-database.md).

## Validation

Definition of Done theo [03-conventions.md](./03-conventions.md) — thiếu docs/test thì module chưa Done.

## Security

Không có yêu cầu bảo mật riêng cho kế hoạch Sprint. Mỗi module tự định nghĩa permission.

## Error Handling

Rủi ro kế hoạch:

| Rủi ro | Xử lý |
|--------|-------|
| Phạm vi phình | Từ chối hạng mục ngoài scope |
| Module dở dang | Không chuyển module mới |
| Deploy chưa sẵn | Giữ code/docs; deploy theo `sprint-3/deploy.md` |

## Examples

### Sprint 1 – Master Data & Auth ✅

| # | Module | Phân tích | Code | Test | Docs |
|---|--------|-----------|------|------|------|
| 1 | [Authentication](./modules/auth/README.md) | ✅ | ✅ | ✅ | ✅ |
| 2 | [User](./modules/user/README.md) | ✅ | ✅ | ✅ | ✅ |
| 3 | [Role & Permission](./modules/role/README.md) | ✅ | ✅ | ✅ | ✅ |
| 4 | [Warehouse](./modules/warehouse/README.md) | ✅ | ✅ | ✅ | ✅ |
| 5 | [Product](./modules/product/README.md) | ✅ | ✅ | ✅ | ✅ |
| 6 | [Supplier](./modules/supplier/README.md) | ✅ | ✅ | ✅ | ✅ |
| 7 | [Customer](./modules/customer/README.md) | ✅ | ✅ | ✅ | ✅ |

### Sprint 2 – Inventory Operations ✅

| # | Module | Phân tích | Code | Test | Docs |
|---|--------|-----------|------|------|------|
| 1 | [Goods Receipt](./modules/goods-receipt/README.md) | ✅ | ✅ | ✅ | ✅ |
| 2 | [Goods Issue](./modules/goods-issue/README.md) | ✅ | ✅ | ✅ | ✅ |
| 3 | [Inventory](./modules/inventory/README.md) | ✅ | ✅ | ✅ | ✅ |
| 4 | [Dashboard](./modules/dashboard/README.md) | ✅ | ✅ | ✅ | ✅ |

### Sprint 3 – Control & Reporting ✅ Code (chưa Deploy)

Tổng quan: [sprint-3/README.md](./sprint-3/README.md)

| # | Module | Phân tích | Code | Test | Docs |
|---|--------|-----------|------|------|------|
| 1 | [Stock Take](./modules/stock-take/README.md) | ✅ | ✅ | ✅ | ✅ |
| 2 | [Stock Adjustment](./modules/stock-adjustment/README.md) | ✅ | ✅ | ✅ | ✅ |
| 3 | [Audit Log](./modules/audit-log/README.md) | ✅ | ✅ | ✅ | ✅ |
| 4 | [Report](./modules/report/README.md) | ✅ | ✅ | ✅ | ✅ |
| 5 | [Docs / Test / Deploy](./sprint-3/deploy.md) | ✅ | ⏳ | ⏳ | ✅ |

Thứ tự code khuyến nghị: Stock Take → Stock Adjustment → Audit Log → Report → Deploy (để sau).

## Design Decisions

```text
Decision: Chia 3 Sprint thay vì big-bang.
Reason: Giảm rủi ro, có sản phẩm dùng được sớm (sau Sprint 1 đã có auth + master data).
Advantages: Feedback sớm, tiến độ đo được.
Trade-offs: Một số tích hợp chéo hoàn thiện ở Sprint sau.
```

## Notes

- Báo cáo Sprint 3: tồn kho, nhập, xuất, kiểm kê, điều chỉnh, giá trị tồn; xuất Excel/PDF.
- Trạng thái Deploy: xem [sprint-3/deploy.md](./sprint-3/deploy.md).

## Checklist

- [x] Business Rules đầy đủ
- [x] Bảng trạng thái Sprint 1–3
- [x] Workflow rõ
- [x] Design Decisions
- [x] Checklist
