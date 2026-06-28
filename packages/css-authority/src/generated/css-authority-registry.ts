/**
 * @generated — do not edit manually.
 * Source: packages/css-authority/src/authorities/*.json
 * Regenerate: pnpm --filter @afenda/css-authority generate:css-authority-registry
 */
import type { CssAuthorityRegistry, CssAuthorityToken } from "../contracts/css-authority.contract.js";

import registryJson from "./css-authority-registry.json" with { type: "json" };

/** JSON import widens literals — conformance gate validates shape at CI. */
export const CSS_AUTHORITY_REGISTRY = registryJson as CssAuthorityRegistry;

export const CSS_AUTHORITY_TOKENS: readonly CssAuthorityToken[] =
  CSS_AUTHORITY_REGISTRY.tokens;

export const CSS_TOKEN_IDS: readonly string[] = CSS_AUTHORITY_TOKENS.map(
  (token) => token.id
);

/** Validated at trust boundaries via `isCssTokenId()` — not a fixed-size literal union. */
export type CssTokenId = string;

export const CSS_AUTHORITY_TOKEN_NAMES: readonly string[] = CSS_AUTHORITY_TOKENS.map(
  (token) => token.name
);

export function getCssAuthorityTokenById(id: string): CssAuthorityToken | undefined {
  return CSS_AUTHORITY_TOKENS.find((token) => token.id === id);
}

export function getCssAuthorityTokenByName(name: string): CssAuthorityToken | undefined {
  return CSS_AUTHORITY_TOKENS.find((token) => token.name === name);
}

export function allowedConsumptionVarNames(): ReadonlySet<string> {
  return new Set(
    CSS_AUTHORITY_TOKENS.filter((token) => token.lifecycle !== "removed").map(
      (token) => token.name.slice(2)
    )
  );
}
