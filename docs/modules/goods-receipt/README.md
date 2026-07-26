# Module Goods Receipt (Nhập kho)

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 2 – Module 1 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/goods-receipts` |
| FE route | `/goods-receipts` |

## Tóm tắt quyết định

| Hạng mục | Quyết định |
|----------|------------|
| Trạng thái phiếu | DRAFT → CONFIRMED / CANCELLED |
| Cập nhật tồn | Chỉ khi **Confirm** (transaction) |
| Sửa/xóa | Chỉ khi DRAFT |
| Hủy CONFIRMED | Không hỗ trợ MVP (tránh âm kho phức tạp) |
| NCC | Optional |
| Tồn kho | Bảng `inventories` (warehouse + product unique) |

## Permissions

`goods-receipt:read` · `create` · `update` · `delete`

## Tài liệu con

[analysis](./analysis.md) · [api](./api.md) · [database](./database.md) · [frontend](./frontend.md) · [backend](./backend.md) · [user-guide](./user-guide.md) · [developer-guide](./developer-guide.md)
