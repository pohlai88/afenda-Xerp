/**
 * PAS-001 §4.7 / ADR-0021 — Business Reference Identity Authority governance policy.
 *
 * Kernel owns canonical reference ID vocabulary for seven business-reference families.
 * Domain packages own record lifecycle, validation, persistence, CRUD, and UI.
 */

import {
  type EnterpriseIdFamily,
  getEnterpriseIdFamiliesByCategory,
  getIdFamilyDefinition,
  type ID_FAMILIES,
  ID_FAMILY_CATEGORIES,
} from "../registry/index.js";

export const BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT = 7 as const;

export const BUSINESS_REFERENCE_RECORD_OWNERS = {
  customer: "crm-sales",
  supplier: "procurement",
  product: "product-inventory",
  employee: "hrm",
  warehouse: "inventory-warehouse",
  document: "document-management",
  asset: "asset-management",
} as const;

export type BusinessReferenceIdentityFamily =
  keyof typeof BUSINESS_REFERENCE_RECORD_OWNERS;

export type BusinessReferenceRecordOwner =
  (typeof BUSINESS_REFERENCE_RECORD_OWNERS)[BusinessReferenceIdentityFamily];

export const BUSINESS_REFERENCE_IDENTITY_FAMILIES =
  getEnterpriseIdFamiliesByCategory(
    ID_FAMILY_CATEGORIES.businessReference
  ) as readonly BusinessReferenceIdentityFamily[];

export const BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS = [
  "business record persistence in kernel",
  "business record CRUD in kernel",
  "business record UI in kernel",
  "business import/export in kernel",
  "business validation in kernel",
  "business lifecycle in kernel",
] as const;

export type BusinessReferenceKernelProhibitedPattern =
  (typeof BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS)[number];

export const BUSINESS_REFERENCE_IDENTITY_POLICY = {
  kernelOwnsReferenceIdsOnly: true,
  recordLifecycleOwnedByDomain: true,
  prohibitedPatterns: BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS,
  familyCount: BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT,
  preferredAuthorityName: "Business Reference Identity Authority",
  recordOwners: BUSINESS_REFERENCE_RECORD_OWNERS,
  families: BUSINESS_REFERENCE_IDENTITY_FAMILIES,
} as const satisfies {
  readonly kernelOwnsReferenceIdsOnly: true;
  readonly recordLifecycleOwnedByDomain: true;
  readonly prohibitedPatterns: readonly BusinessReferenceKernelProhibitedPattern[];
  readonly familyCount: typeof BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT;
  readonly preferredAuthorityName: string;
  readonly recordOwners: typeof BUSINESS_REFERENCE_RECORD_OWNERS;
  readonly families: readonly BusinessReferenceIdentityFamily[];
};

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends infer Mapped
        ? Mapped extends Record<string, true>
          ? true
          : never
        : never
      : never;

type _AssertBusinessReferenceIdentityPolicySerializable =
  AssertJsonSerializable<typeof BUSINESS_REFERENCE_IDENTITY_POLICY>;

type _AssertRecordOwnerRegistryParity = {
  [K in BusinessReferenceIdentityFamily]: (typeof BUSINESS_REFERENCE_RECORD_OWNERS)[K] extends NonNullable<
    (typeof ID_FAMILIES)[K]["recordOwner"]
  >
    ? (typeof ID_FAMILIES)[K]["recordOwner"] extends (typeof BUSINESS_REFERENCE_RECORD_OWNERS)[K]
      ? true
      : never
    : never;
}[BusinessReferenceIdentityFamily];

type _AssertBusinessReferenceCategory = {
  [K in BusinessReferenceIdentityFamily]: (typeof ID_FAMILIES)[K]["category"] extends typeof ID_FAMILY_CATEGORIES.businessReference
    ? true
    : never;
}[BusinessReferenceIdentityFamily];

export function isBusinessReferenceIdentityFamily(
  family: EnterpriseIdFamily
): family is BusinessReferenceIdentityFamily {
  return family in BUSINESS_REFERENCE_RECORD_OWNERS;
}

export function getBusinessReferenceRecordOwner(
  family: BusinessReferenceIdentityFamily
): BusinessReferenceRecordOwner {
  const definition = getIdFamilyDefinition(family);
  const recordOwner = BUSINESS_REFERENCE_RECORD_OWNERS[family];
  if (definition.recordOwner !== recordOwner) {
    throw new Error(
      `Business reference recordOwner mismatch for ${family}: policy=${recordOwner}, registry=${definition.recordOwner ?? "undefined"}`
    );
  }
  return recordOwner;
}
