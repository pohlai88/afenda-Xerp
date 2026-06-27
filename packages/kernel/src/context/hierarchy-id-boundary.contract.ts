/**
 * Hierarchy context id branding and wire-format guards (TIP-008A Slice 6).
 *
 * Wire context interfaces keep plain string ids for JSON serialization.
 * Parse ids at explicit trust boundaries via `parse*` helpers.
 */
import {
  type CompanyId,
  type EntityGroupId,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  type OwnershipInterestId,
  parseOptionalCompanyId,
  parseOptionalEntityGroupId,
  parseOptionalOwnershipInterestId,
  parseOptionalTenantId,
  type TenantId,
  toCompanyId,
  toEntityGroupId,
  toOwnershipInterestId,
  toTenantId,
} from "../identity/index.js";
import type { ConsolidationScopeContext } from "./consolidation-scope-context.contract.js";
import type { EntityGroupContext } from "./entity-group-context.contract.js";
import type { OwnershipInterestContext } from "./ownership-interest-context.contract.js";

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type OwnershipInterestWireContext = OwnershipInterestContext;

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type ConsolidationScopeWireContext = ConsolidationScopeContext;

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type EntityGroupWireContext = EntityGroupContext;

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

export interface BrandedOwnershipInterestContext
  extends Omit<
    OwnershipInterestContext,
    | "tenantId"
    | "entityGroupId"
    | "ownershipInterestId"
    | "parentLegalEntityId"
    | "childLegalEntityId"
  > {
  readonly childLegalEntityId: CompanyId;
  readonly entityGroupId: EntityGroupId;
  readonly ownershipInterestId: OwnershipInterestId;
  readonly parentLegalEntityId: CompanyId;
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

export function brandOwnershipInterestContext(
  wire: OwnershipInterestWireContext
): BrandedOwnershipInterestContext {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const entityGroupId = parseOptionalEntityGroupId(wire.entityGroupId);
  const ownershipInterestId = parseOptionalOwnershipInterestId(
    wire.ownershipInterestId
  );
  const parentLegalEntityId = parseOptionalCompanyId(wire.parentLegalEntityId);
  const childLegalEntityId = parseOptionalCompanyId(wire.childLegalEntityId);

  if (
    tenantId === null ||
    entityGroupId === null ||
    ownershipInterestId === null ||
    parentLegalEntityId === null ||
    childLegalEntityId === null
  ) {
    throw new Error("Ownership interest context ids are required.");
  }

  return {
    ...wire,
    tenantId,
    entityGroupId,
    ownershipInterestId,
    parentLegalEntityId,
    childLegalEntityId,
  };
}

export function toOwnershipInterestWireContext(
  branded: BrandedOwnershipInterestContext
): OwnershipInterestWireContext {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    entityGroupId: toEntityGroupId(branded.entityGroupId),
    ownershipInterestId: toOwnershipInterestId(branded.ownershipInterestId),
    parentLegalEntityId: toCompanyId(branded.parentLegalEntityId),
    childLegalEntityId: toCompanyId(branded.childLegalEntityId),
  };
}
