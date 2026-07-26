import { dashboardService } from '../dashboard.service.js';

describe('dashboardService', () => {
  it('exposes getOverview method', () => {
    expect(typeof dashboardService.getOverview).toBe('function');
  });
});
