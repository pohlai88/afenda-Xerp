import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  CSS_AUTHORITY_TOKENS,
  CSS_TOKEN_IDS,
  getCssAuthorityToken,
  getCssAuthorityTokenById,
  getCssAuthorityTokenByName,
  isAllowedConsumptionVar,
  isCssTokenId,
  validateCssAuthorityRegistry,
} from "../index.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("CSS Authority Registry", () => {
  it("validates the generated registry", () => {
    expect(validateCssAuthorityRegistry()).toEqual([]);
  });

  it("keeps CSS_TOKEN_IDS in sync with registry token order", () => {
    const registryIds = CSS_AUTHORITY_TOKENS.map((token) => token.id);
    expect([...CSS_TOKEN_IDS]).toEqual(registryIds);
  });

  it("includes seed CSS-TOKEN-001 for --background", () => {
    expect(isCssTokenId("CSS-TOKEN-001")).toBe(true);
    const token = getCssAuthorityTokenById("CSS-TOKEN-001");
    expect(token?.name).toBe("--background");
    expect(token?.owner).toBe("shadcn");
    expect(token?.lifecycle).toBe("stable");
    expect(getCssAuthorityToken("CSS-TOKEN-001").id).toBe("CSS-TOKEN-001");
  });

  it("resolves tokens by CSS variable name", () => {
    expect(getCssAuthorityTokenByName("--background")?.id).toBe(
      "CSS-TOKEN-001"
    );
  });

  it("allows consumption of stable token var names", () => {
    expect(isAllowedConsumptionVar("background")).toBe(true);
    expect(isAllowedConsumptionVar("unknown-token")).toBe(false);
  });

  it("rejects invalid token id strings", () => {
    expect(isCssTokenId("not-a-token")).toBe(false);
  });

  it("keeps the generated TypeScript registry module thin for IDE performance", () => {
    const registryTsPath = join(
      packageRoot,
      "src/generated/css-authority-registry.ts"
    );
    const lineCount = readFileSync(registryTsPath, "utf8").split("\n").length;
    expect(lineCount).toBeLessThan(100);
  });

  it("has unique ids and names", () => {
    const ids = CSS_AUTHORITY_TOKENS.map((token) => token.id);
    const names = CSS_AUTHORITY_TOKENS.map((token) => token.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });
});
