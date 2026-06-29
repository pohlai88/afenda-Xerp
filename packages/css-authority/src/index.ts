/** PAS-005 — @afenda/css-authority public surface. */

export const CSS_AUTHORITY_PACKAGE_VERSION = "0.0.0" as const;
export const CSS_AUTHORITY_PACKAGE_NAME = "@afenda/css-authority" as const;

export type {
  CssAuthorityDomain,
  CssAuthorityDomainSource,
  CssAuthorityFileEntry,
  CssAuthorityFileRegistry,
  CssAuthorityIdSequence,
  CssAuthorityRegistry,
  CssAuthorityToken,
  CssTokenAuthorityDomain,
  CssTokenCategory,
  CssTokenLifecycle,
} from "./contracts/css-authority.contract.js";

export {
  assertCssTokenId,
  CSS_AUTHORITY_DOMAINS,
  CSS_TOKEN_AUTHORITY_DOMAINS,
  CSS_TOKEN_CATEGORIES,
  CSS_TOKEN_ID_PATTERN,
  CSS_TOKEN_LIFECYCLES,
  isCssTokenAuthorityDomain,
  isCssTokenCategory,
  isCssTokenIdFormat,
  isCssTokenLifecycle,
} from "./contracts/css-authority.contract.js";

export {
  allowedConsumptionVarNames,
  CSS_AUTHORITY_REGISTRY,
  CSS_AUTHORITY_TOKEN_NAMES,
  CSS_AUTHORITY_TOKENS,
  CSS_TOKEN_IDS,
  type CssTokenId,
  getCssAuthorityTokenById,
  getCssAuthorityTokenByName,
} from "./generated/css-authority-registry.js";

export {
  getCssAuthorityToken,
  isAllowedConsumptionVar,
  isCssTokenId,
  listCssAuthorityTokens,
  validateCssAuthorityRegistry,
} from "./policy/css-authority.policy.js";

export function getCssAuthorityPackageName(): typeof CSS_AUTHORITY_PACKAGE_NAME {
  return CSS_AUTHORITY_PACKAGE_NAME;
}

export {
  type CssThemeContractIssue,
  type CssThemeContractOptions,
  validateCssThemeContract,
} from "./validation/css-theme-contract.js";
