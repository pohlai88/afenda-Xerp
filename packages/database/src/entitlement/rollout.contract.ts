/**
 * Platform rollout store contracts — feature flags and kill switches (no I/O).
 */
import type {
  FeatureFlagRollout,
  KillSwitchSeverity,
} from "../database.types.js";

export interface FeatureFlagRecord {
  readonly companyAllowlist: readonly string[];
  readonly enabled: boolean;
  readonly environments: readonly string[];
  readonly key: string;
  readonly killSwitchKey: string | null;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly rollout: FeatureFlagRollout;
  readonly tenantAllowlist: readonly string[];
}

export interface KillSwitchRecord {
  readonly activatedAt: string | null;
  readonly activatedBy: string | null;
  readonly active: boolean;
  readonly key: string;
  readonly reason: string;
  readonly severity: KillSwitchSeverity;
}

export interface PlatformRolloutBundle {
  readonly featureFlags: readonly FeatureFlagRecord[];
  readonly killSwitches: readonly KillSwitchRecord[];
  readonly loadedAt: string;
}

export interface PlatformFeatureFlagCatalogEntry {
  readonly companyAllowlist: readonly string[];
  readonly enabled: boolean;
  readonly environments: readonly string[];
  readonly key: string;
  readonly killSwitchKey: string | null;
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
  readonly rollout: FeatureFlagRollout;
  readonly tenantAllowlist: readonly string[];
}

export interface PlatformKillSwitchCatalogEntry {
  readonly active: boolean;
  readonly key: string;
  readonly reason: string;
  readonly severity: KillSwitchSeverity;
}

function isStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

export function parseFeatureFlagEnvironments(
  value: unknown
): readonly string[] {
  if (!isStringArray(value)) {
    return [];
  }

  return value;
}

export function parseFeatureFlagAllowlist(value: unknown): readonly string[] {
  if (!isStringArray(value)) {
    return [];
  }

  return value;
}
