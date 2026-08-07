import { Loader2, Shield, User, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { env } from '@/config/env';

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN');
}

function ProfileField({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const permissions = user?.role?.permissions || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground">Quản lý tài khoản và thông tin ứng dụng</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Tài khoản
            </CardTitle>
            <CardDescription>Thông tin người dùng đang đăng nhập</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="Họ tên">{user?.fullName || '—'}</ProfileField>
            <ProfileField label="Email">{user?.email || '—'}</ProfileField>
            <ProfileField label="Vai trò">{user?.role?.name || '—'}</ProfileField>
            <ProfileField label="Trạng thái">
              {user?.status ? <StatusBadge status={user.status} /> : '—'}
            </ProfileField>
            <ProfileField label="Đăng nhập gần nhất">{formatDateTime(user?.lastLoginAt)}</ProfileField>
            <ProfileField label="Số quyền">{permissions.length}</ProfileField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5" />
              Hệ thống
            </CardTitle>
            <CardDescription>Thông tin ứng dụng WMS</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="Tên ứng dụng">{env.appName}</ProfileField>
            <ProfileField label="Phiên bản">1.0.0</ProfileField>
            <ProfileField label="API">
              <span className="break-all font-mono text-xs">{env.apiBaseUrl}</span>
            </ProfileField>
            <ProfileField label="Môi trường">{import.meta.env.MODE || 'development'}</ProfileField>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Bảo mật
          </CardTitle>
          <CardDescription>Đổi mật khẩu tài khoản. Sau khi đổi, bạn sẽ cần đăng nhập lại.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
