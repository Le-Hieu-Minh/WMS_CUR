import api from '@/lib/axios';

export const dashboardApi = {
  overview: () => api.get('/dashboard/overview'),
};
