import type { ConsolidationScopeWireContext } from "./consolidation-scope-context.contract.js";
import type { EntityGroupWireContext } from "./entity-group-context.contract.js";
import type { OwnershipInterestWireContext } from "./ownership-interest-context.contract.js";

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
