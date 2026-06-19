/**
 * Platform rollout sync — upserts catalog flags and kill switches into Postgres.
 */
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import {
  platformFeatureFlags,
  platformKillSwitches,
} from "../schema/rollout.schema.js";
import {
  PLATFORM_FEATURE_FLAG_CATALOG,
  PLATFORM_KILL_SWITCH_CATALOG,
} from "../seeds/platform-rollout.catalog.js";

export interface SyncPlatformRolloutResult {
  readonly featureFlagCount: number;
  readonly killSwitchCount: number;
}

/** Idempotently syncs the platform rollout catalog into Postgres. */
export async function syncPlatformRolloutCatalog(
  db: AfendaDatabase = getDb()
): Promise<SyncPlatformRolloutResult> {
  await db.transaction(async (tx) => {
    for (const flag of PLATFORM_FEATURE_FLAG_CATALOG) {
      await tx
        .insert(platformFeatureFlags)
        .values({
          key: flag.key,
          enabled: flag.enabled,
          rollout: flag.rollout,
          environments: [...flag.environments],
          tenantAllowlist: [...flag.tenantAllowlist],
          companyAllowlist: [...flag.companyAllowlist],
          killSwitchKey: flag.killSwitchKey,
          metadata: flag.metadata,
        })
        .onConflictDoUpdate({
          target: platformFeatureFlags.key,
          set: {
            enabled: flag.enabled,
            rollout: flag.rollout,
            environments: [...flag.environments],
            tenantAllowlist: [...flag.tenantAllowlist],
            companyAllowlist: [...flag.companyAllowlist],
            killSwitchKey: flag.killSwitchKey,
            metadata: flag.metadata,
            updatedAt: new Date(),
          },
        });
    }

    for (const killSwitch of PLATFORM_KILL_SWITCH_CATALOG) {
      await tx
        .insert(platformKillSwitches)
        .values({
          key: killSwitch.key,
          active: killSwitch.active,
          severity: killSwitch.severity,
          reason: killSwitch.reason,
          activatedBy: null,
          activatedAt: null,
        })
        .onConflictDoUpdate({
          target: platformKillSwitches.key,
          set: {
            severity: killSwitch.severity,
            updatedAt: new Date(),
          },
        });
    }
  });

  return {
    featureFlagCount: PLATFORM_FEATURE_FLAG_CATALOG.length,
    killSwitchCount: PLATFORM_KILL_SWITCH_CATALOG.length,
  };
}
