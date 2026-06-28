import {
  type EntityGroupId,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseOptionalEntityGroupId,
  parseOptionalTenantId,
  type TenantId,
} from "../identity/index.js";
import type {
  DeriveConsolidationScopeTrustInput,
  DeriveConsolidationScopeWireInput,
} from "./hierarchy-id-boundary.contract.js";
import type {
  BrandedOwnershipInterestContext,
  OwnershipInterestContext,
  OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";
import {
  normalizeOwnershipInterestContextForWire,
  parseOwnershipInterestContext,
} from "./ownership-interest-context.parser.js";

export {
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
} from "../identity/index.js";

export function brandDeriveConsolidationScopeTrustInput(
  input: DeriveConsolidationScopeWireInput
): DeriveConsolidationScopeTrustInput {
  const tenantId = parseOptionalTenantId(
    normalizeTenantIdForWire(input.tenantId)
  );
  const entityGroupId = parseOptionalEntityGroupId(
    normalizeEntityGroupIdForWire(input.entityGroupId)
  );

  if (tenantId === null) {
    throw new Error("tenantId is required.");
  }

  if (entityGroupId === null) {
    throw new Error("entityGroupId is required.");
  }

  return {
    tenantId,
    entityGroupId,
    reportingDate: input.reportingDate,
    ownershipInterests: input.ownershipInterests,
  };
}

/** @deprecated Prefer `parseOwnershipInterestContext` — retained for Foundation phase 08 callers. */
export function brandOwnershipInterestContext(
  wire: OwnershipInterestWireContext
): BrandedOwnershipInterestContext {
  return parseOwnershipInterestContext(wire);
}

/** @deprecated Prefer `normalizeOwnershipInterestContextForWire` — retained for Foundation phase 08 callers. */
export function toOwnershipInterestWireContext(
  branded: BrandedOwnershipInterestContext
): OwnershipInterestWireContext {
  return normalizeOwnershipInterestContextForWire(branded);
}

export type {
  DeriveConsolidationScopeTrustInput,
  DeriveConsolidationScopeWireInput,
} from "./hierarchy-id-boundary.contract.js";

export type { EntityGroupId, OwnershipInterestContext, TenantId };
