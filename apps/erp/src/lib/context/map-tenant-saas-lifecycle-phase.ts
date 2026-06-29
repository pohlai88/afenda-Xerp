import type { PlatformLifecycleStatus } from "@afenda/kernel";
import type { TenantSaasLifecyclePhase } from "@afenda/kernel/context";

/**
 * Maps persisted tenant `status` (platform slot lifecycle) to kernel SaaS lifecycle words.
 *
 * `provisioned` is reserved — no DB column/signal yet; active tenants map to `active`.
 * `archived` platform status maps to `offboarded` SaaS phase (tenant access blocked).
 */
export function mapPlatformLifecycleStatusToTenantSaasLifecyclePhase(
  status: PlatformLifecycleStatus
): TenantSaasLifecyclePhase {
  switch (status) {
    case "active":
      return "active";
    case "suspended":
      return "suspended";
    case "archived":
      return "offboarded";
    default: {
      const _exhaustive: never = status;
      throw new Error(
        `Unsupported platform lifecycle status for SaaS phase mapping: ${String(_exhaustive)}`
      );
    }
  }
}
