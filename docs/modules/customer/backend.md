# Customer – Backend Design

```
backend/src/modules/customer/
├── customer.route.js
├── customer.controller.js
├── customer.service.js
├── customer.repository.js
└── customer.validation.js
```

## Service methods

`list`, `getById`, `create`, `update`, `changeStatus`, `softDelete`

Cùng pattern Supplier/Warehouse.

Đăng ký: `/customers` trong `routes/index.js`.
