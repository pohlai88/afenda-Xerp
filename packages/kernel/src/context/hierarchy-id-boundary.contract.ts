/**
 * Hierarchy context id branding and wire-format guards (TIP-008A Slice 6).
 *
 * Wire context interfaces keep plain string ids for JSON serialization.
 * Brand ids only at explicit trust boundaries via `brand*` helpers.
 */
import {
  brandCompanyId,
  brandEntityGroupId,
  brandOwnershipInterestId,
  brandTenantId,
  type CompanyId,
  type EntityGroupId,
  type OwnershipInterestId,
  type TenantId,
  toCompanyId,
  toEntityGroupId,
  toOwnershipInterestId,
  toTenantId,
} from "../contracts/platform-id.contract.js";
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

export function normalizeTenantIdForWire(value: string | TenantId): string {
  return typeof value === "string" ? value : toTenantId(value);
}

export function normalizeEntityGroupIdForWire(
  value: string | EntityGroupId
): string {
  return typeof value === "string" ? value : toEntityGroupId(value);
}

export function brandDeriveConsolidationScopeTrustInput(
  input: DeriveConsolidationScopeWireInput
): DeriveConsolidationScopeTrustInput {
  const tenantId = brandTenantId(normalizeTenantIdForWire(input.tenantId));
  const entityGroupId = brandEntityGroupId(
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
  const tenantId = brandTenantId(wire.tenantId);
  const entityGroupId = brandEntityGroupId(wire.entityGroupId);
  const ownershipInterestId = brandOwnershipInterestId(
    wire.ownershipInterestId
  );
  const parentLegalEntityId = brandCompanyId(wire.parentLegalEntityId);
  const childLegalEntityId = brandCompanyId(wire.childLegalEntityId);

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
