import type { RegisteredPermissionKey } from "@afenda/permissions";
import { assertRegisteredPermissionKey } from "@afenda/permissions";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import type { ApiRouteContract } from "@/server/api/contracts/api-contract";

import type { ApiRouteProtectionLevel } from "./api-route-context";

export interface ApiRoutePermissionRequirement {
  readonly action?: string;
  readonly permissionKey: RegisteredPermissionKey;
  readonly targetType?: string;
}

export function resolveRouteProtectionLevel(
  contract: ApiRouteContract<unknown, unknown>
): ApiRouteProtectionLevel {
  if (contract.tags.includes("public")) {
    return "public";
  }

  if (contract.tags.includes("platform-admin")) {
    return "platform-admin";
  }

  if (contract.tags.includes("internal")) {
    return "internal-system";
  }

  if (contract.permission !== undefined) {
    return "tenant-protected";
  }

  return "authenticated";
}

export function resolveRoutePermissionRequirement(
  permission: string
): ApiRoutePermissionRequirement {
  return {
    permissionKey: assertRegisteredPermissionKey(permission),
  };
}

export interface RoutePermissionMatrixEntry {
  readonly level: ApiRouteProtectionLevel;
  readonly permissionKey: RegisteredPermissionKey;
}

/** Derived from the governed contract registry — single source of truth. */
export function buildRoutePermissionMatrix(): Record<
  string,
  RoutePermissionMatrixEntry
> {
  const matrix: Record<string, RoutePermissionMatrixEntry> = {};

  for (const contract of API_CONTRACTS) {
    if (!("permission" in contract) || contract.permission === undefined) {
      continue;
    }

    matrix[contract.id] = {
      level: resolveRouteProtectionLevel(contract),
      permissionKey: assertRegisteredPermissionKey(
        contract.permission.permission
      ),
    };
  }

  return matrix;
}
