import type { DeploymentEnvironment } from "./shared.contract";

export interface EntitlementContextContract {
  readonly betaFlags: readonly string[];
  readonly companyId: string;
  readonly environment: DeploymentEnvironment;
  readonly feature: string;
  readonly localization: string;
  readonly module: string;
  readonly organizationId: string;
  readonly tenantId: string;
  readonly usageMetrics: Readonly<Record<string, number>>;
  readonly userCount: number;
}
