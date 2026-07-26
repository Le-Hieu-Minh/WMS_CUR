import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/Pagination';
import { auditLogApi } from '@/features/audit-logs/api/auditLogApi';

const MODULES = [
  { value: 'auth', label: 'Auth' },
  { value: 'goods-receipt', label: 'Nhập kho' },
  { value: 'goods-issue', label: 'Xuất kho' },
  { value: 'stock-take', label: 'Kiểm kê' },
  { value: 'stock-adjustment', label: 'Điều chỉnh' },
];

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN');
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewing, setViewing] = useState(null);

  const listQuery = useQuery({
    queryKey: ['audit-logs', { page, search, module: moduleFilter, dateFrom, dateTo }],
    queryFn: async () => {
      const { data } = await auditLogApi.list({
        page,
        limit: 15,
        search: search || undefined,
        module: moduleFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      return data;
    },
  });

  const openView = async (row) => {
    const { data } = await auditLogApi.getById(row.id);
    setViewing(data.data);
  };

  const rows = listQuery.data?.data || [];
  const pagination = listQuery.data?.pagination;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Nhật ký hoạt động</h2>
        <p className="text-muted-foreground">Theo dõi đăng nhập và các thao tác xác nhận nhạy cảm</p>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row">
        <Input
          placeholder="Tìm mô tả, action..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="lg:max-w-xs"
        />
        <Select
          value={moduleFilter || 'ALL'}
          onValueChange={(value) => {
            setModuleFilter(value === 'ALL' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="lg:w-48">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả module</SelectItem>
            {MODULES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
          className="lg:w-44"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
          className="lg:w-44"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Mô tả</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!listQuery.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Chưa có nhật ký
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openView(row)}>
                <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                <TableCell>{row.user?.fullName || row.user?.email || '—'}</TableCell>
                <TableCell>{row.module}</TableCell>
                <TableCell className="font-mono text-xs">{row.action}</TableCell>
                <TableCell className="max-w-[320px] truncate">{row.description || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
      )}

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết nhật ký</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Thời gian:</span> {formatDateTime(viewing.createdAt)}
                </p>
                <p>
                  <span className="text-muted-foreground">Người dùng:</span>{' '}
                  {viewing.user?.fullName || viewing.user?.email || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">Module:</span> {viewing.module}
                </p>
                <p>
                  <span className="text-muted-foreground">Action:</span> {viewing.action}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-muted-foreground">Mô tả:</span> {viewing.description || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">Entity:</span>{' '}
                  {viewing.entityType || '—'} {viewing.entityId ? `(${viewing.entityId})` : ''}
                </p>
                <p>
                  <span className="text-muted-foreground">IP:</span> {viewing.ipAddress || '—'}
                </p>
              </div>
              {viewing.newData && (
                <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs">
                  {JSON.stringify(viewing.newData, null, 2)}
                </pre>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
