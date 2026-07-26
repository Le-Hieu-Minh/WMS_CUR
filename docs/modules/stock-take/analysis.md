# Stock Take – Phân tích 23 mục

## 1. Giới thiệu

Module kiểm kê đối chiếu tồn hệ thống với số đếm thực tế tại kho, ghi nhận chênh lệch và cập nhật tồn khi xác nhận.

## 2. Mục tiêu

- Tạo phiếu kiểm kê theo kho
- Nhập số lượng thực tế từng sản phẩm
- Xem variance trước khi xác nhận
- Confirm → cập nhật `inventories.quantity = countedQty`

## 3. Phân tích nghiệp vụ

| Tác vụ | Mô tả |
|--------|--------|
| Tạo DRAFT | Chọn kho, ngày, danh sách SP (từ tồn hiện có hoặc chọn thêm) |
| Snapshot | Lưu `systemQty` tại thời điểm lưu nháp |
| Nhập countedQty | User nhập số đếm |
| Confirm | Transaction set tồn theo countedQty |
| Cancel/Delete | Chỉ DRAFT |

## 4. User Story

| ID | Story | P |
|----|-------|---|
| ST-01 | Tạo phiếu kiểm kê theo kho | Must |
| ST-02 | Hệ thống điền tồn hệ thống làm systemQty | Must |
| ST-03 | Nhập số đếm thực tế | Must |
| ST-04 | Xem chênh lệch | Must |
| ST-05 | Xác nhận → cập nhật tồn | Must |
| ST-06 | Hủy/xóa phiếu nháp | Must |
| ST-07 | Không sửa phiếu đã xác nhận | Must |

## 5. Use Case

- UC-ST-Create, UC-ST-UpdateDraft, UC-ST-Confirm, UC-ST-Cancel, UC-ST-Delete, UC-ST-List/Detail

## 6. User Flow

```
/stock-takes → Tạo → chọn kho → load items từ tồn
→ nhập countedQty → Lưu nháp → Xác nhận → tồn cập nhật
```

## 7. Activity Flow

Confirm: lock phiếu DRAFT → for each item: upsert inventory quantity = countedQty → status CONFIRMED.

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-ST01 | 1 phiếu / 1 warehouse |
| BR-ST02 | ≥ 1 item; countedQty ≥ 0 |
| BR-ST03 | Không trùng product trong phiếu |
| BR-ST04 | Warehouse ACTIVE |
| BR-ST05 | Confirm trong transaction |
| BR-ST06 | systemQty snapshot lúc save draft (refresh khi update draft) |
| BR-ST07 | CONFIRMED không sửa/xóa/hủy |

## 9. Validation

- warehouseId UUID, takeDate date, items[].productId, countedQty ≥ 0
- note optional max 1000

## 10. Exception

404 không tìm thấy · 400 validation · 409 không phải DRAFT · 403 forbidden · 401

## 11. Permission Matrix

| API | Permission |
|-----|------------|
| GET list/detail | stock-take:read |
| POST create | stock-take:create |
| PUT / cancel / confirm | stock-take:update |
| DELETE | stock-take:delete |

## 12. Database Design

Xem [database.md](./database.md)

## 13. API Design

Xem [api.md](./api.md)

## 14. Frontend Design

- List: search/filter status/warehouse, StatusBadge
- Dialog/Page form: warehouse, date, table items (systemQty readonly, countedQty input, variance)
- Actions: Confirm / Cancel / Delete (DRAFT)
- Empty/Loading/Error states

## 15. Backend Design

```
modules/stock-take/
  stockTake.route|controller|service|repository|validation
```

Reuse `inventoryRepository` + thêm `setStock(warehouseId, productId, qty, tx)`.

## 16. Acceptance Criteria

- Tạo nháp có systemQty đúng
- Confirm cập nhật tồn = countedQty
- CONFIRMED không sửa được
- Variance hiển thị đúng trên UI

## 17. Testing Strategy

Unit: variance, confirm set stock, assert DRAFT  
Integration: CRUD + confirm + 409  
FE: schema validation

## 18–21. Documentation

API / DB / FE / BE docs trong thư mục module.

## 22. User Guide

Admin/Manager tạo phiếu → nhập số đếm → xác nhận.

## 23. Developer Guide

Triển khai sau Inventory; thêm `setStock`; seed permissions; đăng ký route + sidebar.
