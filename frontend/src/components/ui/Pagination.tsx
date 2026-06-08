import { Button } from './Button';
import { PaginationMeta } from '../../types/api.types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, totalPages, hasNextPage, hasPrevPage, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="pagination-info">
        Page {page} of {totalPages} ({total} total)
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};
