import { describe, expect, it } from "vitest";

import { computePaginationRange } from "../../lib/compute-pagination-range.js";

describe("computePaginationRange", () => {
  it("returns all pages when total fits in display window", () => {
    expect(
      computePaginationRange({
        currentPage: 2,
        totalPages: 5,
        paginationItemsToDisplay: 5,
      })
    ).toEqual({
      pages: [1, 2, 3, 4, 5],
      showLeftEllipsis: false,
      showRightEllipsis: false,
    });
  });

  it("centers window around current page with ellipsis on both sides", () => {
    expect(
      computePaginationRange({
        currentPage: 5,
        totalPages: 10,
        paginationItemsToDisplay: 3,
      })
    ).toEqual({
      pages: [4, 5, 6],
      showLeftEllipsis: true,
      showRightEllipsis: true,
    });
  });

  it("anchors to start when current page is near the beginning", () => {
    expect(
      computePaginationRange({
        currentPage: 1,
        totalPages: 10,
        paginationItemsToDisplay: 3,
      })
    ).toEqual({
      pages: [1, 2, 3],
      showLeftEllipsis: false,
      showRightEllipsis: true,
    });
  });

  it("anchors to end when current page is near the last page", () => {
    expect(
      computePaginationRange({
        currentPage: 10,
        totalPages: 10,
        paginationItemsToDisplay: 3,
      })
    ).toEqual({
      pages: [8, 9, 10],
      showLeftEllipsis: true,
      showRightEllipsis: false,
    });
  });

  it("uses half-window sizing for even paginationItemsToDisplay (datatable default: 2)", () => {
    expect(
      computePaginationRange({
        currentPage: 3,
        totalPages: 8,
        paginationItemsToDisplay: 2,
      })
    ).toEqual({
      pages: [2, 3, 4],
      showLeftEllipsis: false,
      showRightEllipsis: true,
    });
  });

  it("returns empty pages for zero total pages", () => {
    expect(
      computePaginationRange({
        currentPage: 1,
        totalPages: 0,
        paginationItemsToDisplay: 2,
      })
    ).toEqual({
      pages: [],
      showLeftEllipsis: false,
      showRightEllipsis: false,
    });
  });

  it("clamps out-of-range current page and treats display count below 1 as 1", () => {
    expect(
      computePaginationRange({
        currentPage: 99,
        totalPages: 4,
        paginationItemsToDisplay: 0,
      })
    ).toEqual({
      pages: [4],
      showLeftEllipsis: true,
      showRightEllipsis: false,
    });
  });

  it("returns JSON-serializable boundary payload", () => {
    const result = computePaginationRange({
      currentPage: 2,
      totalPages: 10,
      paginationItemsToDisplay: 3,
    });

    expect(() => JSON.stringify(result)).not.toThrow();
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
});
