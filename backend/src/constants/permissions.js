export const PERMISSIONS = [
  { code: 'user:read', name: 'Xem người dùng', module: 'user' },
  { code: 'user:create', name: 'Tạo người dùng', module: 'user' },
  { code: 'user:update', name: 'Cập nhật người dùng', module: 'user' },
  { code: 'user:delete', name: 'Xóa người dùng', module: 'user' },
  { code: 'role:read', name: 'Xem phân quyền', module: 'role' },
  { code: 'role:create', name: 'Tạo vai trò', module: 'role' },
  { code: 'role:update', name: 'Cập nhật vai trò', module: 'role' },
  { code: 'role:delete', name: 'Xóa vai trò', module: 'role' },
  { code: 'warehouse:read', name: 'Xem kho', module: 'warehouse' },
  { code: 'warehouse:create', name: 'Tạo kho', module: 'warehouse' },
  { code: 'warehouse:update', name: 'Cập nhật kho', module: 'warehouse' },
  { code: 'warehouse:delete', name: 'Xóa kho', module: 'warehouse' },
  { code: 'product:read', name: 'Xem sản phẩm', module: 'product' },
  { code: 'product:create', name: 'Tạo sản phẩm', module: 'product' },
  { code: 'product:update', name: 'Cập nhật sản phẩm', module: 'product' },
  { code: 'product:delete', name: 'Xóa sản phẩm', module: 'product' },
  { code: 'supplier:read', name: 'Xem nhà cung cấp', module: 'supplier' },
  { code: 'supplier:create', name: 'Tạo nhà cung cấp', module: 'supplier' },
  { code: 'supplier:update', name: 'Cập nhật nhà cung cấp', module: 'supplier' },
  { code: 'supplier:delete', name: 'Xóa nhà cung cấp', module: 'supplier' },
  { code: 'customer:read', name: 'Xem khách hàng', module: 'customer' },
  { code: 'customer:create', name: 'Tạo khách hàng', module: 'customer' },
  { code: 'customer:update', name: 'Cập nhật khách hàng', module: 'customer' },
  { code: 'customer:delete', name: 'Xóa khách hàng', module: 'customer' },
];

export const ROLE_DEFINITIONS = {
  ADMIN: {
    name: 'Admin',
    description: 'Quản trị viên hệ thống',
    permissions: PERMISSIONS.map((p) => p.code),
  },
  MANAGER: {
    name: 'Manager',
    description: 'Quản lý kho',
    permissions: PERMISSIONS.filter((p) => !p.code.startsWith('user:') && !p.code.startsWith('role:')).map(
      (p) => p.code
    ),
  },
  STAFF: {
    name: 'Staff',
    description: 'Nhân viên kho',
    permissions: PERMISSIONS.filter((p) => p.code.endsWith(':read')).map((p) => p.code),
  },
};
