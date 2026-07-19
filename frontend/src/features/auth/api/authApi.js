import api from '@/lib/axios';

export const authApi = {
  login(data) {
    return api.post('/auth/login', data);
  },

  refresh(refreshToken) {
    return api.post('/auth/refresh', { refreshToken });
  },

  logout(refreshToken) {
    return api.post('/auth/logout', { refreshToken });
  },

  me() {
    return api.get('/auth/me');
  },

  changePassword(data) {
    return api.put('/auth/change-password', data);
  },
};
