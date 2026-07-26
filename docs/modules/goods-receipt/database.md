# Goods Receipt – Database

## Bảng mới

- `inventories` — tồn theo (warehouse_id, product_id), unique
- `goods_receipts` — header phiếu
- `goods_receipt_items` — dòng hàng

## Enum

`DocumentStatus`: DRAFT | CONFIRMED | CANCELLED

## Quan hệ

```
Warehouse 1──N GoodsReceipt
Supplier  1──N GoodsReceipt (optional)
User      1──N GoodsReceipt (createdBy / confirmedBy)
GoodsReceipt 1──N GoodsReceiptItem
Product 1──N GoodsReceiptItem
Warehouse + Product ── Inventory
```
