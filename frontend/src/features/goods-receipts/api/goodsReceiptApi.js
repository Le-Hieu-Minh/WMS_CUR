import api from '@/lib/axios';

export const goodsReceiptApi = {
  list: (params) => api.get('/goods-receipts', { params }),
  getById: (id) => api.get(`/goods-receipts/${id}`),
  create: (data) => api.post('/goods-receipts', data),
  update: (id, data) => api.put(`/goods-receipts/${id}`, data),
  confirm: (id) => api.post(`/goods-receipts/${id}/confirm`),
  cancel: (id) => api.post(`/goods-receipts/${id}/cancel`),
  remove: (id) => api.delete(`/goods-receipts/${id}`),
};
