import type { ConsolidationScopeContext } from "./consolidation-scope-context.contract.js";
import type { EntityGroupContext } from "./entity-group-context.contract.js";
import type { LegalEntityContext } from "./legal-entity-context.contract.js";
import type { OrganizationUnitContext } from "./organization-unit-context.contract.js";
import type { OwnershipInterestContext } from "./ownership-interest-context.contract.js";

/**
 * Serializable accounting-readiness slice — authority fields only.
 * No journals, ledgers, eliminations, or reporting arithmetic.
 *
 * Projection helpers live in apps/erp (`accounting-readiness.projection.ts`).
 */
export interface AccountingReadinessContext {
  readonly baseCurrency: string;
  readonly consolidationScope: ConsolidationScopeContext | null;
  readonly entityGroup: EntityGroupContext | null;
  readonly legalEntity: LegalEntityContext;
  readonly organizationUnit: OrganizationUnitContext | null;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly reportingCurrency: string;
}

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type AccountingReadinessWireContext = AccountingReadinessContext;

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

type _AccountingReadinessWireSerializable =
  AssertJsonSerializable<AccountingReadinessWireContext>;

/**
 * Compile-time guard — accounting readiness wire context must remain JSON-serializable.
 * No runtime overhead.
 */
export type assertAccountingReadinessContextJsonSerializable =
  _AccountingReadinessWireSerializable extends true ? true : never;
