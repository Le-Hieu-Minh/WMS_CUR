import api from '@/lib/axios';

export const roleApi = {
  list: (params) => api.get('/roles', { params }),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  remove: (id) => api.delete(`/roles/${id}`),
  getPermissions: () => api.get('/roles/meta/permissions'),
};
