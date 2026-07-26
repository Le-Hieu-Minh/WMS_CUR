import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Warehouse,
  Boxes,
  Banknote,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { env } from '@/config/env';

function formatNumber(value) {
  return Number(value || 0).toLocaleString('vi-VN');
}

function StatCard({ title, value, icon: Icon, description, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatNumber(value)}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  );
}

function ProductRankTable({ title, rows }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.productId}>
                  <TableCell>
                    <div className="font-medium">{row.code}</div>
                    <div className="text-xs text-muted-foreground">{row.name}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(row.totalQuantity)} {row.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const canRead = hasPermission('dashboard:read');

  const overviewQuery = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const { data } = await dashboardApi.overview();
      return data.data;
    },
    enabled: canRead,
  });

  const summary = overviewQuery.data?.summary;
  const lowStock = overviewQuery.data?.lowStock || [];
  const topReceived = overviewQuery.data?.topReceived || [];
  const topIssued = overviewQuery.data?.topIssued || [];
  const monthlyChart = overviewQuery.data?.monthlyChart || [];
  const loading = overviewQuery.isLoading;

  if (!canRead) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Xin chào{user?.fullName ? `, ${user.fullName}` : ''}
        </h2>
        <p className="text-muted-foreground">
          Bạn không có quyền xem Dashboard. Liên hệ Admin nếu cần truy cập.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Xin chào{user?.fullName ? `, ${user.fullName}` : ''}
        </h2>
        <p className="text-muted-foreground">{env.appName} – Tổng quan hoạt động kho</p>
      </div>

      {overviewQuery.isError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Không tải được dữ liệu dashboard. Vui lòng thử lại.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Tổng sản phẩm" value={summary?.totalProducts} icon={Package} loading={loading} />
        <StatCard title="Tổng kho" value={summary?.totalWarehouses} icon={Warehouse} loading={loading} />
        <StatCard title="Tổng tồn kho" value={summary?.totalStockQty} icon={Boxes} description="Tổng số lượng" loading={loading} />
        <StatCard
          title="Giá trị tồn kho"
          value={summary?.totalStockValue}
          icon={Banknote}
          description="quantity × costPrice"
          loading={loading}
        />
        <StatCard
          title="Phiếu nhập hôm nay"
          value={summary?.receiptsToday}
          icon={ArrowDownToLine}
          description="Đã xác nhận"
          loading={loading}
        />
        <StatCard
          title="Phiếu xuất hôm nay"
          value={summary?.issuesToday}
          icon={ArrowUpFromLine}
          description="Đã xác nhận"
          loading={loading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Biểu đồ nhập / xuất theo tháng</CardTitle>
          <CardDescription>12 tháng gần nhất (phiếu đã xác nhận)</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="receipts" name="Nhập" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="issues" name="Xuất" fill="hsl(24.6 95% 53.1%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProductRankTable title="Top sản phẩm nhập nhiều" rows={topReceived} />
        <ProductRankTable title="Top sản phẩm xuất nhiều" rows={topIssued} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <div>
            <CardTitle className="text-base">Hàng sắp hết</CardTitle>
            <CardDescription>quantity ≤ minStock</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có sản phẩm sắp hết</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kho</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Tồn</TableHead>
                  <TableHead className="text-right">Min</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.warehouse?.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.product?.code}</div>
                      <div className="text-xs text-muted-foreground">{item.product?.name}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(item.quantity)}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.minStock)}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Sắp hết</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
