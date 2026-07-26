import api from '@/lib/axios';

export const stockTakeApi = {
  list: (params) => api.get('/stock-takes', { params }),
  getById: (id) => api.get(`/stock-takes/${id}`),
  getWarehouseProducts: (warehouseId) =>
    api.get('/stock-takes/meta/warehouse-products', { params: { warehouseId } }),
  create: (data) => api.post('/stock-takes', data),
  update: (id, data) => api.put(`/stock-takes/${id}`, data),
  confirm: (id) => api.post(`/stock-takes/${id}/confirm`),
  cancel: (id) => api.post(`/stock-takes/${id}/cancel`),
  remove: (id) => api.delete(`/stock-takes/${id}`),
};
