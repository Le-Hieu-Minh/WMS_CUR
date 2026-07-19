import { describe, expect, it } from '@jest/globals';
import { buildPagination, parsePagination } from '../pagination.js';

describe('pagination utils', () => {
  it('parsePagination uses defaults', () => {
    const result = parsePagination({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(0);
    expect(result.sortOrder).toBe('desc');
  });

  it('parsePagination caps limit at 100', () => {
    const result = parsePagination({ limit: 500 });
    expect(result.limit).toBe(100);
  });

  it('buildPagination calculates totalPages', () => {
    expect(buildPagination(1, 10, 25)).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });
});
