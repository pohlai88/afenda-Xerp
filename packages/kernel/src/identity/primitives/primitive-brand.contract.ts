import type { Brand } from "../brand/brand.contract.js";

/**
 * PAS-001 §4.1.5 — nominal brand for globally shared primitive references.
 *
 * Distinct from {@link CanonicalEnterpriseId} and {@link TenantHumanReference}.
 */
export type PrimitiveReference<TName extends string> = Brand<
  string,
  `PrimitiveReference:${TName}`
>;
