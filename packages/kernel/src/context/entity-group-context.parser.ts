import {
  normalizeCompanyIdForWire,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseEntityGroupId,
  parseOptionalCompanyId,
  parseTenantId,
} from "../identity/index.js";
import { assertWireEntityGroupContext } from "./entity-group-context.assert.js";
import type {
  EntityGroupContext,
  EntityGroupWireContext,
} from "./entity-group-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseValidatedEntityGroupContext(
  value: EntityGroupWireContext
): EntityGroupContext {
  return {
    entityGroupId: parseEntityGroupId(value.entityGroupId),
    tenantId: parseTenantId(value.tenantId),
    slug: value.slug,
    displayName: value.displayName,
    parentLegalEntityId: parseOptionalCompanyId(value.parentLegalEntityId),
    status: value.status,
  };
}

export function parseEntityGroupContext(
  value: EntityGroupWireContext
): EntityGroupContext {
  assertWireEntityGroupContext(value);
  return parseValidatedEntityGroupContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownEntityGroupContext(
  value: unknown
): EntityGroupContext {
  assertWireEntityGroupContext(value);
  return parseValidatedEntityGroupContext(value);
}

export function normalizeEntityGroupContextForWire(
  value: EntityGroupContext
): EntityGroupWireContext {
  return {
    entityGroupId: requiredWireString(
      normalizeEntityGroupIdForWire(value.entityGroupId),
      "entityGroupId"
    ),
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    slug: value.slug,
    displayName: value.displayName,
    parentLegalEntityId: normalizeCompanyIdForWire(value.parentLegalEntityId),
    status: value.status,
  };
}

/** Wire egress alias — same contract as `normalizeEntityGroupContextForWire`. */
export function serializeEntityGroupContext(
  value: EntityGroupContext
): EntityGroupWireContext {
  return normalizeEntityGroupContextForWire(value);
}
