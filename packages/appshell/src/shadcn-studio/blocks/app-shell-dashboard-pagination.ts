export interface DashboardPaginationOptions {
  /**
   * Boundary pages always shown at the start and end of the control.
   * @default 1
   */
  readonly boundaryCount?: number;
  /** 1-based active page index. Values outside `[1, totalPages]` are clamped. */
  readonly currentPage: number;
  /**
   * Legacy window size used by shadcn datatable blocks.
   * When set without `siblingCount`, derives siblings from this value.
   * @deprecated Prefer `siblingCount` and `boundaryCount`.
   */
  readonly paginationItemsToDisplay?: number;
  /**
   * Sibling pages rendered on each side of the active page.
   * @default 1
   */
  readonly siblingCount?: number;
  /** Total number of pages. `0` yields an empty range. */
  readonly totalPages: number;
}

export interface DashboardPaginationResult {
  readonly canGoNext: boolean;
  readonly canGoPrevious: boolean;
  /** Clamped active page used for calculations. */
  readonly currentPage: number;
  readonly isFirstPage: boolean;
  readonly isLastPage: boolean;
  /** Visible 1-based page numbers in render order. */
  readonly pages: readonly number[];
  readonly showLeftEllipsis: boolean;
  readonly showRightEllipsis: boolean;
  readonly totalPages: number;
}

const DEFAULT_SIBLING_COUNT = 1;
const DEFAULT_BOUNDARY_COUNT = 1;

function clampPageIndex(page: number, totalPages: number): number {
  if (totalPages <= 0) {
    return 1;
  }

  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.min(Math.max(Math.trunc(page), 1), totalPages);
}

function normalizeCount(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.trunc(value));
}

function resolveSiblingCount(options: DashboardPaginationOptions): number {
  if (options.siblingCount !== undefined) {
    return normalizeCount(options.siblingCount, DEFAULT_SIBLING_COUNT);
  }

  if (options.paginationItemsToDisplay !== undefined) {
    const windowSize = normalizeCount(options.paginationItemsToDisplay, 2);
    return Math.max(0, Math.floor((windowSize - 1) / 2));
  }

  return DEFAULT_SIBLING_COUNT;
}

function createPageRange(start: number, end: number): readonly number[] {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function resolveEllipsisFlags(
  pages: readonly number[],
  totalPages: number
): Pick<DashboardPaginationResult, "showLeftEllipsis" | "showRightEllipsis"> {
  const firstPage = pages[0];
  const secondPage = pages[1];
  const lastPage = pages.at(-1);
  const penultimatePage = pages.length > 1 ? pages.at(-2) : undefined;

  return {
    showLeftEllipsis:
      firstPage === 1 && secondPage !== undefined && secondPage > firstPage + 1,
    showRightEllipsis:
      lastPage === totalPages &&
      penultimatePage !== undefined &&
      penultimatePage < totalPages - 1,
  };
}

/**
 * Computes a compact, ellipsis-aware pagination range for ERP dashboard tables.
 *
 * Pattern: `[boundary] … [current ± siblings] … [boundary]`
 */
export function buildDashboardPaginationRange(
  options: DashboardPaginationOptions
): DashboardPaginationResult {
  const totalPages = Math.max(0, Math.trunc(options.totalPages));
  const currentPage = clampPageIndex(options.currentPage, totalPages);
  const siblingCount = resolveSiblingCount(options);
  const boundaryCount = normalizeCount(
    options.boundaryCount,
    DEFAULT_BOUNDARY_COUNT
  );

  if (totalPages === 0) {
    return {
      pages: [],
      showLeftEllipsis: false,
      showRightEllipsis: false,
      currentPage: 1,
      totalPages: 0,
      canGoPrevious: false,
      canGoNext: false,
      isFirstPage: true,
      isLastPage: true,
    };
  }

  const totalVisibleSlots = siblingCount * 2 + 3 + boundaryCount * 2;

  let pages: readonly number[];

  if (totalPages <= totalVisibleSlots) {
    pages = createPageRange(1, totalPages);
  } else {
    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount + 1
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount
    );

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots =
      rightSiblingIndex < totalPages - boundaryCount - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leadingWindow = 3 + siblingCount * 2;
      pages = [...createPageRange(1, leadingWindow), totalPages];
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const trailingWindow = 3 + siblingCount * 2;
      pages = [
        1,
        ...createPageRange(totalPages - trailingWindow + 1, totalPages),
      ];
    } else if (shouldShowLeftDots && shouldShowRightDots) {
      pages = [
        1,
        ...createPageRange(leftSiblingIndex, rightSiblingIndex),
        totalPages,
      ];
    } else {
      pages = createPageRange(1, totalPages);
    }
  }

  const { showLeftEllipsis, showRightEllipsis } = resolveEllipsisFlags(
    pages,
    totalPages
  );

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
    currentPage,
    totalPages,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}

export type UseDashboardPaginationProps = DashboardPaginationOptions;

export type UseDashboardPaginationReturn = DashboardPaginationResult;

/** Hook wrapper kept for dashboard blocks; logic lives in `buildDashboardPaginationRange`. */
export function useDashboardPagination(
  options: UseDashboardPaginationProps
): UseDashboardPaginationReturn {
  return buildDashboardPaginationRange(options);
}
