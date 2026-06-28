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

  it("has unique ids and names", () => {
    const ids = CSS_AUTHORITY_TOKENS.map((token) => token.id);
    const names = CSS_AUTHORITY_TOKENS.map((token) => token.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });
});
