interface UseDashboardPaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly paginationItemsToDisplay: number;
}

interface UseDashboardPaginationReturn {
  readonly pages: readonly number[];
  readonly showLeftEllipsis: boolean;
  readonly showRightEllipsis: boolean;
}

export function useDashboardPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}: UseDashboardPaginationProps): UseDashboardPaginationReturn {
  function calculatePaginationRange(): readonly number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);
    const initialRange = {
      start: currentPage - halfDisplay,
      end: currentPage + halfDisplay,
    };

    const adjustedRange = {
      start: Math.max(1, initialRange.start),
      end: Math.min(totalPages, initialRange.end),
    };

    if (adjustedRange.start === 1) {
      adjustedRange.end = Math.min(paginationItemsToDisplay, totalPages);
    }

    if (adjustedRange.end === totalPages) {
      adjustedRange.start = Math.max(1, totalPages - paginationItemsToDisplay + 1);
    }

    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, index) => adjustedRange.start + index
    );
  }

  const pages = calculatePaginationRange();
  const firstPage = pages[0];
  const lastPage = pages.at(-1);

  return {
    pages,
    showLeftEllipsis: firstPage !== undefined && firstPage > 1 && firstPage > 2,
    showRightEllipsis:
      lastPage !== undefined &&
      lastPage < totalPages &&
      lastPage < totalPages - 1,
  };
}
