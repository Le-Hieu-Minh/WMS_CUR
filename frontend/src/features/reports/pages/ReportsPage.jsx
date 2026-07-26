import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermissions } from '@/hooks/usePermissions';
import { warehouseApi } from '@/features/master-data/api/masterDataApi';
import { reportApi } from '@/features/reports/api/reportApi';

const REPORT_TYPES = [
  { value: 'inventory', label: 'Tồn kho' },
  { value: 'stock-value', label: 'Giá trị tồn' },
  { value: 'goods-receipts', label: 'Nhập kho' },
  { value: 'goods-issues', label: 'Xuất kho' },
  { value: 'stock-takes', label: 'Kiểm kê' },
  { value: 'stock-adjustments', label: 'Điều chỉnh' },
];

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { hasPermission } = usePermissions();
  const [type, setType] = useState('inventory');
  const [warehouseId, setWarehouseId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exporting, setExporting] = useState('');
  const [exportError, setExportError] = useState('');

  const warehousesQuery = useQuery({
    queryKey: ['reports', 'warehouses'],
    queryFn: async () => {
      const { data } = await warehouseApi.list({ limit: 100, status: 'ACTIVE' });
      return data.data || [];
    },
  });

  const params = {
    warehouseId: warehouseId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };

  const reportQuery = useQuery({
    queryKey: ['reports', type, params],
    queryFn: async () => {
      const { data } = await reportApi.get(type, params);
      return data.data;
    },
    enabled: hasPermission('report:read'),
  });

  const handleExport = async (format) => {
    setExportError('');
    setExporting(format);
    try {
      const response = await reportApi.export(type, { ...params, format });
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] || `${type}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      downloadBlob(response.data, filename);
    } catch (error) {
      setExportError(error?.response?.data?.message || 'Xuất báo cáo thất bại');
    } finally {
      setExporting('');
    }
  };

  const report = reportQuery.data;
  const rows = report?.rows || [];
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const warehouses = warehousesQuery.data || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Báo cáo</h2>
          <p className="text-muted-foreground">Xem và xuất Excel/PDF các báo cáo kho</p>
        </div>
        {hasPermission('report:export') && (
          <div className="flex gap-2">
            <Button variant="outline" disabled={Boolean(exporting)} onClick={() => handleExport('excel')}>
              {exporting === 'excel' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Excel
            </Button>
            <Button variant="outline" disabled={Boolean(exporting)} onClick={() => handleExport('pdf')}>
              {exporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              PDF
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Loại báo cáo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kho</Label>
          <Select value={warehouseId || 'ALL'} onValueChange={(v) => setWarehouseId(v === 'ALL' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả kho" />
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
        </div>
        <div className="space-y-2">
          <Label>Từ ngày</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Đến ngày</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      {exportError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {exportError}
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Download className="h-4 w-4" />
        {report?.title || 'Báo cáo'} — {report?.total ?? 0} dòng
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.length === 0 ? (
                <TableHead>Dữ liệu</TableHead>
              ) : (
                headers.map((h) => <TableHead key={h}>{h}</TableHead>)
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={Math.max(headers.length, 1)} className="py-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!reportQuery.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={Math.max(headers.length, 1)} className="py-8 text-center text-muted-foreground">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {rows.slice(0, 100).map((row, index) => (
              <TableRow key={index}>
                {headers.map((h) => (
                  <TableCell key={h} className="whitespace-nowrap">
                    {row[h] instanceof Date || (typeof row[h] === 'string' && row[h].includes('T'))
                      ? String(row[h]).slice(0, 10)
                      : String(row[h] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {rows.length > 100 && (
        <p className="text-sm text-muted-foreground">Hiển thị 100/{rows.length} dòng. Xuất file để xem đầy đủ.</p>
      )}
    </div>
  );
}
