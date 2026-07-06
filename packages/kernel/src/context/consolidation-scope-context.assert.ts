import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import { assertWireIsoCalendarDate } from "./_internal/wire-date.assert.js";
import { assertWireRequiredText } from "./_internal/wire-text.assert.js";
import type {
  ConsolidationEntityScopeWire,
  ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
import {
  assertOwnershipInterestPercentage,
  isConsolidationTreatment,
} from "./ownership-interest-context.assert.js";
import { CONSOLIDATION_TREATMENTS } from "./ownership-interest-context.contract.js";

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

function assertConsolidationScopeReportingDate(value: string): void {
  assertWireIsoCalendarDate(value, "reportingDate");
}

function assertConsolidationEntityScopeWire(
  value: ConsolidationEntityScopeWire,
  index: number
): void {
  assertWireRequiredText(value.companyId, `legalEntities[${index}].companyId`);

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
  assertWireRequiredText(value.tenantId, "tenantId");
  assertWireRequiredText(value.entityGroupId, "entityGroupId");
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

    assertWireRequiredText(record[key], key);
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

    assertWireRequiredText(entity["companyId"], companyIdLabel);

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
