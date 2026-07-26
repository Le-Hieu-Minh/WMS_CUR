import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Pagination } from '@/components/shared/Pagination';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { usePermissions } from '@/hooks/usePermissions';
import { productApi, warehouseApi } from '@/features/master-data/api/masterDataApi';
import { stockAdjustmentApi } from '@/features/stock-adjustments/api/stockAdjustmentApi';
import { stockAdjustmentSchema } from '@/features/stock-adjustments/schemas/stockAdjustmentSchema';

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Có lỗi xảy ra';
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm = {
  warehouseId: '',
  adjustDate: todayISO(),
  reason: '',
  note: '',
  items: [{ productId: '', type: 'DECREASE', quantity: 1, note: '' }],
};

export default function StockAdjustmentsPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');

  const listQuery = useQuery({
    queryKey: ['stock-adjustments', { page, search, status: statusFilter }],
    queryFn: async () => {
      const { data } = await stockAdjustmentApi.list({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      return data;
    },
  });

  const optionsQuery = useQuery({
    queryKey: ['stock-adjustments', 'options'],
    queryFn: async () => {
      const [warehouses, products] = await Promise.all([
        warehouseApi.list({ limit: 100, status: 'ACTIVE' }),
        productApi.list({ limit: 100, status: 'ACTIVE' }),
      ]);
      return {
        warehouses: warehouses.data.data || [],
        products: products.data.data || [],
      };
    },
    enabled: dialogOpen,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: emptyForm,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const warehouseId = watch('warehouseId');

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      reset({
        warehouseId: editing.warehouseId,
        adjustDate: editing.adjustDate?.slice?.(0, 10) || todayISO(),
        reason: editing.reason || '',
        note: editing.note || '',
        items:
          editing.items?.map((item) => ({
            productId: item.productId,
            type: item.type,
            quantity: item.quantity,
            note: item.note || '',
          })) || emptyForm.items,
      });
    } else {
      reset(emptyForm);
    }
  }, [dialogOpen, editing, reset]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['stock-adjustments'] });
    queryClient.invalidateQueries({ queryKey: ['inventories'] });
  };

  const createMutation = useMutation({
    mutationFn: stockAdjustmentApi.create,
    onSuccess: () => {
      invalidate();
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => stockAdjustmentApi.update(id, data),
    onSuccess: () => {
      invalidate();
      closeDialog();
    },
  });

  const confirmMutation = useMutation({
    mutationFn: stockAdjustmentApi.confirm,
    onSuccess: () => {
      invalidate();
      setConfirmTarget(null);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: stockAdjustmentApi.cancel,
    onSuccess: () => {
      invalidate();
      setCancelTarget(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: stockAdjustmentApi.remove,
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
  });

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = async (row) => {
    setFormError('');
    const { data } = await stockAdjustmentApi.getById(row.id);
    setEditing(data.data);
    setDialogOpen(true);
  };

  const openView = async (row) => {
    const { data } = await stockAdjustmentApi.getById(row.id);
    setViewing(data.data);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setFormError('');
  };

  const onSubmit = async (values) => {
    setFormError('');
    const payload = {
      ...values,
      note: values.note || null,
      items: values.items.map((item) => ({
        ...item,
        note: item.note || null,
      })),
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const rows = listQuery.data?.data || [];
  const pagination = listQuery.data?.pagination;
  const options = optionsQuery.data || { warehouses: [], products: [] };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Điều chỉnh tồn kho</h2>
          <p className="text-muted-foreground">Tăng/giảm tồn do hư hỏng, mất mát hoặc điều chỉnh lệch</p>
        </div>
        {hasPermission('stock-adjustment:create') && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Tạo phiếu điều chỉnh
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Tìm mã phiếu, lý do..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter || 'ALL'}
          onValueChange={(value) => {
            setStatusFilter(value === 'ALL' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="DRAFT">Nháp</SelectItem>
            <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Kho</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!listQuery.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Chưa có phiếu điều chỉnh
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                    onClick={() => openView(row)}
                  >
                    {row.code}
                  </button>
                </TableCell>
                <TableCell>{row.warehouse?.name}</TableCell>
                <TableCell className="max-w-[220px] truncate">{row.reason}</TableCell>
                <TableCell>{row.adjustDate?.slice?.(0, 10) || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {row.status === 'DRAFT' && hasPermission('stock-adjustment:update') && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirmTarget(row)}>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setCancelTarget(row)}>
                          <XCircle className="h-4 w-4 text-amber-600" />
                        </Button>
                      </>
                    )}
                    {row.status === 'DRAFT' && hasPermission('stock-adjustment:delete') && (
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => (!open ? closeDialog() : setDialogOpen(open))}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa phiếu điều chỉnh' : 'Tạo phiếu điều chỉnh'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kho *</Label>
                <Select
                  value={warehouseId || undefined}
                  onValueChange={(v) => setValue('warehouseId', v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kho" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.code} – {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.warehouseId && <p className="text-sm text-destructive">{errors.warehouseId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustDate">Ngày điều chỉnh *</Label>
                <Input id="adjustDate" type="date" {...register('adjustDate')} />
                {errors.adjustDate && <p className="text-sm text-destructive">{errors.adjustDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Lý do *</Label>
              <Input id="reason" placeholder="VD: Hàng hư hỏng, mất mát..." {...register('reason')} />
              {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Dòng hàng *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: '', type: 'DECREASE', quantity: 1, note: '' })}
                >
                  <Plus className="h-4 w-4" />
                  Thêm dòng
                </Button>
              </div>
              {errors.items?.message && <p className="text-sm text-destructive">{errors.items.message}</p>}
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-2 rounded-md border p-3 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                      <Select
                        value={watch(`items.${index}.productId`) || undefined}
                        onValueChange={(v) => setValue(`items.${index}.productId`, v, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.code} – {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.items?.[index]?.productId && (
                        <p className="text-sm text-destructive">{errors.items[index].productId.message}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Select
                        value={watch(`items.${index}.type`) || undefined}
                        onValueChange={(v) => setValue(`items.${index}.type`, v, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INCREASE">Tăng</SelectItem>
                          <SelectItem value="DECREASE">Giảm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Input type="number" step="0.001" placeholder="SL" {...register(`items.${index}.quantity`)} />
                    </div>
                    <div className="sm:col-span-2">
                      <Input placeholder="Ghi chú" {...register(`items.${index}.note`)} />
                    </div>
                    <div className="sm:col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" {...register('note')} />
            </div>

            {formError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Lưu nháp
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết {viewing?.code}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Kho:</span> {viewing.warehouse?.name}
                </p>
                <p>
                  <span className="text-muted-foreground">Ngày:</span> {viewing.adjustDate?.slice?.(0, 10)}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-muted-foreground">Lý do:</span> {viewing.reason}
                </p>
                <p>
                  <span className="text-muted-foreground">Trạng thái:</span>{' '}
                  <StatusBadge status={viewing.status} />
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SP</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>SL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewing.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.product?.code} – {item.product?.name}
                      </TableCell>
                      <TableCell>{item.type === 'INCREASE' ? 'Tăng' : 'Giảm'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
        title="Xác nhận phiếu điều chỉnh"
        description={`Xác nhận ${confirmTarget?.code}? Tồn kho sẽ được tăng/giảm theo các dòng hàng.`}
        confirmLabel="Xác nhận"
        loading={confirmMutation.isPending}
        onConfirm={() => confirmMutation.mutate(confirmTarget.id)}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Hủy phiếu điều chỉnh"
        description={`Hủy phiếu nháp ${cancelTarget?.code}?`}
        confirmLabel="Hủy phiếu"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate(cancelTarget.id)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa phiếu điều chỉnh"
        description={`Xóa vĩnh viễn phiếu nháp ${deleteTarget?.code}?`}
        confirmLabel="Xóa"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
