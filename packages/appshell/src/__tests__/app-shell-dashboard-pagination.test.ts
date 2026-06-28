import { describe, expect, it } from "vitest";

import { buildDashboardPaginationRange } from "../presentation/blocks/app-shell-dashboard-pagination";

describe("buildDashboardPaginationRange", () => {
  it("returns an empty range when totalPages is zero", () => {
    expect(
      buildDashboardPaginationRange({
        currentPage: 1,
        totalPages: 0,
      })
    ).toEqual({
      pages: [],
      showLeftEllipsis: false,
      showRightEllipsis: false,
      currentPage: 1,
      totalPages: 0,
      canGoPrevious: false,
      canGoNext: false,
      isFirstPage: true,
      isLastPage: true,
    });
  });

  it("returns all pages when the total fits the visible window", () => {
    expect(
      buildDashboardPaginationRange({
        currentPage: 2,
        siblingCount: 1,
        totalPages: 5,
      })
    ).toMatchObject({
      pages: [1, 2, 3, 4, 5],
      showLeftEllipsis: false,
      showRightEllipsis: false,
      currentPage: 2,
      canGoPrevious: true,
      canGoNext: true,
    });
  });

  it("clamps an out-of-range current page", () => {
    expect(
      buildDashboardPaginationRange({
        currentPage: 99,
        siblingCount: 1,
        totalPages: 8,
      })
    ).toMatchObject({
      currentPage: 8,
      isLastPage: true,
      canGoNext: false,
    });
  });

  it("shows trailing ellipsis near the start of a long range", () => {
    expect(
      buildDashboardPaginationRange({
        boundaryCount: 1,
        currentPage: 2,
        siblingCount: 1,
        totalPages: 12,
      })
    ).toMatchObject({
      pages: [1, 2, 3, 4, 5, 12],
      showLeftEllipsis: false,
      showRightEllipsis: true,
    });
  });

  it("shows both ellipses in the middle of a long range", () => {
    expect(
      buildDashboardPaginationRange({
        boundaryCount: 1,
        currentPage: 6,
        siblingCount: 1,
        totalPages: 12,
      })
    ).toMatchObject({
      pages: [1, 5, 6, 7, 12],
      showLeftEllipsis: true,
      showRightEllipsis: true,
    });
  });

  it("shows leading ellipsis near the end of a long range", () => {
    expect(
      buildDashboardPaginationRange({
        boundaryCount: 1,
        currentPage: 11,
        siblingCount: 1,
        totalPages: 12,
      })
    ).toMatchObject({
      pages: [1, 8, 9, 10, 11, 12],
      showLeftEllipsis: true,
      showRightEllipsis: false,
    });
  });

  it("supports legacy paginationItemsToDisplay for shadcn datatable blocks", () => {
    const result = buildDashboardPaginationRange({
      currentPage: 5,
      paginationItemsToDisplay: 2,
      totalPages: 10,
    });

    expect(result.currentPage).toBe(5);
    expect(result.totalPages).toBe(10);
    expect(result.pages.length).toBeGreaterThan(0);
  });
});
