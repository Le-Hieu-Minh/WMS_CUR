import api from '@/lib/axios';

export const reportApi = {
  get: (type, params) => api.get(`/reports/${type}`, { params }),
  export: (type, params) =>
    api.get(`/reports/${type}/export`, {
      params,
      responseType: 'blob',
    }),
};
