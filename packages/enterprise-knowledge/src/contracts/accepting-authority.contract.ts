/**
 * PAS-004A §4.5 — Accepting Authority contract.
 *
 * Replaces the ACCEPTING_AUTHORITIES string enum with a typed registry entity
 * that carries identity, jurisdiction, and classification. Atoms reference
 * authorityId from this registry — not a free string — after B25.
 */

export const ACCEPTING_AUTHORITY_SCOPES = [
  "global",
  "regional",
  "national",
  "organizational",
  "project",
] as const;

export type AcceptingAuthorityScope =
  (typeof ACCEPTING_AUTHORITY_SCOPES)[number];

export const ACCEPTING_AUTHORITY_CLASSIFICATIONS = [
  "regulatory_body",
  "standards_body",
  "legal_entity",
  "corporate_board",
  "architecture_committee",
  "internal_committee",
] as const;

export type AcceptingAuthorityClassification =
  (typeof ACCEPTING_AUTHORITY_CLASSIFICATIONS)[number];

export interface AcceptingAuthorityEntity {
  /** Stable identifier. Must not change after first use in an acceptance chain. */
  readonly authorityId: string;
  readonly classification: AcceptingAuthorityClassification;
  readonly jurisdictionScope: AcceptingAuthorityScope;
  /** Canonical name, e.g. "IASB", "Afenda Architecture Authority". */
  readonly name: string;
  /** Governing body affiliation, e.g. "IASB", "ISO", "FASB". */
  readonly standardBody?: string;
  readonly url?: string;
}
