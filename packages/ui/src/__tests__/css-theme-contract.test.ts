import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateCssThemeContract } from "@afenda/css-authority";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = join(packageRoot, "../..");

describe("PAS-005 CSS theme contract (B33)", () => {
  it("validates afenda-ui import chain, B30 shim, bridge, dist, and Storybook spot-check", () => {
    const issues = validateCssThemeContract({ repoRoot });
    expect(issues, issues.map((i) => i.message).join("; ")).toHaveLength(0);
  });
});
