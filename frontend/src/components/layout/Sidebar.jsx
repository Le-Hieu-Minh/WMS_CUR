import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  Users,
  UserCircle,
  Shield,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ClipboardCheck,
  SlidersHorizontal,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { usePermissions } from '@/hooks/usePermissions';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', permission: 'dashboard:read' },
  { label: 'Nhập kho', icon: ArrowDownToLine, path: '/goods-receipts', permission: 'goods-receipt:read' },
  { label: 'Xuất kho', icon: ArrowUpFromLine, path: '/goods-issues', permission: 'goods-issue:read' },
  { label: 'Tồn kho', icon: Boxes, path: '/inventories', permission: 'inventory:read' },
  { label: 'Kiểm kê', icon: ClipboardCheck, path: '/stock-takes', permission: 'stock-take:read' },
  { label: 'Điều chỉnh', icon: SlidersHorizontal, path: '/stock-adjustments', permission: 'stock-adjustment:read' },
  { label: 'Báo cáo', icon: BarChart3, path: '/reports', permission: 'report:read' },
  { label: 'Sản phẩm', icon: Package, path: '/products', permission: 'product:read' },
  { label: 'Kho hàng', icon: Warehouse, path: '/warehouses', permission: 'warehouse:read' },
  { label: 'Nhà cung cấp', icon: Truck, path: '/suppliers', permission: 'supplier:read' },
  { label: 'Khách hàng', icon: Users, path: '/customers', permission: 'customer:read' },
  { label: 'Người dùng', icon: UserCircle, path: '/users', permission: 'user:read' },
  { label: 'Phân quyền', icon: Shield, path: '/roles', permission: 'role:read' },
  { label: 'Nhật ký', icon: ClipboardList, path: '/audit-logs', permission: 'audit-log:read' },
  { label: 'Cài đặt', icon: Settings, path: '/settings' },
];

export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { hasPermission } = usePermissions();

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link to="/" className="text-lg font-bold text-sidebar-primary">
            {env.appName}
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isDisabled = item.disabled;

          return (
            <Link
              key={item.path}
              to={isDisabled ? '#' : item.path}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                isDisabled && 'pointer-events-none opacity-40'
              )}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t p-4 text-xs text-muted-foreground">Sprint 3 – Control & Reporting</div>
      )}
    </aside>
  );
}
