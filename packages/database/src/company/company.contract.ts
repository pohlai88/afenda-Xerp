/**
 * Company write governance — types and pure builders (no I/O).
 *
 * Table: `schema/company.schema.ts`
 * Writes: `company.service.ts`
 */
import type {
  CompanyStatus,
  LegalEntityCompanyType,
} from "../database.types.js";
import { LEGAL_ENTITY_COMPANY_TYPES } from "../database.types.js";
import {
  assertPlatformSlug,
  InvalidPlatformSlugError,
  normalizePlatformSlug,
} from "../platform-slug.js";
import {
  ISO3166_ALPHA2_REGISTRY_SCOPE,
  ISO4217_REGISTRY_SCOPE,
  isGovernedIso3166Alpha2CountryCode,
  isGovernedIso4217CurrencyCode,
  isIso3166Alpha2Format,
  isIso4217CurrencyFormat,
  normalizeIso3166Alpha2,
  normalizeIso4217Currency,
} from "./iso-codes.js";

export class InvalidCompanySlugError extends InvalidPlatformSlugError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCompanySlugError";
  }
}

export class InvalidCountryCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCountryCodeError";
  }
}

export class InvalidCurrencyCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCurrencyCodeError";
  }
}

export class InvalidLegalEntityCompanyTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidLegalEntityCompanyTypeError";
  }
}

export class InvalidEffectiveDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEffectiveDateError";
  }
}

const ISO_DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function assertLegalEntityCompanyType(
  value: string
): LegalEntityCompanyType {
  if (!(LEGAL_ENTITY_COMPANY_TYPES as readonly string[]).includes(value)) {
    throw new InvalidLegalEntityCompanyTypeError(
      `Invalid company type "${value}". Expected one of: ${LEGAL_ENTITY_COMPANY_TYPES.join(", ")}.`
    );
  }

  return value as LegalEntityCompanyType;
}

/** Validates ISO 8601 calendar date (YYYY-MM-DD) for company effective dates. */
export function assertIsoDateOnly(value: string): string {
  const trimmed = value.trim();

  if (!ISO_DATE_ONLY_PATTERN.test(trimmed)) {
    throw new InvalidEffectiveDateError(
      `Invalid effective date "${value}". Expected ISO calendar date YYYY-MM-DD.`
    );
  }

  return trimmed;
}

export function normalizeOptionalIsoDateOnly(
  value: string | null | undefined
): string | null {
  if (value == null || value === "") {
    return null;
  }

  return assertIsoDateOnly(value);
}

/**
 * Normalizes a company slug to lowercase kebab-case.
 * Do not pass display names or legal names directly — derive intentionally.
 */
export function normalizeCompanySlug(value: string): string {
  return normalizePlatformSlug(value);
}

export function assertCompanySlug(value: string): string {
  try {
    return assertPlatformSlug(value);
  } catch (error) {
    if (error instanceof InvalidPlatformSlugError) {
      throw new InvalidCompanySlugError(error.message);
    }
    throw error;
  }
}

/** Validates governed ISO 3166-1 alpha-2 country codes for company writes. */
export function assertIso3166Alpha2CountryCode(value: string): string {
  const normalized = normalizeIso3166Alpha2(value);

  if (!isIso3166Alpha2Format(normalized)) {
    throw new InvalidCountryCodeError(
      `Invalid country code "${value}". Expected ISO 3166-1 alpha-2.`
    );
  }

  if (!isGovernedIso3166Alpha2CountryCode(normalized)) {
    throw new InvalidCountryCodeError(
      `Country code "${value}" is not in the governed registry (${ISO3166_ALPHA2_REGISTRY_SCOPE}). Add it to iso-codes.ts before use.`
    );
  }

  return normalized;
}

/** Validates governed ISO 4217 currency codes for company writes. */
export function assertIso4217CurrencyCode(value: string): string {
  const normalized = normalizeIso4217Currency(value);

  if (!isIso4217CurrencyFormat(normalized)) {
    throw new InvalidCurrencyCodeError(
      `Invalid currency code "${value}". Expected ISO 4217.`
    );
  }

  if (!isGovernedIso4217CurrencyCode(normalized)) {
    throw new InvalidCurrencyCodeError(
      `Currency code "${value}" is not in the governed registry (${ISO4217_REGISTRY_SCOPE}). Add it to iso-codes.ts before use.`
    );
  }

  return normalized;
}

export interface CompanyWriteInput {
  readonly baseCurrency: string;
  readonly companyType?: LegalEntityCompanyType;
  readonly countryCode: string;
  readonly displayName: string;
  readonly effectiveFrom?: string | null;
  readonly effectiveTo?: string | null;
  readonly entityGroupId?: string | null;
  readonly fiscalCalendarId?: string | null;
  readonly legalName: string;
  readonly registrationNumber?: string | null;
  readonly slug: string;
  readonly status?: CompanyStatus;
  readonly taxId?: string | null;
  readonly tenantId: string;
}

export interface CompanyInsertRow {
  baseCurrency: string;
  companyType: LegalEntityCompanyType;
  countryCode: string;
  displayName: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  entityGroupId: string | null;
  fiscalCalendarId: string | null;
  legalName: string;
  registrationNumber: string | null;
  slug: string;
  status: CompanyStatus;
  taxId: string | null;
  tenantId: string;
}

export type CompanyUpdatePatch = Partial<Omit<CompanyInsertRow, "tenantId">> & {
  mfaRequiredOverride?: boolean | null;
  tenantId?: never;
};

/** Normalizes governed company fields before DB write (no I/O). */
export function buildCompanyInsertRow(
  input: CompanyWriteInput
): CompanyInsertRow {
  return {
    tenantId: input.tenantId,
    entityGroupId: input.entityGroupId ?? null,
    slug: assertCompanySlug(input.slug),
    legalName: input.legalName.trim(),
    displayName: input.displayName.trim(),
    registrationNumber: input.registrationNumber?.trim() || null,
    taxId: input.taxId?.trim() || null,
    baseCurrency: assertIso4217CurrencyCode(input.baseCurrency),
    countryCode: assertIso3166Alpha2CountryCode(input.countryCode),
    companyType: input.companyType
      ? assertLegalEntityCompanyType(input.companyType)
      : "standalone",
    fiscalCalendarId: input.fiscalCalendarId ?? null,
    effectiveFrom: normalizeOptionalIsoDateOnly(input.effectiveFrom),
    effectiveTo: normalizeOptionalIsoDateOnly(input.effectiveTo),
    status: input.status ?? "active",
  };
}

export function buildCompanyUpdatePatch(
  input: CompanyUpdatePatch
): CompanyUpdatePatch {
  const patch: CompanyUpdatePatch = {};

  if (input.slug !== undefined) {
    patch.slug = assertCompanySlug(input.slug);
  }
  if (input.legalName !== undefined) {
    patch.legalName = input.legalName.trim();
  }
  if (input.displayName !== undefined) {
    patch.displayName = input.displayName.trim();
  }
  if (input.registrationNumber !== undefined) {
    patch.registrationNumber = input.registrationNumber?.trim() || null;
  }
  if (input.taxId !== undefined) {
    patch.taxId = input.taxId?.trim() || null;
  }
  if (input.baseCurrency !== undefined) {
    patch.baseCurrency = assertIso4217CurrencyCode(input.baseCurrency);
  }
  if (input.countryCode !== undefined) {
    patch.countryCode = assertIso3166Alpha2CountryCode(input.countryCode);
  }
  if (input.entityGroupId !== undefined) {
    patch.entityGroupId = input.entityGroupId;
  }
  if (input.companyType !== undefined) {
    patch.companyType = assertLegalEntityCompanyType(input.companyType);
  }
  if (input.fiscalCalendarId !== undefined) {
    patch.fiscalCalendarId = input.fiscalCalendarId;
  }
  if (input.effectiveFrom !== undefined) {
    patch.effectiveFrom = normalizeOptionalIsoDateOnly(input.effectiveFrom);
  }
  if (input.effectiveTo !== undefined) {
    patch.effectiveTo = normalizeOptionalIsoDateOnly(input.effectiveTo);
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }
  if (input.mfaRequiredOverride !== undefined) {
    patch.mfaRequiredOverride = input.mfaRequiredOverride;
  }

  return patch;
}
