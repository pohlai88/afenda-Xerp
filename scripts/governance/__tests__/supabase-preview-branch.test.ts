import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../../..");
const SCRIPT = resolve(REPO_ROOT, "scripts/ops/supabase-preview-branch.mjs");

describe("supabase-preview-branch.mjs", () => {
  it("prints help with exit 0", () => {
    const result = spawnSync(process.execPath, [SCRIPT, "--help"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("preview branch");
  });
});
