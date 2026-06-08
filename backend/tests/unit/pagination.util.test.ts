import { parsePagination, buildPaginationMeta } from '../../src/utils/pagination.util';

describe('pagination.util', () => {
  describe('parsePagination', () => {
    it('should return defaults when no query provided', () => {
      const result = parsePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
      expect(result.sort).toEqual({ createdAt: -1 });
    });

    it('should cap limit at 100', () => {
      const result = parsePagination({ limit: 500 });
      expect(result.limit).toBe(100);
    });

    it('should parse sort order asc', () => {
      const result = parsePagination({ sortBy: 'title', sortOrder: 'asc' });
      expect(result.sort).toEqual({ title: 1 });
    });
  });

  describe('buildPaginationMeta', () => {
    it('should calculate pagination metadata correctly', () => {
      const meta = buildPaginationMeta(47, 2, 10);
      expect(meta.total).toBe(47);
      expect(meta.totalPages).toBe(5);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(true);
    });
  });
});
