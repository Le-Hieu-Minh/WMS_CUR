import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { statsApi } from '@/features/master-data/api/masterDataApi';
import { Package, Warehouse, Users, Truck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/config/env';

export default function HomePage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  const canViewStats =
    hasPermission('product:read') ||
    hasPermission('warehouse:read') ||
    hasPermission('supplier:read') ||
    hasPermission('customer:read');

  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => statsApi.getCounts(),
    enabled: canViewStats,
  });

  const stats = [
    {
      title: 'Sản phẩm',
      value: statsQuery.data?.products,
      icon: Package,
      permission: 'product:read',
      path: '/products',
    },
    {
      title: 'Kho hàng',
      value: statsQuery.data?.warehouses,
      icon: Warehouse,
      permission: 'warehouse:read',
      path: '/warehouses',
    },
    {
      title: 'Nhà cung cấp',
      value: statsQuery.data?.suppliers,
      icon: Truck,
      permission: 'supplier:read',
      path: '/suppliers',
    },
    {
      title: 'Khách hàng',
      value: statsQuery.data?.customers,
      icon: Users,
      permission: 'customer:read',
      path: '/customers',
    },
  ].filter((stat) => hasPermission(stat.permission));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Xin chào{user?.fullName ? `, ${user.fullName}` : ''}
        </h2>
        <p className="text-muted-foreground">
          {env.appName} – Hệ thống quản lý kho. Sprint 1 đã hoàn thành các module Master Data & Auth.
        </p>
      </div>

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsQuery.isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stat.value ?? '—'
                    )}
                  </div>
                  <CardDescription>Tổng số bản ghi</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
