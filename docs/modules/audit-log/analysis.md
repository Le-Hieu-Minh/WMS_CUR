# Audit Log – Phân tích 23 mục

## 1. Giới thiệu

Ghi nhận ai làm gì, khi nào, trên thực thể nào — phục vụ kiểm soát và truy vết.

## 2. Mục tiêu

- Lưu nhật ký bất biến
- Admin xem/lọc/search
- Không làm hỏng nghiệp vụ nếu log fail (try/catch + logger)

## 3. Nghiệp vụ

| Sự kiện MVP | Module |
|-------------|--------|
| LOGIN / LOGOUT / CHANGE_PASSWORD | Auth |
| USER_CREATE/UPDATE/STATUS | User |
| GOODS_RECEIPT_CONFIRM | GR |
| GOODS_ISSUE_CONFIRM | GI |
| STOCK_TAKE_CONFIRM | ST |
| STOCK_ADJUSTMENT_CONFIRM | SA |

## 4. User Story

| ID | Story | P |
|----|-------|---|
| AL-01 | Xem danh sách nhật ký | Must |
| AL-02 | Lọc theo module/action/user/ngày | Must |
| AL-03 | Xem chi tiết old/new JSON | Should |
| AL-04 | Không cho xóa nhật ký | Must |

## 5–7. Flow

User thao tác → Service thành công → `auditService.log(...)` → ghi DB (async hoặc sync trong cùng request; MVP: sync sau success).

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-AL01 | Append-only |
| BR-AL02 | Không lưu password / token |
| BR-AL03 | Log fail không rollback nghiệp vụ chính |
| BR-AL04 | Giữ tối thiểu action + module + entityId + userId + createdAt |

## 9. Validation (list query)

page, limit, module, action, userId, dateFrom, dateTo, search

## 10. Exception

401/403; không có DELETE API

## 11. Permission

`audit-log:read` (chỉ Admin trong seed khuyến nghị; Manager có thể không có)

**Khuyến nghị seed:** Admin = all; Manager = không `audit-log:*` và không `user:*`/`role:*` (giữ như hiện tại + không thêm audit cho Manager). Staff không có.

## 12–13. DB / API

Xem database.md, api.md

## 14. Frontend

Bật menu Nhật ký; table + filters + drawer chi tiết JSON.

## 15. Backend

```
modules/audit-log/
  auditLog.route|controller|service|repository|validation
utils/audit.js hoặc services/audit.service.js
```

## 16. AC

- Confirm GR ghi 1 log
- Login ghi log (không password)
- Không API xóa
- Filter hoạt động

## 17. Testing

Unit: sanitize payload; Integration: list + permission; không test mọi hook ngay (ưu tiên confirm + login)

## 18–23. Docs / Guides

Instrument dần theo module khi code ST/SA; backfill hook GR/GI/Auth trong cùng PR Audit hoặc PR riêng.
