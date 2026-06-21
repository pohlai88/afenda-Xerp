import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import * as publicApi from "../index";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const INTERNAL_ONLY_EXPORTS = [
  "assertGuardedClassName",
  "guardClassName",
  "PRIMITIVE_REGISTRY_ENTRIES",
  "unknownPrimitiveError",
] as const;

describe("@afenda/ui public API", () => {
  it("exports stable primitives from the root entry", () => {
    expect(publicApi.Button).toBeTruthy();
    expect(publicApi.Badge).toBeTruthy();
    expect(publicApi.Card).toBeTruthy();
    expect(publicApi.Alert).toBeTruthy();
    expect(publicApi.Field).toBeTruthy();
    expect(publicApi.Table).toBeTruthy();
  });

  it("does not expose internal governance guards from root index", () => {
    for (const symbol of INTERNAL_ONLY_EXPORTS) {
      expect(Object.hasOwn(publicApi, symbol)).toBe(false);
    }
  });

  it("exports styles.css and afenda-ui-full.css subpaths from package.json", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { exports?: Record<string, { import?: string }> };

    expect(packageJson.exports?.["./styles.css"]?.import).toContain("ui.css");
    expect(packageJson.exports?.["./afenda-ui-full.css"]?.import).toContain(
      "afenda-ui-full.css"
    );
  });
});
