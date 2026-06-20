import { describe, expect, it } from "vitest";
import {
  contrastFromOklchL,
  GOVERNED_CONTRAST_PAIRS,
  runContrastChecks,
  WCAG_AA_LARGE,
  WCAG_AA_NORMAL,
} from "../scripts/check-contrast";

describe("WCAG AA contrast gate — governed token pairs", () => {
  it("contrastFromOklchL computes plausible ratios", () => {
    // Black on white: expect near 21:1
    expect(contrastFromOklchL(0, 1)).toBeGreaterThan(18);
    // White on white: expect 1:1
    expect(contrastFromOklchL(1, 1)).toBeCloseTo(1, 0);
    // WCAG AA threshold constant sanity
    expect(WCAG_AA_NORMAL).toBe(4.5);
    expect(WCAG_AA_LARGE).toBe(3.0);
  });

  it("GOVERNED_CONTRAST_PAIRS lists at least 24 pairs", () => {
    expect(GOVERNED_CONTRAST_PAIRS.length).toBeGreaterThanOrEqual(24);
  });

  it("every governed pair covers both light and dark modes", () => {
    const lightPairs = GOVERNED_CONTRAST_PAIRS.filter((p) => p.mode === "light");
    const darkPairs  = GOVERNED_CONTRAST_PAIRS.filter((p) => p.mode === "dark");
    expect(lightPairs.length).toBeGreaterThanOrEqual(10);
    expect(darkPairs.length).toBeGreaterThanOrEqual(10);
  });

  it("all governed token pairs meet WCAG AA contrast", () => {
    const results = runContrastChecks();
    const failures = results.filter((r) => !r.passed);

    expect(
      failures,
      failures.length > 0
        ? `WCAG AA failures:\n${failures.map((f) => `  ${f.label}: ${f.ratio.toFixed(2)}:1 < ${f.minRatio}:1`).join("\n")}`
        : ""
    ).toHaveLength(0);
  });

  it("core text pairs achieve at least 7:1 (WCAG AAA)", () => {
    const coreTextPairs = GOVERNED_CONTRAST_PAIRS.filter(
      (p) => p.label.includes("text.default")
    );
    const results = runContrastChecks(coreTextPairs);
    for (const r of results) {
      expect(r.ratio, `${r.label} should be AAA (≥ 7:1)`).toBeGreaterThanOrEqual(7);
    }
  });
});
