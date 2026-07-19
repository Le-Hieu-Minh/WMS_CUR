import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Loader2, LockOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { userApi } from '@/features/users/api/userApi';
import { createUserSchema, updateUserSchema, resetPasswordSchema } from '@/features/users/schemas/userSchema';

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Có lỗi xảy ra';
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');

  const listQuery = useQuery({
    queryKey: ['users', { page, search, status: statusFilter }],
    queryFn: async () => {
      const { data } = await userApi.list({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      return data;
    },
  });

  const rolesQuery = useQuery({
    queryKey: ['users', 'meta', 'roles'],
    queryFn: async () => {
      const { data } = await userApi.getRoles();
      return data.data;
    },
    enabled: dialogMode === 'create' || dialogMode === 'edit',
  });

  const schema = dialogMode === 'create' ? createUserSchema : dialogMode === 'reset' ? resetPasswordSchema : updateUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeDialog();
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => userApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeDialog();
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, payload }) => userApi.resetPassword(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeDialog();
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const unlockMutation = useMutation({
    mutationFn: userApi.unlock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => userApi.changeStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteTarget(null);
    },
  });

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedUser(null);
    setFormError('');
    reset({});
  };

  const openCreate = () => {
    setDialogMode('create');
    reset({ email: '', fullName: '', password: '', roleId: '' });
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setDialogMode('edit');
    reset({ fullName: user.fullName, roleId: user.role.id });
  };

  const openReset = (user) => {
    setSelectedUser(user);
    setDialogMode('reset');
    reset({ newPassword: '', confirmPassword: '' });
  };

  const onSubmit = (values) => {
    setFormError('');
    if (dialogMode === 'create') {
      createMutation.mutate(values);
    } else if (dialogMode === 'edit') {
      updateMutation.mutate({ id: selectedUser.id, payload: values });
    } else if (dialogMode === 'reset') {
      resetMutation.mutate({ id: selectedUser.id, payload: values });
    }
  };

  const items = listQuery.data?.data ?? [];
  const pagination = listQuery.data?.pagination;
  const roleId = watch('roleId');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Người dùng</h2>
          <p className="text-muted-foreground">Quản lý tài khoản nội bộ</p>
        </div>
        {hasPermission('user:create') && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm người dùng
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Tìm email hoặc họ tên..."
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
            <SelectItem value="LOCKED">Khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead className="w-36">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role?.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {hasPermission('user:update') && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openReset(user)}>
                              <KeyRound className="h-4 w-4" />
                            </Button>
                            {user.status === 'LOCKED' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => unlockMutation.mutate(user.id)}
                              >
                                <LockOpen className="h-4 w-4" />
                              </Button>
                            )}
                            {user.status === 'ACTIVE' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => statusMutation.mutate({ id: user.id, status: 'INACTIVE' })}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </>
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

      <Dialog open={Boolean(dialogMode)} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && 'Thêm người dùng'}
              {dialogMode === 'edit' && 'Sửa người dùng'}
              {dialogMode === 'reset' && 'Reset mật khẩu'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {dialogMode === 'create' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </>
            )}
            {(dialogMode === 'create' || dialogMode === 'edit') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ tên</Label>
                  <Input id="fullName" {...register('fullName')} />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <Select value={roleId || ''} onValueChange={(value) => setValue('roleId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {(rolesQuery.data ?? []).map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roleId && <p className="text-sm text-destructive">{errors.roleId.message}</p>}
                </div>
              </>
            )}
            {dialogMode === 'reset' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input id="newPassword" type="password" {...register('newPassword')} />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}
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
        title="Xóa người dùng"
        description={`Bạn có chắc muốn vô hiệu hóa "${deleteTarget?.fullName}"?`}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
