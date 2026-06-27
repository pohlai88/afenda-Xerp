/**
 * PAS-001 §4.1.11 — Better Auth boundary policy constants for governance scripts.
 *
 * Better Auth login subjects, platform actor UUID PKs, and ERP enterprise user IDs
 * are distinct identity layers. Ingress must parse each field through its parser.
 */

export const BETTER_AUTH_BOUNDARY_PROHIBITED_PATTERNS = [
  "as UserId for auth subject",
  "as AuthSubjectId from usr_*",
  "merge authSubjectId with userId",
  "AuthSubjectId in ID_FAMILIES",
] as const;

export type BetterAuthBoundaryProhibitedPattern =
  (typeof BETTER_AUTH_BOUNDARY_PROHIBITED_PATTERNS)[number];

export const BETTER_AUTH_BOUNDARY_POLICY = {
  authSubjectIsLoginIdentityOnly: true,
  userIdIsErpActorEnterpriseId: true,
  platformActorPkIsInternalUuid: true,
  doNotMergeAuthSubjectWithUserId: true,
  authSubjectIdNotInIdFamilies: true,
  approvedAuthSubjectIngress: "parseAuthSubjectId",
  approvedActorBridgeIngress: "parseAuthActorIdentity",
  approvedActorBridgeEgress: "serializeAuthActorIdentity",
  prohibitedPatterns: BETTER_AUTH_BOUNDARY_PROHIBITED_PATTERNS,
} as const;
