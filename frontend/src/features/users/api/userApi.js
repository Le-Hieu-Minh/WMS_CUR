import api from '@/lib/axios';

export const userApi = {
  list: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  changeStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  unlock: (id) => api.post(`/users/${id}/unlock`),
  resetPassword: (id, data) => api.post(`/users/${id}/reset-password`, data),
  remove: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/meta/roles'),
};
