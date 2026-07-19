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

| Module | Mô tả |
|--------|--------|
| Goods Receipt | Nhập kho |
| Goods Issue | Xuất kho |
| Inventory | Tồn kho |
| Dashboard | KPI + biểu đồ |

## Sprint 3 – Control & Reporting

| Module | Mô tả |
|--------|--------|
| Stock Take | Kiểm kê |
| Stock Adjustment | Điều chỉnh tồn |
| Report | Báo cáo + Excel/PDF |
| Audit Log | Nhật ký hoạt động |
| Docs / Test / Deploy | Hoàn thiện |

## Dashboard (Sprint 2) – phạm vi

- Tổng sản phẩm, kho, tồn kho, giá trị tồn
- Phiếu nhập/xuất hôm nay
- Hàng sắp hết
- Top nhập/xuất
- Biểu đồ nhập/xuất theo tháng

## Báo cáo (Sprint 3) – phạm vi

- Tồn kho, nhập, xuất, kiểm kê, điều chỉnh, giá trị tồn
- Xuất Excel / PDF
