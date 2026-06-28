import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { CSS_AUTHORITY_TOKENS, CSS_TOKEN_IDS } from "../index.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("shadcn theme authority sync", () => {
  it("registers every :root custom property from vendored shadcn-theme.css", () => {
    const css = readFileSync(
      join(packageRoot, "src/css/vendored/shadcn-theme.css"),
      "utf8"
    );
    const rootMatch = /:root\s*\{([\s\S]*?)\}/.exec(css);
    expect(rootMatch).not.toBeNull();

    const block = rootMatch?.[1] ?? "";
    const names = [...block.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map(
      (match) => match[1] as string
    );

    expect(names.length).toBeGreaterThan(20);

    for (const name of names) {
      const token = CSS_AUTHORITY_TOKENS.find((row) => row.name === name);
      expect(token, `missing registry row for ${name}`).toBeDefined();
      expect(token?.authority).toBe("shadcn-theme");
      expect(token?.editable).toBe(false);
    }
  });

  it("keeps sequential CSS_TOKEN_IDS aligned with registry length", () => {
    expect(CSS_TOKEN_IDS.length).toBe(CSS_AUTHORITY_TOKENS.length);
    expect(CSS_TOKEN_IDS[0]).toBe("CSS-TOKEN-001");
  });
});
