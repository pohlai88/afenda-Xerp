import type { CssAuthorityToken } from "../contracts/css-authority.contract.js";
import {
  assertCssTokenId,
  isCssTokenIdFormat,
} from "../contracts/css-authority.contract.js";
import {
  CSS_AUTHORITY_REGISTRY,
  CSS_AUTHORITY_TOKENS,
  CSS_TOKEN_IDS,
  getCssAuthorityTokenById,
  getCssAuthorityTokenByName,
} from "../generated/css-authority-registry.js";

export function isCssTokenId(
  value: string
): value is (typeof CSS_TOKEN_IDS)[number] {
  return (CSS_TOKEN_IDS as readonly string[]).includes(value);
}

function collectTokenFieldErrors(
  token: CssAuthorityToken,
  seenIds: Set<string>,
  seenNames: Set<string>
): string[] {
  const errors: string[] = [];

  if (!isCssTokenIdFormat(token.id)) {
    errors.push(`Invalid token id format: ${token.id}`);
  }

  if (seenIds.has(token.id)) {
    errors.push(`Duplicate token id ${token.id}`);
  }
  seenIds.add(token.id);

  if (!token.name.startsWith("--")) {
    errors.push(`Token ${token.id} name must start with --`);
  }

  if (seenNames.has(token.name)) {
    errors.push(`Duplicate token name ${token.name}`);
  }
  seenNames.add(token.name);

  if (token.lifecycle === "removed" && token.editable) {
    errors.push(`Removed token ${token.id} must not be editable`);
  }

  if (token.parentId !== undefined) {
    try {
      assertCssTokenId(token.parentId);
    } catch {
      errors.push(`Token ${token.id} has invalid parentId ${token.parentId}`);
    }
  }

  return errors;
}

function collectParentReferenceErrors(
  tokens: readonly CssAuthorityToken[],
  seenIds: Set<string>
): string[] {
  const errors: string[] = [];

  for (const token of tokens) {
    if (token.parentId !== undefined && !seenIds.has(token.parentId)) {
      errors.push(
        `Token ${token.id} references missing parentId ${token.parentId}`
      );
    }
  }

  return errors;
}

function collectTokenIdListErrors(): string[] {
  const errors: string[] = [];

  for (const tokenId of CSS_TOKEN_IDS) {
    if (!isCssTokenId(tokenId)) {
      errors.push(`CSS_TOKEN_IDS contains unknown id ${tokenId}`);
    }
  }

  return errors;
}

export function validateCssAuthorityRegistry(): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  if (CSS_AUTHORITY_REGISTRY.schemaVersion !== 1) {
    errors.push("Registry schemaVersion must be 1");
  }

  if (CSS_TOKEN_IDS.length !== CSS_AUTHORITY_TOKENS.length) {
    errors.push("CSS_TOKEN_IDS must stay in sync with registry tokens");
  }

  for (const token of CSS_AUTHORITY_TOKENS) {
    errors.push(...collectTokenFieldErrors(token, seenIds, seenNames));
  }

  errors.push(...collectParentReferenceErrors(CSS_AUTHORITY_TOKENS, seenIds));
  errors.push(...collectTokenIdListErrors());

  return errors;
}

export function isAllowedConsumptionVar(varName: string): boolean {
  const token = getCssAuthorityTokenByName(`--${varName}`);
  if (token === undefined) {
    return false;
  }
  return token.lifecycle !== "removed";
}

export function listCssAuthorityTokens(): readonly CssAuthorityToken[] {
  return CSS_AUTHORITY_TOKENS;
}

export function getCssAuthorityToken(
  tokenId: (typeof CSS_TOKEN_IDS)[number]
): CssAuthorityToken {
  const token = getCssAuthorityTokenById(tokenId);
  if (token === undefined) {
    throw new Error(`Unknown CSS token id: ${tokenId}`);
  }
  return token;
}
