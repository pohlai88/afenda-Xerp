import type { DeploymentEnvironment } from "@afenda/entitlements";

/** Execution context for feature-flag resolution. */
export interface FeatureFlagContext {
  readonly companyId: string;
  readonly environment: DeploymentEnvironment;
  readonly tenantId: string;
}
