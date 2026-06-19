import type { PolicyEffect, PolicyScope } from "../database.types.js";
import { createPermissionKey } from "../permission-key.contract.js";
import type { PolicyCondition } from "../policy/policy.validation.js";

export interface PlatformPolicyCatalogEntry {
  readonly condition: PolicyCondition;
  readonly description: string | null;
  readonly effect: PolicyEffect;
  readonly key: string;
  readonly name: string;
  readonly priority: number;
  readonly scope: PolicyScope;
  readonly tenantId: string | null;
}

/** Default platform policy templates — decision gates, not grants. */
export const PLATFORM_POLICY_CATALOG = [
  {
    key: "gate.accounting.journal_post",
    name: "Journal post approval gate",
    description:
      "Requires approval workflow before posting accounting journals.",
    scope: "platform",
    tenantId: null,
    effect: "allow",
    priority: 50,
    condition: {
      version: 1,
      gateDecision: "require_approval",
      match: {
        permissionKey: createPermissionKey("accounting", "journal_post"),
      },
    },
  },
  {
    key: "gate.inventory.stock_adjust",
    name: "Stock adjustment evidence gate",
    description: "Requires evidence before inventory stock adjustments.",
    scope: "platform",
    tenantId: null,
    effect: "allow",
    priority: 60,
    condition: {
      version: 1,
      gateDecision: "require_evidence",
      match: {
        permissionKey: createPermissionKey("inventory", "stock_adjust"),
      },
    },
  },
] as const satisfies readonly PlatformPolicyCatalogEntry[];
