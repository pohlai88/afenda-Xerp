export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | { readonly [key: string]: JsonValue }
  | readonly JsonValue[];

export type DeploymentEnvironment =
  | "development"
  | "preview"
  | "staging"
  | "production"
  | "test";

export type EntitlementScope = "global" | "tenant" | "company" | "environment";

export type EntitlementKey = string;
export type FeatureFlagKey = string;
export type BetaFlagKey = string;
export type KillSwitchKey = string;
export type LocalizationKey = string;

export interface EntitlementAuditReference {
  readonly correlationId: string;
  readonly evaluatedAt: string;
}
