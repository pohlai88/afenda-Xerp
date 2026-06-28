/**
 * Hierarchy context id branding and wire-format guards (Foundation phase 08 Slice 6).
 *
 * Wire context interfaces keep plain string ids for JSON serialization.
 * Parse ids at explicit trust boundaries via `parse*` helpers in `*.parser.ts`.
 */
import type { EntityGroupId, TenantId } from "../identity/index.js";
import type { OwnershipInterestContext } from "./ownership-interest-context.contract.js";

export type { ConsolidationScopeWireContext } from "./consolidation-scope-context.contract.js";
export type { EntityGroupWireContext } from "./entity-group-context.contract.js";
export type { assertHierarchyContextJsonSerializable } from "./hierarchy-id-boundary.assert.js";
export type {
  BrandedOwnershipInterestContext,
  OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";

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
