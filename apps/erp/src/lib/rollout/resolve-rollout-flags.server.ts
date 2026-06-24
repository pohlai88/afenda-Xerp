import type { AfendaDatabase, PlatformRolloutBundle } from "@afenda/database";
import { loadPlatformRolloutBundle } from "@afenda/database";
import { mapPlatformRolloutToEvaluationData } from "@afenda/entitlements";
import {
  type DeploymentEnvironment,
  evaluateAll,
  evaluateFeatureFlag,
  type FeatureFlagContext,
  type FeatureFlagKey,
  type FlagDecision,
} from "@afenda/feature-flags";
import type { OperatingContext } from "@afenda/kernel";

import { getServerRuntimeEnv } from "@/lib/env/server-env";

export interface ResolvedRolloutEvaluationData {
  readonly featureFlags: ReturnType<
    typeof mapPlatformRolloutToEvaluationData
  >["featureFlags"];
  readonly killSwitches: ReturnType<
    typeof mapPlatformRolloutToEvaluationData
  >["killSwitches"];
  readonly loadedAt: string;
}

export interface ResolvedRolloutFlags {
  readonly context: FeatureFlagContext;
  readonly decisions: Readonly<Record<string, FlagDecision>>;
  readonly evaluationData: ResolvedRolloutEvaluationData;
}

/** Maps ERP runtime env into rollout deployment environment vocabulary. */
export function resolveDeploymentEnvironmentForRollout(
  nodeEnv: ReturnType<
    typeof getServerRuntimeEnv
  >["NODE_ENV"] = getServerRuntimeEnv().NODE_ENV
): DeploymentEnvironment {
  return nodeEnv;
}

/** Builds feature-flag evaluation context from kernel operating context. */
export function toFeatureFlagContextFromOperatingContext(
  operatingContext: OperatingContext,
  environment: DeploymentEnvironment = resolveDeploymentEnvironmentForRollout()
): FeatureFlagContext {
  const companyId =
    operatingContext.permissionScope.companyId ??
    operatingContext.workspace.companyId ??
    operatingContext.legalEntity.companyId;

  return {
    tenantId: operatingContext.permissionScope.tenantId,
    companyId,
    environment,
  };
}

export async function resolveRolloutFlagsFromOperatingContext(
  operatingContext: OperatingContext,
  options?: {
    readonly db?: AfendaDatabase;
    readonly environment?: DeploymentEnvironment;
    readonly loadBundle?: typeof loadPlatformRolloutBundle;
  }
): Promise<ResolvedRolloutFlags> {
  const loadBundle = options?.loadBundle ?? loadPlatformRolloutBundle;
  const bundle: PlatformRolloutBundle = await loadBundle(options?.db);
  const mapped = mapPlatformRolloutToEvaluationData(bundle);
  const context = toFeatureFlagContextFromOperatingContext(
    operatingContext,
    options?.environment
  );

  const decisions = evaluateAll(
    mapped.featureFlags,
    mapped.killSwitches,
    context
  );

  return {
    context,
    decisions,
    evaluationData: {
      featureFlags: mapped.featureFlags,
      killSwitches: mapped.killSwitches,
      loadedAt: bundle.loadedAt,
    },
  };
}

export function evaluateRolloutFlagFromResolved(
  resolved: ResolvedRolloutFlags,
  key: FeatureFlagKey
): FlagDecision {
  return evaluateFeatureFlag({
    key,
    flags: resolved.evaluationData.featureFlags,
    killSwitches: resolved.evaluationData.killSwitches,
    context: resolved.context,
  });
}
