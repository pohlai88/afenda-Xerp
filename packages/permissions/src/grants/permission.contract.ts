/**
 * Governed permission registry (TIP-005).
 *
 * Shape validation comes from `@afenda/database` (`{domain}.{action}`).
 * Registry membership is enforced via `assertRegisteredPermissionKey`.
 */
import {
  assertPermissionKey,
  createPermissionKey,
  InvalidPermissionKeyError,
  isPermissionKey,
  type PermissionKey,
} from "@afenda/database";

function definePermissionKey(domain: string, action: string): PermissionKey {
  return createPermissionKey(domain, action);
}

/** Governed permission registry — modules must reference keys from here. */
export const PERMISSION_REGISTRY = {
  systemAdmin: {
    users: {
      read: definePermissionKey("system_admin", "users_read"),
      manage: definePermissionKey("system_admin", "users_manage"),
    },
    roles: {
      manage: definePermissionKey("system_admin", "roles_manage"),
    },
    permissions: {
      manage: definePermissionKey("system_admin", "permissions_manage"),
    },
    modules: {
      manage: definePermissionKey("system_admin", "modules_manage"),
    },
    audit: {
      read: definePermissionKey("system_admin", "audit_read"),
    },
  },
  accounting: {
    journal: {
      read: definePermissionKey("accounting", "journal_read"),
      post: definePermissionKey("accounting", "journal_post"),
    },
  },
  inventory: {
    stock: {
      adjust: definePermissionKey("inventory", "stock_adjust"),
    },
  },
  hr: {
    employee: {
      read: definePermissionKey("hr", "employee_read"),
    },
  },
  workspace: {
    dashboard: {
      read: definePermissionKey("workspace", "dashboard_read"),
      write: definePermissionKey("workspace", "dashboard_write"),
    },
  },
  finance: {
    invoices: {
      read: definePermissionKey("finance", "invoices_read"),
    },
    cards: {
      read: definePermissionKey("finance", "cards_read"),
    },
    transactions: {
      read: definePermissionKey("finance", "transactions_read"),
    },
  },
  dashboard: {
    moduleEarnings: definePermissionKey("dashboard", "module_earnings"),
    regionalSales: definePermissionKey("dashboard", "regional_sales"),
  },
} as const;

type RegistryLeafValues<T> = T extends PermissionKey
  ? T
  : T extends Record<string, infer U>
    ? RegistryLeafValues<U>
    : never;

/** Union of all registered permission keys. */
export type RegisteredPermissionKey = RegistryLeafValues<
  typeof PERMISSION_REGISTRY
>;

function collectRegisteredKeys(
  value: unknown,
  keys = new Set<string>()
): Set<string> {
  if (typeof value === "string") {
    keys.add(value);
    return keys;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      collectRegisteredKeys(nested, keys);
    }
  }

  return keys;
}

const REGISTERED_PERMISSION_KEYS = collectRegisteredKeys(PERMISSION_REGISTRY);

export function isRegisteredPermissionKey(
  value: string
): value is RegisteredPermissionKey {
  return isPermissionKey(value) && REGISTERED_PERMISSION_KEYS.has(value);
}

export function assertRegisteredPermissionKey(
  value: string
): RegisteredPermissionKey {
  const key = assertPermissionKey(value);

  if (!isRegisteredPermissionKey(key)) {
    throw new InvalidPermissionKeyError(
      `Unregistered permission key "${value}". Register it in PERMISSION_REGISTRY.`
    );
  }

  return key;
}

/**
 * Validates a permission key at API boundaries (`requirePermission`, etc.).
 * Shape is enforced by `@afenda/database`; registry membership by TIP-005.
 */
export function resolveBoundaryPermissionKey(
  permissionKey: PermissionKey | string
): RegisteredPermissionKey {
  return assertRegisteredPermissionKey(permissionKey);
}

export type PermissionAction = string;
export type PermissionTargetType = string;

function splitPermissionKey(permissionKey: PermissionKey): [string, string] {
  const segments = permissionKey.split(".");

  if (segments.length !== 2) {
    throw new InvalidPermissionKeyError(
      `Permission key "${permissionKey}" must contain exactly one dot.`
    );
  }

  const domain = segments[0];
  const action = segments[1];

  if (!(domain && action)) {
    throw new InvalidPermissionKeyError(
      `Permission key "${permissionKey}" must contain non-empty domain and action segments.`
    );
  }

  return [domain, action];
}

/** Parses the action segment from a `{domain}.{action}` permission key. */
export function extractPermissionAction(permissionKey: PermissionKey): string {
  const [, action] = splitPermissionKey(permissionKey);
  return action;
}

/** Parses the domain segment from a `{domain}.{action}` permission key. */
export function extractPermissionDomain(permissionKey: PermissionKey): string {
  const [domain] = splitPermissionKey(permissionKey);
  return domain;
}
