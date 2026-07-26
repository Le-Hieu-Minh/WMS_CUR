import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { warehouseApi } from '@/features/master-data/api/masterDataApi';
import { inventoryApi } from '@/features/inventory/api/inventoryApi';

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [lowStock, setLowStock] = useState(false);

  const warehousesQuery = useQuery({
    queryKey: ['warehouses', 'options'],
    queryFn: async () => {
      const { data } = await warehouseApi.list({ limit: 100, status: 'ACTIVE' });
      return data.data || [];
    },
  });

  const listQuery = useQuery({
    queryKey: ['inventories', { page, search, warehouseId, lowStock }],
    queryFn: async () => {
      const { data } = await inventoryApi.list({
        page,
        limit: 10,
        search: search || undefined,
        warehouseId: warehouseId || undefined,
        lowStock: lowStock ? 'true' : undefined,
      });
      return data;
    },
  });

  const rows = listQuery.data?.data || [];
  const pagination = listQuery.data?.pagination;
  const warehouses = warehousesQuery.data || [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tồn kho</h2>
        <p className="text-muted-foreground">Theo dõi số lượng tồn theo kho và sản phẩm</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Tìm SP / kho..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={warehouseId || 'ALL'}
          onValueChange={(value) => {
            setWarehouseId(value === 'ALL' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả kho</SelectItem>
            {warehouses.map((wh) => (
              <SelectItem key={wh.id} value={wh.id}>
                {wh.code} – {wh.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={lowStock ? 'LOW' : 'ALL'}
          onValueChange={(value) => {
            setLowStock(value === 'LOW');
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Tồn kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="LOW">Sắp hết</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kho</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>ĐVT</TableHead>
              <TableHead className="text-right">Tồn</TableHead>
              <TableHead className="text-right">Min</TableHead>
              <TableHead className="text-right">Giá trị</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!listQuery.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Chưa có dữ liệu tồn kho
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.warehouse?.code}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.product?.code}</div>
                  <div className="text-xs text-muted-foreground">{row.product?.name}</div>
                </TableCell>
                <TableCell>{row.product?.unit}</TableCell>
                <TableCell className="text-right font-medium">{row.quantity}</TableCell>
                <TableCell className="text-right">{row.minStock}</TableCell>
                <TableCell className="text-right">
                  {Number(row.stockValue || 0).toLocaleString('vi-VN')}
                </TableCell>
                <TableCell>
                  {row.isLowStock ? (
                    <Badge variant="destructive">Sắp hết</Badge>
                  ) : (
                    <Badge variant="success">Đủ hàng</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
