/**
 * Hierarchy context id branding and wire-format guards (Foundation phase 08 Slice 6).
 *
 * Wire context interfaces keep plain string ids for JSON serialization.
 * Parse ids at explicit trust boundaries via `parse*` helpers.
 */
import {
  type EntityGroupId,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseOptionalEntityGroupId,
  parseOptionalTenantId,
  type TenantId,
} from "../identity/index.js";
import type { ConsolidationScopeWireContext } from "./consolidation-scope-context.contract.js";
import type { EntityGroupWireContext } from "./entity-group-context.contract.js";
import type {
  BrandedOwnershipInterestContext,
  OwnershipInterestContext,
  OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";
import {
  normalizeOwnershipInterestContextForWire,
  parseOwnershipInterestContext,
} from "./ownership-interest-context.parser.js";

export type { ConsolidationScopeWireContext } from "./consolidation-scope-context.contract.js";
export type { EntityGroupWireContext } from "./entity-group-context.contract.js";
export type {
  BrandedOwnershipInterestContext,
  OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _OwnershipInterestWireSerializable =
  AssertJsonSerializable<OwnershipInterestWireContext>;
type _ConsolidationScopeWireSerializable =
  AssertJsonSerializable<ConsolidationScopeWireContext>;
type _EntityGroupWireSerializable =
  AssertJsonSerializable<EntityGroupWireContext>;

/**
 * Compile-time guard — hierarchy wire contexts must remain JSON-serializable.
 * No runtime overhead.
 */
export type assertHierarchyContextJsonSerializable =
  _OwnershipInterestWireSerializable extends true
    ? _ConsolidationScopeWireSerializable extends true
      ? _EntityGroupWireSerializable extends true
        ? true
        : never
      : never
    : never;

export interface DeriveConsolidationScopeWireInput {
  readonly entityGroupId: string | EntityGroupId;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly reportingDate: string;
  readonly tenantId: string | TenantId;
}

export interface DeriveConsolidationScopeTrustInput {
  readonly entityGroupId: EntityGroupId;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly reportingDate: string;
  readonly tenantId: TenantId;
}

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
