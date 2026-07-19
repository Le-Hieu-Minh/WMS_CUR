import { useAuth } from '@/features/auth/hooks/useAuth';

export function usePermissions() {
  const { user } = useAuth();
  const permissions = user?.role?.permissions ?? [];

  const hasPermission = (permission) => permissions.includes(permission);
  const hasAnyPermission = (required) => required.some((p) => permissions.includes(p));

  return { permissions, hasPermission, hasAnyPermission };
}
