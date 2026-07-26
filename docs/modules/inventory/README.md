# Module Inventory (Tồn kho)

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 2 – Module 3 |
| Trạng thái | ✅ Đã triển khai (read-only) |
| Base path | `/api/v1/inventories` |
| FE route | `/inventories` |

## Phạm vi MVP

- Xem tồn theo kho / sản phẩm
- Search, filter warehouse, lọc sắp hết (`quantity <= minStock`)
- Hiển thị giá trị tồn (`quantity * costPrice`)

Tồn được cập nhật bởi Goods Receipt (cộng) và Goods Issue (trừ).

## Permission

`inventory:read`
