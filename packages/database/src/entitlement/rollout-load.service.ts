/**
 * Platform rollout loading — reads feature flags and kill switches from Postgres.
 */
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import {
  platformFeatureFlags,
  platformKillSwitches,
} from "../schema/rollout.schema.js";
import {
  type PlatformRolloutBundle,
  parseFeatureFlagAllowlist,
  parseFeatureFlagEnvironments,
} from "./rollout.contract.js";

export async function loadPlatformRolloutBundle(
  db: AfendaDatabase = getDb()
): Promise<PlatformRolloutBundle> {
  const [featureFlagRows, killSwitchRows] = await Promise.all([
    db
      .select({
        key: platformFeatureFlags.key,
        enabled: platformFeatureFlags.enabled,
        rollout: platformFeatureFlags.rollout,
        environments: platformFeatureFlags.environments,
        tenantAllowlist: platformFeatureFlags.tenantAllowlist,
        companyAllowlist: platformFeatureFlags.companyAllowlist,
        killSwitchKey: platformFeatureFlags.killSwitchKey,
        metadata: platformFeatureFlags.metadata,
      })
      .from(platformFeatureFlags),
    db
      .select({
        key: platformKillSwitches.key,
        active: platformKillSwitches.active,
        severity: platformKillSwitches.severity,
        reason: platformKillSwitches.reason,
        activatedBy: platformKillSwitches.activatedBy,
        activatedAt: platformKillSwitches.activatedAt,
      })
      .from(platformKillSwitches),
  ]);

  return {
    loadedAt: new Date().toISOString(),
    featureFlags: featureFlagRows.map((row) => ({
      key: row.key,
      enabled: row.enabled,
      rollout: row.rollout,
      environments: parseFeatureFlagEnvironments(row.environments),
      tenantAllowlist: parseFeatureFlagAllowlist(row.tenantAllowlist),
      companyAllowlist: parseFeatureFlagAllowlist(row.companyAllowlist),
      killSwitchKey: row.killSwitchKey,
      metadata: row.metadata as Readonly<Record<string, unknown>>,
    })),
    killSwitches: killSwitchRows.map((row) => ({
      key: row.key,
      active: row.active,
      severity: row.severity,
      reason: row.reason,
      activatedBy: row.activatedBy,
      activatedAt: row.activatedAt?.toISOString() ?? null,
    })),
  };
}
