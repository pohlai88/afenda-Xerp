import { join } from "node:path";

import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const repoRoot = join(import.meta.dirname, "../../..");
const scriptPath = join(
  repoRoot,
  "scripts/storybook/discard-blocks-without-consumer.mjs"
);

describe("discard-blocks-without-consumer (v2 quarantine)", () => {
  it("reports no orphans when quarantine matches empty baseline", () => {
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/no orphan quarantine file/);
  });
});
