# Goods Receipt – Backend

```
backend/src/modules/goods-receipt/
├── goodsReceipt.route.js
├── goodsReceipt.controller.js
├── goodsReceipt.service.js
├── goodsReceipt.repository.js
└── goodsReceipt.validation.js

backend/src/modules/inventory/
└── inventory.repository.js   # increaseStock dùng khi confirm
```

Business logic confirm nằm trong Service + `prisma.$transaction`.
