import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function Header() {
  const navigate = useNavigate();
  const { user, logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex h-14 items-center justify-end gap-2 border-b bg-background px-6">
      <span className="hidden text-sm text-muted-foreground sm:inline">{env.appName}</span>
      {user && (
        <div className="hidden items-center gap-2 text-sm md:flex">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{user.fullName}</span>
          <span className="text-muted-foreground">({user.role?.name})</span>
        </div>
      )}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/settings">Cài đặt</Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
}
