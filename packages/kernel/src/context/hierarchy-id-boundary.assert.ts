import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import type { ConsolidationScopeWireContext } from "./consolidation-scope-context.contract.js";
import type { EntityGroupWireContext } from "./entity-group-context.contract.js";
import type { OwnershipInterestWireContext } from "./ownership-interest-context.contract.js";

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
