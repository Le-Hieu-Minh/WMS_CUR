import api from '@/lib/axios';

export const auditLogApi = {
  list: (params) => api.get('/audit-logs', { params }),
  getById: (id) => api.get(`/audit-logs/${id}`),
};
