export type ComputePaginationRangeInput = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay: number;
};

export type ComputePaginationRangeResult = {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
};

/**
 * Pure pagination window for shadcn datatable blocks (not a React hook).
 * Used by datatable-invoice, datatable-user, datatable-product.
 */
export function computePaginationRange({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}: ComputePaginationRangeInput): ComputePaginationRangeResult {
  const itemsToDisplay = Math.max(1, paginationItemsToDisplay);

  if (totalPages <= 0) {
    return {
      pages: [],
      showLeftEllipsis: false,
      showRightEllipsis: false,
    };
  }

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  if (totalPages <= itemsToDisplay) {
    return {
      pages: Array.from({ length: totalPages }, (_, index) => index + 1),
      showLeftEllipsis: false,
      showRightEllipsis: false,
    };
  }

  const halfDisplay = Math.floor(itemsToDisplay / 2);

  const initialRange = {
    start: safeCurrentPage - halfDisplay,
    end: safeCurrentPage + halfDisplay,
  };

  const adjustedRange = {
    start: Math.max(1, initialRange.start),
    end: Math.min(totalPages, initialRange.end),
  };

  if (adjustedRange.start === 1) {
    adjustedRange.end = Math.min(itemsToDisplay, totalPages);
  }

  if (adjustedRange.end === totalPages) {
    adjustedRange.start = Math.max(1, totalPages - itemsToDisplay + 1);
  }

  const pages = Array.from(
    { length: adjustedRange.end - adjustedRange.start + 1 },
    (_, index) => adjustedRange.start + index
  );

  const firstPage = pages[0] ?? 0;
  const lastPage = pages.at(-1) ?? 0;

  const showLeftEllipsis =
    pages.length > 0 && firstPage > 1 && firstPage > 2;

  const showRightEllipsis =
    pages.length > 0 &&
    lastPage < totalPages &&
    lastPage < totalPages - 1;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}
