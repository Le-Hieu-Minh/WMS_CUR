import { reportService } from '../report.service.js';

describe('reportService', () => {
  it('exposes getReport and exportReport methods', () => {
    expect(typeof reportService.getReport).toBe('function');
    expect(typeof reportService.exportReport).toBe('function');
  });

  it('getReport rejects unsupported report type', async () => {
    await expect(reportService.getReport('unknown-type', {})).rejects.toMatchObject({
      statusCode: 404,
      message: 'Loại báo cáo không hỗ trợ',
    });
  });

  it('exportReport rejects invalid format', async () => {
    await expect(reportService.exportReport('inventory', {}, 'csv')).rejects.toMatchObject({
      statusCode: 400,
      message: 'Định dạng export không hợp lệ',
    });
  });
});
