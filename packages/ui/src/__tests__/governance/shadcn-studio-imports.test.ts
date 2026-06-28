/** @vitest-environment node */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const retiredStagingRoot = join(packageRoot, "src/components/shadcn-studio");

describe("shadcn-studio staging retirement (PAS-005A)", () => {
  it("does not retain packages/ui/src/components/shadcn-studio staging tree", () => {
    expect(existsSync(retiredStagingRoot)).toBe(false);
  });
});
