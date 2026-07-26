import api from '@/lib/axios';

export const goodsIssueApi = {
  list: (params) => api.get('/goods-issues', { params }),
  getById: (id) => api.get(`/goods-issues/${id}`),
  create: (data) => api.post('/goods-issues', data),
  update: (id, data) => api.put(`/goods-issues/${id}`, data),
  confirm: (id) => api.post(`/goods-issues/${id}/confirm`),
  cancel: (id) => api.post(`/goods-issues/${id}/cancel`),
  remove: (id) => api.delete(`/goods-issues/${id}`),
};
