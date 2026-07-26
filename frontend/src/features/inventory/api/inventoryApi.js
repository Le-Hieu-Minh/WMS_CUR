import api from '@/lib/axios';

export const inventoryApi = {
  list: (params) => api.get('/inventories', { params }),
};
