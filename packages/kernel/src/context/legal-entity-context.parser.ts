import {
  normalizeCompanyIdForWire,
  normalizeCountryCodeForWire,
  normalizeCurrencyCodeForWire,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  parseCompanyId,
  parseCountryCode,
  parseCurrencyCode,
  parseOptionalEntityGroupId,
  parseTenantId,
} from "../identity/index.js";
import { assertWireLegalEntityContext } from "./legal-entity-context.assert.js";
import type {
  LegalEntityContext,
  LegalEntityWireContext,
} from "./legal-entity-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseValidatedLegalEntityContext(
  value: LegalEntityWireContext
): LegalEntityContext {
  return {
    ...value,
    tenantId: parseTenantId(value.tenantId),
    entityGroupId: parseOptionalEntityGroupId(value.entityGroupId),
    companyId: parseCompanyId(value.companyId),
    countryCode: parseCountryCode(value.countryCode),
    baseCurrency: parseCurrencyCode(value.baseCurrency),
    reportingCurrency:
      value.reportingCurrency === null
        ? null
        : parseCurrencyCode(value.reportingCurrency),
  };
}

export function parseLegalEntityContext(
  value: LegalEntityWireContext
): LegalEntityContext {
  assertWireLegalEntityContext(value);
  return parseValidatedLegalEntityContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs and primitives. */
export function parseUnknownLegalEntityContext(
  value: unknown
): LegalEntityContext {
  assertWireLegalEntityContext(value);
  return parseValidatedLegalEntityContext(value);
}

export function normalizeLegalEntityContextForWire(
  value: LegalEntityContext
): LegalEntityWireContext {
  return {
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    entityGroupId:
      value.entityGroupId === null
        ? null
        : normalizeEntityGroupIdForWire(value.entityGroupId),
    companyId: requiredWireString(
      normalizeCompanyIdForWire(value.companyId),
      "companyId"
    ),

    legalName: value.legalName,
    displayName: value.displayName,
    slug: value.slug,

    companyType: value.companyType,
    relationshipToHoldingCompany: value.relationshipToHoldingCompany,

    countryCode: requiredWireString(
      normalizeCountryCodeForWire(value.countryCode),
      "countryCode"
    ),
    baseCurrency: requiredWireString(
      normalizeCurrencyCodeForWire(value.baseCurrency),
      "baseCurrency"
    ),
    reportingCurrency:
      value.reportingCurrency === null
        ? null
        : requiredWireString(
            normalizeCurrencyCodeForWire(value.reportingCurrency),
            "reportingCurrency"
          ),

    fiscalCalendarId: value.fiscalCalendarId,
    registrationNumber: value.registrationNumber,
    taxRegistrationNumber: value.taxRegistrationNumber,

    effectiveFrom: value.effectiveFrom,
    effectiveTo: value.effectiveTo,
    status: value.status,
  };
}
