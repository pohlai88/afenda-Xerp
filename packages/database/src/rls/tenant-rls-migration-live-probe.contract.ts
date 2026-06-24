import { MIGRATION_GOVERNANCE_RULES } from "../migrations/migration-governance.contract.js";
import {
  TENANT_RLS_MIGRATION_POLICY_GROUPS,
  type TenantRlsPolicyRow,
} from "./tenant-rls-coverage.contract.js";

export interface TenantRlsMigrationLiveProbe {
  readonly migrationTag: string;
  readonly sentinelPolicy: TenantRlsPolicyRow;
  readonly text: string;
}

/** Live Postgres probes aligned to migration-governance `completeProbe` SQL. */
export function buildTenantRlsMigrationLiveProbes(): TenantRlsMigrationLiveProbe[] {
  const probes: TenantRlsMigrationLiveProbe[] = [];

  for (const { migrationTag, policies } of TENANT_RLS_MIGRATION_POLICY_GROUPS) {
    const governance = MIGRATION_GOVERNANCE_RULES[migrationTag];
    const completeProbe = governance?.completeProbe?.trim();

    if (!completeProbe) {
      continue;
    }

    const sentinelPolicy = policies.at(-1);
    if (!sentinelPolicy) {
      continue;
    }

    probes.push({
      migrationTag,
      sentinelPolicy,
      text: completeProbe,
    });
  }

  return probes;
}

export const TENANT_RLS_MIGRATION_LIVE_PROBES =
  buildTenantRlsMigrationLiveProbes();
