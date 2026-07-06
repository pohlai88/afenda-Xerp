import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import { assertIsoCalendarDateOrNull } from "./_internal/wire-date.assert.js";
import {
  assertWireOptionalText,
  assertWireRequiredText,
} from "./_internal/wire-text.assert.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
import {
  CONSOLIDATION_TREATMENTS,
  type ConsolidationTreatment,
  OWNERSHIP_CONTROL_TYPES,
  type OwnershipControlType,
  type OwnershipInterestWireContext,
  type PercentageNumber,
} from "./ownership-interest-context.contract.js";

type _OwnershipInterestWireSerializable =
  AssertJsonSerializable<OwnershipInterestWireContext>;

/** Compile-time guard — ownership interest wire context must remain JSON-serializable. */
export type assertOwnershipInterestContextWireSerializable =
  _OwnershipInterestWireSerializable extends true ? true : never;

export function isOwnershipControlType(
  value: string
): value is OwnershipControlType {
  return (OWNERSHIP_CONTROL_TYPES as readonly string[]).includes(value);
}

export function isConsolidationTreatment(
  value: string
): value is ConsolidationTreatment {
  return (CONSOLIDATION_TREATMENTS as readonly string[]).includes(value);
}

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertOwnershipInterestOptionalText(
  value: string | null,
  label: string
): void {
  assertWireOptionalText(value, label);
}

export function assertOwnershipInterestPercentage(
  value: number,
  label: string
): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${label} must be a number between 0 and 100.`);
  }
}

/** Brand a validated percentage for internal OwnershipInterestContext slots. */
export function brandPercentageNumber(
  value: number,
  label: string
): PercentageNumber {
  assertOwnershipInterestPercentage(value, label);
  return value as PercentageNumber;
}

export function assertOwnershipInterestEffectiveDateRange(
  effectiveFrom: string,
  effectiveTo: string | null
): void {
  assertIsoCalendarDateOrNull(effectiveFrom, "effectiveFrom");
  assertIsoCalendarDateOrNull(effectiveTo, "effectiveTo");

  if (effectiveTo !== null && effectiveTo < effectiveFrom) {
    throw new Error(
      "effectiveTo must be null or greater than or equal to effectiveFrom."
    );
  }
}

export function assertDistinctLegalEntityIds(
  parentLegalEntityId: string,
  childLegalEntityId: string
): void {
  if (parentLegalEntityId === childLegalEntityId) {
    throw new Error(
      "parentLegalEntityId and childLegalEntityId must be different."
    );
  }
}

function assertOwnershipInterestWireContext(
  value: OwnershipInterestWireContext
): void {
  assertWireRequiredText(value.ownershipInterestId, "ownershipInterestId");
  assertWireRequiredText(value.tenantId, "tenantId");
  assertWireRequiredText(value.entityGroupId, "entityGroupId");
  assertWireRequiredText(value.parentLegalEntityId, "parentLegalEntityId");
  assertWireRequiredText(value.childLegalEntityId, "childLegalEntityId");

  assertDistinctLegalEntityIds(
    value.parentLegalEntityId,
    value.childLegalEntityId
  );

  assertOwnershipInterestPercentage(
    value.ownershipPercentage,
    "ownershipPercentage"
  );
  assertOwnershipInterestPercentage(value.votingPercentage, "votingPercentage");

  if (typeof value.nonControllingInterestApplicable !== "boolean") {
    throw new Error("nonControllingInterestApplicable must be a boolean.");
  }

  assertOwnershipInterestEffectiveDateRange(
    value.effectiveFrom,
    value.effectiveTo
  );
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireOwnershipInterestContext(
  value: unknown
): asserts value is OwnershipInterestWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("OwnershipInterestWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  const requiredStringKeys = [
    "ownershipInterestId",
    "tenantId",
    "entityGroupId",
    "parentLegalEntityId",
    "childLegalEntityId",
    "effectiveFrom",
  ] as const;

  for (const key of requiredStringKeys) {
    if (typeof record[key] !== "string") {
      throw new Error(`${key} must be a string.`);
    }

    assertWireRequiredText(record[key], key);
  }

  if (typeof record["controlType"] !== "string") {
    throw new Error("controlType must be a string.");
  }
  if (typeof record["consolidationTreatment"] !== "string") {
    throw new Error("consolidationTreatment must be a string.");
  }
  if (typeof record["status"] !== "string") {
    throw new Error("status must be a string.");
  }
  if (typeof record["ownershipPercentage"] !== "number") {
    throw new Error("ownershipPercentage must be a number.");
  }
  if (typeof record["votingPercentage"] !== "number") {
    throw new Error("votingPercentage must be a number.");
  }
  if (typeof record["nonControllingInterestApplicable"] !== "boolean") {
    throw new Error("nonControllingInterestApplicable must be a boolean.");
  }
  if (
    record["effectiveTo"] !== null &&
    typeof record["effectiveTo"] !== "string"
  ) {
    throw new Error("effectiveTo must be a string or null.");
  }
  if (record["effectiveTo"] !== null) {
    assertOwnershipInterestOptionalText(record["effectiveTo"], "effectiveTo");
  }

  if (!isOwnershipControlType(record["controlType"])) {
    throw new Error(
      `controlType must be one of: ${OWNERSHIP_CONTROL_TYPES.join(", ")}.`
    );
  }

  if (!isConsolidationTreatment(record["consolidationTreatment"])) {
    throw new Error(
      `consolidationTreatment must be one of: ${CONSOLIDATION_TREATMENTS.join(", ")}.`
    );
  }

  if (!isPlatformLifecycleStatus(record["status"])) {
    throw new Error(
      `status must be one of: ${PLATFORM_LIFECYCLE_STATUSES.join(", ")}.`
    );
  }

  assertOwnershipInterestWireContext(value as OwnershipInterestWireContext);
}
