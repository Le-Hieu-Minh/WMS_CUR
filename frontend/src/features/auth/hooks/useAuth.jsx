import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';

const AuthContext = createContext(null);

const TOKEN_KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
};

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => Boolean(localStorage.getItem(TOKEN_KEYS.access)));

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await authApi.me();
      return data.data;
    },
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isError) {
      localStorage.removeItem(TOKEN_KEYS.access);
      localStorage.removeItem(TOKEN_KEYS.refresh);
      setHasToken(false);
    }
  }, [meQuery.isError]);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await authApi.login(credentials);
      return data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEYS.access, data.accessToken);
      localStorage.setItem(TOKEN_KEYS.refresh, data.refreshToken);
      setHasToken(true);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh);
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSettled: () => {
      localStorage.removeItem(TOKEN_KEYS.access);
      localStorage.removeItem(TOKEN_KEYS.refresh);
      setHasToken(false);
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (payload) => {
      await authApi.changePassword(payload);
    },
    onSuccess: async () => {
      await logoutMutation.mutateAsync();
    },
  });

  const login = useCallback(
    (credentials) => loginMutation.mutateAsync(credentials),
    [loginMutation]
  );

  const logout = useCallback(() => logoutMutation.mutateAsync(), [logoutMutation]);

  const changePassword = useCallback(
    (payload) => changePasswordMutation.mutateAsync(payload),
    [changePasswordMutation]
  );

  const value = useMemo(
    () => ({
      user: meQuery.data || null,
      isAuthenticated: hasToken && Boolean(meQuery.data),
      isLoading: hasToken && meQuery.isLoading,
      isLoggingIn: loginMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      login,
      logout,
      changePassword,
      loginError: loginMutation.error,
    }),
    [
      meQuery.data,
      meQuery.isLoading,
      hasToken,
      loginMutation.isPending,
      loginMutation.error,
      logoutMutation.isPending,
      login,
      logout,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
