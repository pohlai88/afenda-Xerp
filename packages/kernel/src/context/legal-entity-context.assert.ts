import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import { assertIsoCalendarDateOrNull } from "./_internal/wire-date.assert.js";
import {
  assertWireOptionalText,
  assertWireRequiredText,
} from "./_internal/wire-text.assert.js";
import {
  LEGAL_ENTITY_COMPANY_TYPES,
  type LegalEntityCompanyType,
  type LegalEntityWireContext,
  RELATIONSHIP_TO_HOLDING_COMPANY_TYPES,
  type RelationshipToHoldingCompanyType,
} from "./legal-entity-context.contract.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";

type _LegalEntityWireSerializable =
  AssertJsonSerializable<LegalEntityWireContext>;

/** Compile-time guard — legal entity wire context must remain JSON-serializable. */
export type assertLegalEntityContextWireSerializable =
  _LegalEntityWireSerializable extends true ? true : never;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isLegalEntityCompanyType(
  value: string
): value is LegalEntityCompanyType {
  return (LEGAL_ENTITY_COMPANY_TYPES as readonly string[]).includes(value);
}

export function isRelationshipToHoldingCompanyType(
  value: string
): value is RelationshipToHoldingCompanyType {
  return (RELATIONSHIP_TO_HOLDING_COMPANY_TYPES as readonly string[]).includes(
    value
  );
}

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertLegalEntityText(value: string, label: string): void {
  assertWireRequiredText(value, label);
}

export function assertLegalEntityOptionalText(
  value: string | null,
  label: string
): void {
  assertWireOptionalText(value, label);
}

export function assertLegalEntitySlug(value: string): void {
  if (!value.trim()) {
    throw new Error("slug is required.");
  }

  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      "slug must use lowercase letters, numbers, and single hyphen separators."
    );
  }
}

export function assertLegalEntityEffectiveDateRange(
  effectiveFrom: string | null,
  effectiveTo: string | null
): void {
  assertIsoCalendarDateOrNull(effectiveFrom, "effectiveFrom");
  assertIsoCalendarDateOrNull(effectiveTo, "effectiveTo");

  if (
    effectiveFrom !== null &&
    effectiveTo !== null &&
    effectiveTo < effectiveFrom
  ) {
    throw new Error(
      "effectiveTo must be null or greater than or equal to effectiveFrom."
    );
  }
}

export function assertLegalEntityCompanyRelationship(
  companyType: LegalEntityCompanyType,
  relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null,
  entityGroupId: string | null
): void {
  if (companyType === "group_company") {
    if (entityGroupId === null) {
      throw new Error(
        "entityGroupId is required when companyType is group_company."
      );
    }

    if (relationshipToHoldingCompany === null) {
      throw new Error(
        "relationshipToHoldingCompany is required when companyType is group_company."
      );
    }

    return;
  }

  if (relationshipToHoldingCompany !== null) {
    throw new Error(
      "relationshipToHoldingCompany is only allowed when companyType is group_company."
    );
  }
}

function assertLegalEntityWireContext(value: LegalEntityWireContext): void {
  assertLegalEntityText(value.tenantId, "tenantId");
  assertLegalEntityOptionalText(value.entityGroupId, "entityGroupId");
  assertLegalEntityText(value.companyId, "companyId");

  assertLegalEntityText(value.legalName, "legalName");
  assertLegalEntityText(value.displayName, "displayName");
  assertLegalEntitySlug(value.slug);

  assertLegalEntityCompanyRelationship(
    value.companyType,
    value.relationshipToHoldingCompany,
    value.entityGroupId
  );

  assertLegalEntityText(value.countryCode, "countryCode");
  assertLegalEntityText(value.baseCurrency, "baseCurrency");
  assertLegalEntityOptionalText(value.reportingCurrency, "reportingCurrency");

  assertLegalEntityOptionalText(value.fiscalCalendarId, "fiscalCalendarId");
  assertLegalEntityOptionalText(value.registrationNumber, "registrationNumber");
  assertLegalEntityOptionalText(
    value.taxRegistrationNumber,
    "taxRegistrationNumber"
  );

  assertLegalEntityEffectiveDateRange(value.effectiveFrom, value.effectiveTo);
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireLegalEntityContext(
  value: unknown
): asserts value is LegalEntityWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("LegalEntityWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["tenantId"] !== "string") {
    throw new Error("tenantId must be a string.");
  }
  if (
    record["entityGroupId"] !== null &&
    typeof record["entityGroupId"] !== "string"
  ) {
    throw new Error("entityGroupId must be a string or null.");
  }
  if (typeof record["companyId"] !== "string") {
    throw new Error("companyId must be a string.");
  }
  if (typeof record["legalName"] !== "string") {
    throw new Error("legalName must be a string.");
  }
  if (typeof record["displayName"] !== "string") {
    throw new Error("displayName must be a string.");
  }
  if (typeof record["slug"] !== "string") {
    throw new Error("slug must be a string.");
  }
  if (typeof record["companyType"] !== "string") {
    throw new Error("companyType must be a string.");
  }
  if (
    record["relationshipToHoldingCompany"] !== null &&
    typeof record["relationshipToHoldingCompany"] !== "string"
  ) {
    throw new Error("relationshipToHoldingCompany must be a string or null.");
  }
  if (typeof record["countryCode"] !== "string") {
    throw new Error("countryCode must be a string.");
  }
  if (typeof record["baseCurrency"] !== "string") {
    throw new Error("baseCurrency must be a string.");
  }
  if (
    record["reportingCurrency"] !== null &&
    typeof record["reportingCurrency"] !== "string"
  ) {
    throw new Error("reportingCurrency must be a string or null.");
  }
  if (
    record["fiscalCalendarId"] !== null &&
    typeof record["fiscalCalendarId"] !== "string"
  ) {
    throw new Error("fiscalCalendarId must be a string or null.");
  }
  if (
    record["registrationNumber"] !== null &&
    typeof record["registrationNumber"] !== "string"
  ) {
    throw new Error("registrationNumber must be a string or null.");
  }
  if (
    record["taxRegistrationNumber"] !== null &&
    typeof record["taxRegistrationNumber"] !== "string"
  ) {
    throw new Error("taxRegistrationNumber must be a string or null.");
  }
  if (
    record["effectiveFrom"] !== null &&
    typeof record["effectiveFrom"] !== "string"
  ) {
    throw new Error("effectiveFrom must be a string or null.");
  }
  if (
    record["effectiveTo"] !== null &&
    typeof record["effectiveTo"] !== "string"
  ) {
    throw new Error("effectiveTo must be a string or null.");
  }
  if (typeof record["status"] !== "string") {
    throw new Error("status must be a string.");
  }

  if (!isLegalEntityCompanyType(record["companyType"])) {
    throw new Error(
      `companyType must be one of: ${LEGAL_ENTITY_COMPANY_TYPES.join(", ")}.`
    );
  }

  const relationship = record["relationshipToHoldingCompany"];

  if (
    relationship !== null &&
    !isRelationshipToHoldingCompanyType(relationship)
  ) {
    throw new Error(
      `relationshipToHoldingCompany must be null or one of: ${RELATIONSHIP_TO_HOLDING_COMPANY_TYPES.join(", ")}.`
    );
  }

  if (!isPlatformLifecycleStatus(record["status"])) {
    throw new Error(
      `status must be one of: ${PLATFORM_LIFECYCLE_STATUSES.join(", ")}.`
    );
  }

  assertLegalEntityWireContext(value as LegalEntityWireContext);
}
