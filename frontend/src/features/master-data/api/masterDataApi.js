import api from '@/lib/axios';

export const warehouseApi = {
  list: (params) => api.get('/warehouses', { params }),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  changeStatus: (id, status) => api.patch(`/warehouses/${id}/status`, { status }),
  remove: (id) => api.delete(`/warehouses/${id}`),
};

export const productApi = {
  list: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  changeStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),
  remove: (id) => api.delete(`/products/${id}`),
};

export const supplierApi = {
  list: (params) => api.get('/suppliers', { params }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  changeStatus: (id, status) => api.patch(`/suppliers/${id}/status`, { status }),
  remove: (id) => api.delete(`/suppliers/${id}`),
};

export const customerApi = {
  list: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  changeStatus: (id, status) => api.patch(`/customers/${id}/status`, { status }),
  remove: (id) => api.delete(`/customers/${id}`),
};

export const statsApi = {
  async getCounts() {
    const [products, warehouses, suppliers, customers] = await Promise.all([
      api.get('/products', { params: { limit: 1 } }),
      api.get('/warehouses', { params: { limit: 1 } }),
      api.get('/suppliers', { params: { limit: 1 } }),
      api.get('/customers', { params: { limit: 1 } }),
    ]);
    return {
      products: products.data.pagination?.total ?? 0,
      warehouses: warehouses.data.pagination?.total ?? 0,
      suppliers: suppliers.data.pagination?.total ?? 0,
      customers: customers.data.pagination?.total ?? 0,
    };
  },
};
