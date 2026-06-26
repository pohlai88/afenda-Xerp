import { describe, expect, it } from "vitest";

import {
  compareCoverageToFloor,
  readTotalCoveragePct,
} from "../check-coverage-summary.mjs";

describe("check-coverage-summary (ARCH-TEST-001 Slice 4)", () => {
  it("reads total pct from coverage-summary.json shape", () => {
    expect(
      readTotalCoveragePct({
        total: {
          lines: { pct: 87.28 },
          statements: { pct: 87.28 },
          functions: { pct: 92.63 },
          branches: { pct: 79.81 },
        },
      })
    ).toEqual({
      lines: 87.28,
      statements: 87.28,
      functions: 92.63,
      branches: 79.81,
    });
  });

  it("reports metric failures below floor", () => {
    expect(
      compareCoverageToFloor(
        { lines: 72, statements: 72, functions: 82, branches: 77 },
        { lines: 73, statements: 73, functions: 83, branches: 78 }
      )
    ).toEqual([
      "lines: 72.00% < floor 73%",
      "statements: 72.00% < floor 73%",
      "functions: 82.00% < floor 83%",
      "branches: 77.00% < floor 78%",
    ]);
  });

  it("passes when all metrics meet floor", () => {
    expect(
      compareCoverageToFloor(
        { lines: 93, statements: 93, functions: 95, branches: 83 },
        { lines: 90, statements: 90, functions: 90, branches: 80 }
      )
    ).toEqual([]);
  });
});
