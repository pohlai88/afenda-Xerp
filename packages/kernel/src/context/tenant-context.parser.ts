import { normalizeTenantIdForWire, parseTenantId } from "../identity/index.js";
import { assertWireTenantContext } from "./tenant-context.assert.js";
import type {
  TenantContext,
  TenantWireContext,
} from "./tenant-context.contract.js";
import type { TenantSaasLifecyclePhase } from "./tenant-saas-lifecycle.contract.js";
import { isTenantSaasLifecyclePhase } from "./tenant-saas-lifecycle.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseOptionalTenantSaasLifecyclePhase(
  value: string | undefined
): TenantSaasLifecyclePhase | undefined {
  if (value === undefined) {
    return;
  }

  if (!isTenantSaasLifecyclePhase(value)) {
    throw new Error(
      "saasLifecyclePhase must be a valid tenant SaaS lifecycle phase."
    );
  }

  return value;
}

function parseValidatedTenantContext(value: TenantWireContext): TenantContext {
  const saasLifecyclePhase = parseOptionalTenantSaasLifecyclePhase(
    value.saasLifecyclePhase
  );

  return {
    tenantId: parseTenantId(value.tenantId),
    slug: value.slug,
    displayName: value.displayName,
    status: value.status,
    ...(saasLifecyclePhase === undefined ? {} : { saasLifecyclePhase }),
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
    ...(value.saasLifecyclePhase === undefined
      ? {}
      : { saasLifecyclePhase: value.saasLifecyclePhase }),
  };
}

/** Wire egress alias — same contract as `normalizeTenantContextForWire`. */
export function serializeTenantContext(
  value: TenantContext
): TenantWireContext {
  return normalizeTenantContextForWire(value);
}
