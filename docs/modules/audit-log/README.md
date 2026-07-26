# Module Audit Log (Nhật ký hoạt động)

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 3 – Module 3 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/audit-logs` |
| FE route | `/audit-logs` |

## Quyết định

| Hạng mục | Quyết định |
|----------|------------|
| Ghi log | Append-only, không sửa/xóa |
| Cách ghi | Helper `auditService.log()` gọi từ Service layer |
| Phạm vi MVP | Auth (login/logout/change-password), User CRUD, GR/GI confirm, Stock Take/Adjustment confirm |
| Payload | JSON old/new (nullable), không lưu password |

Xem: [analysis.md](./analysis.md) · [api.md](./api.md) · [database.md](./database.md)
