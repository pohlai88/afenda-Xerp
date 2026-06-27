/**
 * PAS-001 §4.1.7 — trust boundary policy constants for governance scripts.
 *
 * Wire JSON keeps plain string IDs. Ingress must parse; egress must serialize.
 * Enforcement scripts live under `scripts/governance/identity/`.
 */

export const IDENTITY_TRUST_BOUNDARY_PROHIBITED_PATTERNS = [
  "as TenantId",
  "as CustomerId",
  "as EmployeeId",
  "as CanonicalEnterpriseId",
  "brandRequiredId",
  "brandOptionalId",
  "unchecked Brand cast outside Kernel identity parser",
] as const;

export type IdentityTrustBoundaryProhibitedPattern =
  (typeof IDENTITY_TRUST_BOUNDARY_PROHIBITED_PATTERNS)[number];

export const IDENTITY_TRUST_BOUNDARY_POLICY = {
  approvedIngressPattern: "parse*",
  approvedFamilyUnknownIngressPattern: "parseWireRegisteredCanonicalId",
  approvedEgressPattern: "serialize*",
  prohibitedPatterns: IDENTITY_TRUST_BOUNDARY_PROHIBITED_PATTERNS,
  /** @deprecated Trim-only helpers — never for canonical enterprise IDs. */
  deprecatedIngressHelpers: ["brandRequiredId", "brandOptionalId"],
  /** Egress serializers — `to*` / `normalize*ForWire` strip brands for wire payloads. */
  egressSerializers: ["serializeCanonicalId", "to*", "normalize*ForWire"],
  newCodeRequirement: "parse* / create* only",
} as const;
