/**
 * PAS-004A §4.5 — B25: Accepting Authority typed entity registry.
 *
 * Seed entries correspond to the accepting authority values present in atoms.json.
 * Extend this registry when adding new accepting authorities — do not use free strings.
 */
import type { AcceptingAuthorityEntity } from "../contracts/accepting-authority.contract.js";

export const ACCEPTING_AUTHORITY_ENTITIES = [
  {
    authorityId: "afenda_architecture_authority",
    name: "Afenda Architecture Authority",
    jurisdictionScope: "organizational",
    classification: "architecture_committee",
  },
  {
    authorityId: "afenda_accounting_authority",
    name: "Afenda Accounting Authority",
    jurisdictionScope: "organizational",
    classification: "internal_committee",
  },
  {
    authorityId: "afenda_erp_authority",
    name: "Afenda ERP Product Authority",
    jurisdictionScope: "organizational",
    classification: "internal_committee",
  },
  {
    authorityId: "iasb",
    name: "IASB",
    jurisdictionScope: "global",
    classification: "standards_body",
    standardBody: "IASB",
    url: "https://www.ifrs.org",
  },
  {
    authorityId: "external_source",
    name: "External Source (transitional)",
    jurisdictionScope: "global",
    classification: "standards_body",
  },
  {
    authorityId: "standard_body",
    name: "Standards Body (transitional)",
    jurisdictionScope: "global",
    classification: "standards_body",
  },
] as const satisfies readonly AcceptingAuthorityEntity[];

export type AcceptingAuthorityId =
  (typeof ACCEPTING_AUTHORITY_ENTITIES)[number]["authorityId"];

export function getAcceptingAuthority(
  authorityId: AcceptingAuthorityId
): AcceptingAuthorityEntity {
  const entity = ACCEPTING_AUTHORITY_ENTITIES.find(
    (a) => a.authorityId === authorityId
  );
  if (!entity) {
    throw new Error(`Unknown accepting authority: ${authorityId}`);
  }
  return entity;
}

export function isAcceptingAuthorityId(
  value: string
): value is AcceptingAuthorityId {
  return ACCEPTING_AUTHORITY_ENTITIES.some((a) => a.authorityId === value);
}

/**
 * B25 transitional aliases — acceptance chains still use ACCEPTING_AUTHORITIES enum
 * short names until B29 migrates chain `by` to canonical authorityId values.
 */
const LEGACY_ACCEPTING_AUTHORITY_ALIASES = {
  architecture_authority: "afenda_architecture_authority",
  accounting_authority: "afenda_accounting_authority",
  erp_authority: "afenda_erp_authority",
} as const satisfies Record<string, AcceptingAuthorityId>;

export function resolveAcceptingAuthorityRef(
  ref: string
): AcceptingAuthorityEntity | undefined {
  if (isAcceptingAuthorityId(ref)) {
    return getAcceptingAuthority(ref);
  }

  const alias =
    LEGACY_ACCEPTING_AUTHORITY_ALIASES[
      ref as keyof typeof LEGACY_ACCEPTING_AUTHORITY_ALIASES
    ];
  if (alias) {
    return getAcceptingAuthority(alias);
  }
}

export function isResolvableAcceptingAuthorityRef(ref: string): boolean {
  return resolveAcceptingAuthorityRef(ref) !== undefined;
}
