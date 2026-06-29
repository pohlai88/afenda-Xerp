import type {
  AuditNamespaceMode,
  MetadataRouteKind,
} from "../erp-module-foundation.types.js";

const MODULE_SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
const PERMISSION_NAMESPACE_PATTERN = /^[a-z][a-zA-Z0-9]*$/;
const KV_ID_PATTERN = /^KV-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const PERMISSION_KEY_PATTERN = /^[a-z][a-zA-Z0-9]*\.[a-z][a-z0-9A-Z_]*$/;
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]+)+$/;

export function assertNonEmptyString(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
}

export function assertModuleSlugFormat(value: string, field: string): void {
  assertNonEmptyString(value, field);
  if (!MODULE_SLUG_PATTERN.test(value)) {
    throw new Error(`${field} must be lowercase kebab-case — got "${value}"`);
  }
}

export function assertPermissionNamespaceFormat(
  value: string,
  field: string
): void {
  assertNonEmptyString(value, field);
  if (!PERMISSION_NAMESPACE_PATTERN.test(value)) {
    throw new Error(
      `${field} must be camelCase permission namespace — got "${value}"`
    );
  }
}

export function assertRouteSlugFormat(value: string, field: string): void {
  assertModuleSlugFormat(value, field);
}

export function assertKvIdFormat(value: string): void {
  assertNonEmptyString(value, "kvId");
  if (!KV_ID_PATTERN.test(value)) {
    throw new Error(`kvId must match KV-* pattern — got "${value}"`);
  }
}

export function assertPermissionKeyFormat(value: string): void {
  assertNonEmptyString(value, "permissionKey");
  if (!PERMISSION_KEY_PATTERN.test(value)) {
    throw new Error(
      `permissionKey must match domain.action format — got "${value}"`
    );
  }
}

export function assertEventNameFormat(value: string): void {
  assertNonEmptyString(value, "event");
  if (!EVENT_NAME_PATTERN.test(value)) {
    throw new Error(
      `event must use dotted module-scoped naming — got "${value}"`
    );
  }
}

export function assertUniqueStrings(
  values: readonly string[],
  label: string
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`duplicate ${label}: "${value}"`);
    }
    seen.add(value);
  }
}

export function assertModuleKvParity(
  module: string,
  kvId: string,
  expectedModule: string,
  expectedKvId: string,
  artifact: string
): string | null {
  if (module !== expectedModule) {
    return `${artifact}: module "${module}" !== "${expectedModule}"`;
  }
  if (kvId !== expectedKvId) {
    return `${artifact}: kvId "${kvId}" !== "${expectedKvId}"`;
  }
  return null;
}

export function assertRuntimeModuleKvCatalogParity(input: {
  slug: string;
  kvId: string;
  erpDomainModuleKvIds: Readonly<Record<string, string>>;
}): void {
  const catalogKvId = input.erpDomainModuleKvIds[input.slug];
  if (catalogKvId === undefined) {
    throw new Error(
      `slug "${input.slug}" is not present in erpDomainModuleKvIds catalog`
    );
  }
  if (catalogKvId !== input.kvId) {
    throw new Error(
      `KV catalog parity failed for "${input.slug}": declared "${input.kvId}" !== catalog "${catalogKvId}"`
    );
  }
}

export function assertAuditActionNamespace(input: {
  action: string;
  module: string;
  auditNamespaceMode: AuditNamespaceMode;
}): void {
  if (input.auditNamespaceMode === "module_prefixed") {
    const prefix = `${input.module}.`;
    if (!input.action.startsWith(prefix)) {
      throw new Error(
        `audit action must be prefixed with "${prefix}" — got "${input.action}"`
      );
    }
    return;
  }

  if (!input.action.includes(".")) {
    throw new Error(
      `pas001b_wire audit action must use dotted vocabulary — got "${input.action}"`
    );
  }
}

export function assertMetadataRoutePattern(input: {
  route: string;
  routeKind: MetadataRouteKind;
  routeSlug: string;
}): void {
  const { route, routeKind, routeSlug } = input;

  switch (routeKind) {
    case "erp_module_page": {
      const pattern = new RegExp(`^/modules/${routeSlug}(/|$)`);
      if (!pattern.test(route)) {
        throw new Error(
          `erp_module_page route must match /modules/${routeSlug}/... — got "${route}"`
        );
      }
      break;
    }
    case "internal_api": {
      const pattern = new RegExp(`^/api/internal/v1/${routeSlug}(/|$)`);
      if (!pattern.test(route)) {
        throw new Error(
          `internal_api route must match /api/internal/v1/${routeSlug}/... — got "${route}"`
        );
      }
      break;
    }
    case "server_action": {
      const pattern = new RegExp(`^server-action:${routeSlug}\\.`);
      if (!pattern.test(route)) {
        throw new Error(
          `server_action route must match server-action:${routeSlug}.* — got "${route}"`
        );
      }
      break;
    }
    case "metadata_only": {
      const pattern = new RegExp(`^#metadata:${routeSlug}\\.`);
      if (!pattern.test(route)) {
        throw new Error(
          `metadata_only route must match #metadata:${routeSlug}.* — got "${route}"`
        );
      }
      break;
    }
    default: {
      const exhaustive: never = routeKind;
      throw new Error(`unsupported routeKind: ${String(exhaustive)}`);
    }
  }
}

export function assertPermissionParityExact(input: {
  kernelPermissionKeys: readonly string[];
  registryPermissionKeys: readonly string[];
}): void {
  const kernelSet = new Set(input.kernelPermissionKeys);
  const registrySet = new Set(input.registryPermissionKeys);

  if (kernelSet.size !== registrySet.size) {
    throw new Error(
      `permission parity exact: kernel (${kernelSet.size}) !== registry (${registrySet.size})`
    );
  }

  for (const key of kernelSet) {
    if (!registrySet.has(key)) {
      throw new Error(
        `permission parity exact: kernel key "${key}" missing from registryPermissionKeys`
      );
    }
  }
}
