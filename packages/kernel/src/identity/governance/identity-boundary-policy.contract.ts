/**
 * PAS-001 §4.1.2 — identity boundary policy constants for governance scripts.
 *
 * Full enforcement lives in `scripts/governance/identity/`; this module is the
 * kernel-owned contract surface for prohibited patterns.
 */

export const IDENTITY_BOUNDARY_PROHIBITED_PATTERNS = [
  "duplicate platform-id*.ts paths",
  "external ulid npm dependency in kernel",
  "second branding pattern",
  "human number generation in Kernel",
  "brandRequiredId for canonical enterprise IDs",
  "brandOptionalId for canonical enterprise IDs",
  "raw `as CustomerId`",
  "raw `as TenantId`",
  "raw `as CanonicalEnterpriseId<any>`",
  "downstream import of Brand for ID creation",
] as const;

export type IdentityBoundaryProhibitedPattern =
  (typeof IDENTITY_BOUNDARY_PROHIBITED_PATTERNS)[number];

export const IDENTITY_BOUNDARY_POLICY = {
  onlyKernelParsersMintCanonicalIds: true,
  tenantHumanReferencesAreNotCanonicalIds: true,
  primitivesDoNotUseEnterpriseParser: true,
  wireIngressMustParse: true,
  wireEgressMustSerialize: true,
} as const;

export {
  IDENTITY_PROHIBITED_PATTERN_IDS,
  IDENTITY_PROHIBITED_PATTERNS,
  type IdentityProhibitedPatternDefinition,
  type IdentityProhibitedPatternId,
} from "../registry/id-family.registry.js";
