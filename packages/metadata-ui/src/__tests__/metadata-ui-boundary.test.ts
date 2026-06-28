import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = join(packageRoot, "src");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as { dependencies?: Record<string, string> };

describe("metadata-ui boundary", () => {
  it("depends on @afenda/ui-composition and @afenda/ui governance", () => {
    expect(packageJson.dependencies?.["@afenda/ui-composition"]).toBeDefined();
    expect(packageJson.dependencies?.["@afenda/ui"]).toBe("workspace:*");
  });

  it("does not depend on forbidden packages", () => {
    expect(packageJson.dependencies?.["@afenda/database"]).toBeUndefined();
    expect(packageJson.dependencies?.["@afenda/permissions"]).toBeUndefined();
    expect(packageJson.dependencies?.["@afenda/appshell"]).toBeUndefined();
  });

  it("keeps server surfaces free of client-only action renderer imports", () => {
    const surfaceSource = readFileSync(
      join(srcRoot, "surfaces/metadata-surface.tsx"),
      "utf8"
    );

    expect(surfaceSource).not.toContain("metadata-action-renderer.client");
    expect(surfaceSource).toContain("metadata-surface-actions");
  });
});
