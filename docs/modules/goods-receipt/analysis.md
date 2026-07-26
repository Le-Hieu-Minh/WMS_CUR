# Goods Receipt – Phân tích nghiệp vụ

## 1. Giới thiệu

Module quản lý phiếu nhập kho: tạo nháp, chỉnh dòng hàng, xác nhận nhập (cộng tồn), hủy nháp.

## 2. Mục tiêu

- Ghi nhận hàng nhập vào kho từ nhà cung cấp (hoặc nhập khác)
- Cộng tồn kho khi xác nhận phiếu
- Lịch sử phiếu nhập phục vụ báo cáo Sprint 3

## 3. Nghiệp vụ

| Tác vụ | Mô tả |
|--------|--------|
| Tạo phiếu DRAFT | Chọn kho, ngày, NCC (opt), dòng SP + SL + đơn giá |
| Sửa DRAFT | Đổi header/items |
| Xác nhận | CONFIRMED + tăng `inventories.quantity` |
| Hủy DRAFT | CANCELLED, không đụng tồn |
| Xóa DRAFT | Hard delete phiếu nháp |
| Xem list/detail | Search, filter status/warehouse |

## 4. User Story

- GR-01: Tạo phiếu nhập nháp  
- GR-02: Thêm nhiều dòng sản phẩm  
- GR-03: Xác nhận → tồn tăng  
- GR-04: Hủy/xóa phiếu nháp  
- GR-05: Không sửa phiếu đã xác nhận  

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-GR01 | Ít nhất 1 dòng item, quantity > 0 |
| BR-GR02 | Warehouse/Product phải ACTIVE |
| BR-GR03 | Confirm trong transaction |
| BR-GR04 | Không product trùng trong cùng phiếu (merge hoặc reject) → **reject duplicate** |
| BR-GR05 | Code tự sinh: `GR-YYYYMMDD-XXXX` |
| BR-GR06 | CONFIRMED/CANCELLED không sửa/xóa |

## 11. Permission

| Action | Permission |
|--------|------------|
| List/Detail | goods-receipt:read |
| Create | goods-receipt:create |
| Update/Confirm/Cancel | goods-receipt:update |
| Delete draft | goods-receipt:delete |
