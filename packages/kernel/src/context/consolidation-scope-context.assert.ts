import type {
  ConsolidationEntityScopeWire,
  ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
import {
  assertOwnershipInterestPercentage,
  assertOwnershipInterestText,
  isConsolidationTreatment,
} from "./ownership-interest-context.assert.js";
import { CONSOLIDATION_TREATMENTS } from "./ownership-interest-context.contract.js";

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

type _ConsolidationScopeWireSerializable =
  AssertJsonSerializable<ConsolidationScopeWireContext>;

/** Compile-time guard — consolidation scope wire context must remain JSON-serializable. */
export type assertConsolidationScopeContextWireSerializable =
  _ConsolidationScopeWireSerializable extends true ? true : never;

const WIRE_CONSOLIDATION_SCOPE_STRING_KEYS = [
  "tenantId",
  "entityGroupId",
  "reportingDate",
] as const satisfies readonly (keyof ConsolidationScopeWireContext)[];

/** Format guard only — not calendar-validity. Promote to date primitive when needed. */
const ISO_CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertConsolidationScopeReportingDate(value: string): void {
  assertOwnershipInterestText(value, "reportingDate");

  if (!ISO_CALENDAR_DATE_PATTERN.test(value)) {
    throw new Error(
      "reportingDate must be an ISO calendar date in YYYY-MM-DD format."
    );
  }
}

function assertConsolidationEntityScopeWire(
  value: ConsolidationEntityScopeWire,
  index: number
): void {
  assertOwnershipInterestText(
    value.companyId,
    `legalEntities[${index}].companyId`
  );

  if (!isConsolidationTreatment(value.consolidationTreatment)) {
    throw new Error(
      `legalEntities[${index}].consolidationTreatment must be one of: ${CONSOLIDATION_TREATMENTS.join(", ")}.`
    );
  }

  assertOwnershipInterestPercentage(
    value.ownershipPercentage,
    `legalEntities[${index}].ownershipPercentage`
  );
}

function assertConsolidationScopeWireContext(
  value: ConsolidationScopeWireContext
): void {
  assertOwnershipInterestText(value.tenantId, "tenantId");
  assertOwnershipInterestText(value.entityGroupId, "entityGroupId");
  assertConsolidationScopeReportingDate(value.reportingDate);

  if (!Array.isArray(value.legalEntities)) {
    throw new Error("legalEntities must be an array.");
  }

  for (const [index, entry] of value.legalEntities.entries()) {
    assertConsolidationEntityScopeWire(entry, index);
  }
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireConsolidationScopeContext(
  value: unknown
): asserts value is ConsolidationScopeWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("ConsolidationScopeWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  for (const key of WIRE_CONSOLIDATION_SCOPE_STRING_KEYS) {
    if (typeof record[key] !== "string") {
      throw new Error(`${key} must be a string.`);
    }

    assertOwnershipInterestText(record[key], key);
  }

  if (!Array.isArray(record["legalEntities"])) {
    throw new Error("legalEntities must be an array.");
  }

  for (const [index, entry] of record["legalEntities"].entries()) {
    if (entry === null || typeof entry !== "object") {
      throw new Error(`legalEntities[${index}] must be an object.`);
    }

    const entity = entry as Record<string, unknown>;
    const companyIdLabel = `legalEntities[${index}].companyId`;
    const treatmentLabel = `legalEntities[${index}].consolidationTreatment`;
    const percentageLabel = `legalEntities[${index}].ownershipPercentage`;

    if (typeof entity["companyId"] !== "string") {
      throw new Error(`${companyIdLabel} must be a string.`);
    }

    assertOwnershipInterestText(entity["companyId"], companyIdLabel);

    if (typeof entity["consolidationTreatment"] !== "string") {
      throw new Error(`${treatmentLabel} must be a string.`);
    }

    if (!isConsolidationTreatment(entity["consolidationTreatment"])) {
      throw new Error(
        `${treatmentLabel} must be one of: ${CONSOLIDATION_TREATMENTS.join(", ")}.`
      );
    }

    if (typeof entity["ownershipPercentage"] !== "number") {
      throw new Error(`${percentageLabel} must be a number.`);
    }
  }

  assertConsolidationScopeWireContext(value as ConsolidationScopeWireContext);
}
