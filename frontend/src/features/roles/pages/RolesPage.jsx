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
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Pagination } from '@/components/shared/Pagination';
import { usePermissions } from '@/hooks/usePermissions';
import { roleApi } from '@/features/roles/api/roleApi';
import { createRoleSchema, updateRoleSchema } from '@/features/roles/schemas/roleSchema';

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Có lỗi xảy ra';
}

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const listQuery = useQuery({
    queryKey: ['roles', { page, search }],
    queryFn: async () => {
      const { data } = await roleApi.list({ page, limit: 10, search: search || undefined });
      return data;
    },
  });

  const permissionsQuery = useQuery({
    queryKey: ['roles', 'meta', 'permissions'],
    queryFn: async () => {
      const { data } = await roleApi.getPermissions();
      return data.data;
    },
    enabled: dialogOpen,
  });

  const schema = editingRole ? updateRoleSchema : createRoleSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: roleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      closeDialog();
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => roleApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      closeDialog();
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: roleApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setDeleteTarget(null);
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRole(null);
    setSelectedPermissions([]);
    setFormError('');
    reset({});
  };

  const openCreate = () => {
    setEditingRole(null);
    setSelectedPermissions([]);
    reset({ name: '', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions.map((p) => p.id));
    reset({ name: role.name, description: role.description || '' });
    setDialogOpen(true);
  };

  const togglePermission = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const onSubmit = (values) => {
    setFormError('');
    const payload = {
      ...values,
      permissionIds: selectedPermissions,
    };

    if (selectedPermissions.length === 0) {
      setFormError('Chọn ít nhất 1 quyền');
      return;
    }

    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, payload });
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
          <h2 className="text-2xl font-bold tracking-tight">Phân quyền</h2>
          <p className="text-muted-foreground">Quản lý vai trò và quyền hạn</p>
        </div>
        {hasPermission('role:create') && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm vai trò
          </Button>
        )}
      </div>

      <Input
        placeholder="Tìm vai trò..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="sm:max-w-xs"
      />

      {listQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số quyền</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="w-28">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || '—'}</TableCell>
                    <TableCell>{role.permissions.length}</TableCell>
                    <TableCell>{role.userCount}</TableCell>
                    <TableCell>
                      {role.isSystem ? (
                        <Badge variant="secondary">Hệ thống</Badge>
                      ) : (
                        <Badge variant="outline">Tùy chỉnh</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {hasPermission('role:update') && (
                          <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {hasPermission('role:delete') && !role.isSystem && role.userCount === 0 && (
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(role)}>
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
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Sửa vai trò' : 'Thêm vai trò'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên vai trò</Label>
              <Input
                id="name"
                {...register('name')}
                disabled={editingRole?.isSystem}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label>Quyền hạn</Label>
              <div className="max-h-48 space-y-3 overflow-y-auto rounded-md border p-3">
                {permissionsQuery.data &&
                  Object.entries(permissionsQuery.data).map(([module, perms]) => (
                    <div key={module}>
                      <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{module}</p>
                      <div className="flex flex-wrap gap-2">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                            />
                            {perm.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
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
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa vai trò"
        description={`Bạn có chắc muốn xóa vai trò "${deleteTarget?.name}"?`}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
