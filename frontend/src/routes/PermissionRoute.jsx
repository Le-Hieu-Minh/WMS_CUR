import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';

export function PermissionRoute({ permission, permissions = [] }) {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const required = permissions.length > 0 ? permissions : [permission];
  const allowed = permission ? hasPermission(permission) : hasAnyPermission(required);

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
