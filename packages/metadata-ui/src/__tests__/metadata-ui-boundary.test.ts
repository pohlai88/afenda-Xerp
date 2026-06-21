import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as { dependencies?: Record<string, string> };

describe("metadata-ui boundary", () => {
  it("depends on @afenda/metadata", () => {
    expect(packageJson.dependencies?.["@afenda/metadata"]).toBeDefined();
  });

  it("does not depend on forbidden packages", () => {
    expect(packageJson.dependencies?.["@afenda/database"]).toBeUndefined();
    expect(packageJson.dependencies?.["@afenda/permissions"]).toBeUndefined();
    expect(packageJson.dependencies?.["@afenda/appshell"]).toBeUndefined();
  });
});
