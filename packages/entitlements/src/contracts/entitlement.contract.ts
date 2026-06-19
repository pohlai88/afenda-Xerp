import type {
  DeploymentEnvironment,
  EntitlementKey,
  EntitlementScope,
  JsonValue,
} from "./shared.contract";

export type EntitlementType =
  | "module"
  | "feature"
  | "usage_limit"
  | "localization"
  | "deployment"
  | "support"
  | "security"
  | "beta";

export interface EntitlementContract {
  readonly companyId: string | null;
  readonly enabled: boolean;
  readonly environment: DeploymentEnvironment | null;
  readonly key: EntitlementKey;
  readonly metadata: Readonly<Record<string, JsonValue>>;
  readonly scope: EntitlementScope;
  readonly tenantId: string | null;
  readonly type: EntitlementType;
}

export const entitlementTypes = [
  "module",
  "feature",
  "usage_limit",
  "localization",
  "deployment",
  "support",
  "security",
  "beta",
] as const satisfies readonly EntitlementType[];
