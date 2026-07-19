import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
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

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Có lỗi xảy ra';
}

function FormField({ field, register, errors }) {
  const error = errors[field.name]?.message;

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Textarea id={field.name} placeholder={field.placeholder} {...register(field.name)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input id={field.name} type="number" step={field.step || '1'} {...register(field.name)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{field.label}</Label>
      <Input id={field.name} type={field.type || 'text'} placeholder={field.placeholder} {...register(field.name)} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function MasterDataListPage({
  title,
  description,
  queryKey,
  api,
  schema,
  fields,
  columns,
  permissions,
  defaultValues,
}) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');

  const listQuery = useQuery({
    queryKey: [queryKey, { page, search, status: statusFilter }],
    queryFn: async () => {
      const { data } = await api.list({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogOpen(false);
      reset(defaultValues);
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogOpen(false);
      setEditingItem(null);
      reset(defaultValues);
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDeleteTarget(null);
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setFormError('');
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormError('');
    reset(
      fields.reduce((acc, field) => {
        acc[field.name] = item[field.name] ?? '';
        return acc;
      }, {})
    );
    setDialogOpen(true);
  };

  const onSubmit = (values) => {
    setFormError('');
    const payload = { ...values };
    fields.forEach((field) => {
      if (field.type !== 'number' && payload[field.name] === '') {
        payload[field.name] = null;
      }
    });

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const items = listQuery.data?.data ?? [];
  const pagination = listQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {hasPermission(permissions.create) && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter || 'all'}
          onValueChange={(value) => {
            setStatusFilter(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="INACTIVE">Ngừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {listQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listQuery.isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          {getErrorMessage(listQuery.error)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          Không có dữ liệu
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                  <TableHead className="w-24">Trạng thái</TableHead>
                  {(hasPermission(permissions.update) || hasPermission(permissions.delete)) && (
                    <TableHead className="w-28">Thao tác</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item) : item[col.key]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    {(hasPermission(permissions.update) || hasPermission(permissions.delete)) && (
                      <TableCell>
                        <div className="flex gap-1">
                          {hasPermission(permissions.update) && (
                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission(permissions.delete) && item.status === 'ACTIVE' && (
                            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(item)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pagination && (
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? `Sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                register={register}
                errors={errors}
              />
            ))}
            {formError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Xóa ${title.toLowerCase()}`}
        description={`Bạn có chắc muốn vô hiệu hóa "${deleteTarget?.name}"?`}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        confirmLabel="Xóa"
      />
    </div>
  );
}
