# Tổng quan sản phẩm

## Vai trò tài liệu

Tài liệu này mô tả mục tiêu sản phẩm WMS cho doanh nghiệp vừa và nhỏ (SME), theo tư duy Production Ready nhưng phù hợp dự án cá nhân ~2–3 tuần.

## Mục tiêu

Xây dựng hệ thống Warehouse Management System bao gồm:

- Quản lý hàng hóa, kho, nhập/xuất, tồn kho
- Kiểm kê, điều chỉnh tồn kho
- Nhà cung cấp, khách hàng
- Dashboard, báo cáo
- Người dùng, phân quyền
- Nhật ký hoạt động (Audit Log)

**Ưu tiên:** MVP hoàn chỉnh → dễ dùng → UI hiện đại → hiệu năng tốt → kiến trúc rõ → dễ mở rộng → code sạch.

## Phạm vi

### Trong phạm vi

Chỉ các chức năng thuộc WMS theo kế hoạch Sprint.

### Ngoài phạm vi (không tự ý bổ sung)

CRM, ERP, POS, AI, Chat, Notification, Socket Realtime, Workflow Approval, Purchase Order, Sales Order, Batch/Lot/Serial, Barcode/QR Scanner, Mobile App, Multi Company, Kế toán, Marketing.

## Nguyên tắc thiết kế

SOLID · DRY · KISS · Clean Architecture · RESTful · Modular · Reusable · Responsive · Maintainability · Scalability

## Tài khoản mặc định (seed)

| Email | Password | Role |
|-------|----------|------|
| `admin@wms.com` | `Admin@123` | Admin |
