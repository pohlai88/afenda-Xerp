import { normalizeTenantIdForWire, parseTenantId } from "../identity/index.js";
import { assertWireTenantContext } from "./tenant-context.assert.js";
import type {
  TenantContext,
  TenantWireContext,
} from "./tenant-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseValidatedTenantContext(value: TenantWireContext): TenantContext {
  return {
    tenantId: parseTenantId(value.tenantId),
    slug: value.slug,
    displayName: value.displayName,
    status: value.status,
  };
}

export function parseTenantContext(value: TenantWireContext): TenantContext {
  assertWireTenantContext(value);
  return parseValidatedTenantContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownTenantContext(value: unknown): TenantContext {
  assertWireTenantContext(value);
  return parseValidatedTenantContext(value);
}

export function normalizeTenantContextForWire(
  value: TenantContext
): TenantWireContext {
  return {
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    slug: value.slug,
    displayName: value.displayName,
    status: value.status,
  };
}

/** Wire egress alias — same contract as `normalizeTenantContextForWire`. */
export function serializeTenantContext(
  value: TenantContext
): TenantWireContext {
  return normalizeTenantContextForWire(value);
}
