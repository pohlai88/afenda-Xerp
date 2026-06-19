/** Stable denial codes for authorization results and thrown errors. */
export type AuthorizationDenialCode =
  | "missing_actor"
  | "missing_context"
  | "missing_tenant"
  | "inactive_actor"
  | "inactive_tenant"
  | "missing_membership"
  | "permission_denied"
  | "company_mismatch"
  | "tenant_mismatch"
  | "policy_denied"
  | "policy_gated";

export type AuthorizationContextDenialCode = Extract<
  AuthorizationDenialCode,
  "missing_tenant" | "missing_context"
>;
