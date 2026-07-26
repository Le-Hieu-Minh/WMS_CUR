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
  { code: 'goods-receipt:read', name: 'Xem phiếu nhập', module: 'goods-receipt' },
  { code: 'goods-receipt:create', name: 'Tạo phiếu nhập', module: 'goods-receipt' },
  { code: 'goods-receipt:update', name: 'Cập nhật phiếu nhập', module: 'goods-receipt' },
  { code: 'goods-receipt:delete', name: 'Xóa phiếu nhập', module: 'goods-receipt' },
  { code: 'goods-issue:read', name: 'Xem phiếu xuất', module: 'goods-issue' },
  { code: 'goods-issue:create', name: 'Tạo phiếu xuất', module: 'goods-issue' },
  { code: 'goods-issue:update', name: 'Cập nhật phiếu xuất', module: 'goods-issue' },
  { code: 'goods-issue:delete', name: 'Xóa phiếu xuất', module: 'goods-issue' },
  { code: 'inventory:read', name: 'Xem tồn kho', module: 'inventory' },
  { code: 'dashboard:read', name: 'Xem dashboard', module: 'dashboard' },
  { code: 'stock-take:read', name: 'Xem phiếu kiểm kê', module: 'stock-take' },
  { code: 'stock-take:create', name: 'Tạo phiếu kiểm kê', module: 'stock-take' },
  { code: 'stock-take:update', name: 'Cập nhật phiếu kiểm kê', module: 'stock-take' },
  { code: 'stock-take:delete', name: 'Xóa phiếu kiểm kê', module: 'stock-take' },
  { code: 'stock-adjustment:read', name: 'Xem phiếu điều chỉnh', module: 'stock-adjustment' },
  { code: 'stock-adjustment:create', name: 'Tạo phiếu điều chỉnh', module: 'stock-adjustment' },
  { code: 'stock-adjustment:update', name: 'Cập nhật phiếu điều chỉnh', module: 'stock-adjustment' },
  { code: 'stock-adjustment:delete', name: 'Xóa phiếu điều chỉnh', module: 'stock-adjustment' },
  { code: 'report:read', name: 'Xem báo cáo', module: 'report' },
  { code: 'report:export', name: 'Xuất báo cáo', module: 'report' },
  { code: 'audit-log:read', name: 'Xem nhật ký', module: 'audit-log' },
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
    permissions: PERMISSIONS.filter(
      (p) =>
        !p.code.startsWith('user:') &&
        !p.code.startsWith('role:') &&
        !p.code.startsWith('audit-log:')
    ).map((p) => p.code),
  },
  STAFF: {
    name: 'Staff',
    description: 'Nhân viên kho',
    permissions: PERMISSIONS.filter(
      (p) => p.code.endsWith(':read') && !p.code.startsWith('audit-log:')
    ).map((p) => p.code),
  },
};
