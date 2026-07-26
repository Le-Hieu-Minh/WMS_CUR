import api from '@/lib/axios';

export const stockAdjustmentApi = {
  list: (params) => api.get('/stock-adjustments', { params }),
  getById: (id) => api.get(`/stock-adjustments/${id}`),
  create: (data) => api.post('/stock-adjustments', data),
  update: (id, data) => api.put(`/stock-adjustments/${id}`, data),
  confirm: (id) => api.post(`/stock-adjustments/${id}/confirm`),
  cancel: (id) => api.post(`/stock-adjustments/${id}/cancel`),
  remove: (id) => api.delete(`/stock-adjustments/${id}`),
};
