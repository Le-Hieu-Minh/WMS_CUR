# Inventory – Phân tích nghiệp vụ

## Overview

Phân tích module **Tồn kho** — bảng snapshot `inventories`, không phải module chứng từ.

## Purpose

Làm rõ ai được phép đọc tồn và **module nào được phép ghi**.

## Scope

Read model + internal write API qua repository.

## Workflow

### Ai cập nhật tồn?

| Module | Hàm | Khi nào |
|--------|-----|---------|
| Goods Receipt | `increaseStock` | Confirm phiếu nhập |
| Goods Issue | `decreaseStock` | Confirm phiếu xuất |
| Stock Take | `setStock` | Confirm kiểm kê (ghi đè số đếm) |
| Stock Adjustment | `increaseStock` / `decreaseStock` | Confirm điều chỉnh +/- |

```text
User → Không sửa inventories trực tiếp
User → Tạo/chỉnh DRAFT → Confirm document → inventory thay đổi
```

## Business Rules

| ID | Quy tắc |
|----|---------|
| BR-INV01 | quantity >= 0 (app enforced) |
| BR-INV02 | Một row per warehouse+product |
| BR-INV03 | Giá trị tồn dùng costPrice master, không weighted avg từ GR |
| BR-INV04 | Low stock = quantity <= minStock |

## Technical Design

Bảng đơn giản 3 field nghiệp vụ: warehouse_id, product_id, quantity.

## API / Database (nếu có)

Public: GET `/inventories` only.

## Validation

Filter warehouseId, productId UUID; lowStock boolean string.

## Security

Read permission only for external API.

## Error Handling

N/A mutation qua inventory module.

## Examples

| Story | Priority |
|-------|----------|
| INV-01 | Xem tồn all kho | Must |
| INV-02 | Lọc theo kho | Must |
| INV-03 | Lọc sắp hết | Must |
| INV-04 | Search SP/kho | Must |

## Design Decisions

| # | Quyết định | Trade-off |
|---|------------|-----------|
| DD-INV01 | No direct edit UI | Đúng audit trail |
| DD-INV02 | No movement table MVP | Đơn giản; khó replay ledger |
| DD-INV03 | costPrice for value | Không phản ánh FIFO thực tế |

## Notes

Dashboard aggregate all inventories for totalStockQty/Value.

## Checklist

- [x] Writers documented
- [x] Read-only scope clear
- [ ] Movement ledger (future)
