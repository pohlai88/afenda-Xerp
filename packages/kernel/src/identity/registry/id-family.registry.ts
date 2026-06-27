/**
 * PAS-001 §4.1 / ADR-0021 — single enterprise ID family registry.
 */

export const IDENTITY_AUTHORITY_PAS = "PAS-001" as const;
export const IDENTITY_AUTHORITY_SECTION = "4.1" as const;
export const IDENTITY_AUTHORITY_ADR = "ADR-0021" as const;

/** @deprecated Use IDENTITY_AUTHORITY_PAS */
export const PLATFORM_ID_AUTHORITY_PAS = IDENTITY_AUTHORITY_PAS;
/** @deprecated Use IDENTITY_AUTHORITY_SECTION */
export const PLATFORM_ID_AUTHORITY_SECTION = IDENTITY_AUTHORITY_SECTION;

export const FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS = [
  "FiscalCalendarId",
  "FiscalPeriodId",
] as const;

export type ForbiddenPlatformFloorIdSymbol =
  (typeof FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS)[number];

/** PAS-001 §4.1.4 — canonical category vocabulary (kebab-case wire/doc values). */
export const ID_FAMILY_CATEGORIES = {
  tenantHierarchy: "tenant-hierarchy",
  identityAccess: "identity-access",
  auditExecution: "audit-execution",
  enterpriseHierarchy: "enterprise-hierarchy",
  businessReference: "business-reference",
  globalPrimitive: "global-primitive",
} as const;

export type IdFamilyCategory =
  (typeof ID_FAMILY_CATEGORIES)[keyof typeof ID_FAMILY_CATEGORIES];

/** Frozen enterprise ID family count — primitives excluded. */
export const ID_FAMILY_COUNT = 22 as const;

export const PRIMITIVE_ID_FAMILY_COUNT = 7 as const;

export const REGISTRY_FAMILY_COUNT = 29 as const;

type _AssertRegistryTotal = typeof REGISTRY_FAMILY_COUNT extends 29
  ? typeof ID_FAMILY_COUNT extends 22
    ? typeof PRIMITIVE_ID_FAMILY_COUNT extends 7
      ? true
      : never
    : never
  : never;

export interface IdFamilyDefinition {
  readonly brandLabel: string;
  readonly category: IdFamilyCategory;
  readonly createFunction: string | null;
  readonly generates: boolean;
  readonly normalizeForWireFunction: string;
  readonly owner: "kernel";
  readonly parseFunction: string;
  /** Optional ingress parse — null when IDs are always required (execution/correlation). */
  readonly parseOptionalFunction: string | null;
  readonly prefix: string;
  readonly recordOwner?: string;
  readonly toFunction: string;
  readonly typeName: string;
}

export const ID_FAMILIES = {
  tenant: {
    typeName: "TenantId",
    prefix: "ten",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.tenantHierarchy,
    brandLabel: "tenantId",
    parseFunction: "parseTenantId",
    createFunction: "createTenantId",
    parseOptionalFunction: "parseOptionalTenantId",
    toFunction: "toTenantId",
    normalizeForWireFunction: "normalizeTenantIdForWire",
  },
  entityGroup: {
    typeName: "EntityGroupId",
    prefix: "egp",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.tenantHierarchy,
    brandLabel: "entityGroupId",
    parseFunction: "parseEntityGroupId",
    createFunction: "createEntityGroupId",
    parseOptionalFunction: "parseOptionalEntityGroupId",
    toFunction: "toEntityGroupId",
    normalizeForWireFunction: "normalizeEntityGroupIdForWire",
  },
  company: {
    typeName: "CompanyId",
    prefix: "cmp",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.tenantHierarchy,
    brandLabel: "companyId",
    parseFunction: "parseCompanyId",
    createFunction: "createCompanyId",
    parseOptionalFunction: "parseOptionalCompanyId",
    toFunction: "toCompanyId",
    normalizeForWireFunction: "normalizeCompanyIdForWire",
  },
  organization: {
    typeName: "OrganizationId",
    prefix: "org",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.tenantHierarchy,
    brandLabel: "organizationId",
    parseFunction: "parseOrganizationId",
    createFunction: "createOrganizationId",
    parseOptionalFunction: "parseOptionalOrganizationId",
    toFunction: "toOrganizationId",
    normalizeForWireFunction: "normalizeOrganizationIdForWire",
  },
  team: {
    typeName: "TeamId",
    prefix: "tea",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.tenantHierarchy,
    brandLabel: "teamId",
    parseFunction: "parseTeamId",
    createFunction: "createTeamId",
    parseOptionalFunction: "parseOptionalTeamId",
    toFunction: "toTeamId",
    normalizeForWireFunction: "normalizeTeamIdForWire",
  },
  project: {
    typeName: "ProjectId",
    prefix: "prj",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.tenantHierarchy,
    brandLabel: "projectId",
    parseFunction: "parseProjectId",
    createFunction: "createProjectId",
    parseOptionalFunction: "parseOptionalProjectId",
    toFunction: "toProjectId",
    normalizeForWireFunction: "normalizeProjectIdForWire",
  },
  user: {
    typeName: "UserId",
    prefix: "usr",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.identityAccess,
    brandLabel: "userId",
    parseFunction: "parseUserId",
    createFunction: "createUserId",
    parseOptionalFunction: "parseOptionalUserId",
    toFunction: "toUserId",
    normalizeForWireFunction: "normalizeUserIdForWire",
  },
  role: {
    typeName: "RoleId",
    prefix: "rol",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.identityAccess,
    brandLabel: "roleId",
    parseFunction: "parseRoleId",
    createFunction: "createRoleId",
    parseOptionalFunction: "parseOptionalRoleId",
    toFunction: "toRoleId",
    normalizeForWireFunction: "normalizeRoleIdForWire",
  },
  membership: {
    typeName: "MembershipId",
    prefix: "mem",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.identityAccess,
    brandLabel: "membershipId",
    parseFunction: "parseMembershipId",
    createFunction: "createMembershipId",
    parseOptionalFunction: "parseOptionalMembershipId",
    toFunction: "toMembershipId",
    normalizeForWireFunction: "normalizeMembershipIdForWire",
  },
  permission: {
    typeName: "PermissionId",
    prefix: "per",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.identityAccess,
    brandLabel: "permissionId",
    parseFunction: "parsePermissionId",
    createFunction: "createPermissionId",
    parseOptionalFunction: "parseOptionalPermissionId",
    toFunction: "toPermissionId",
    normalizeForWireFunction: "normalizePermissionIdForWire",
  },
  policy: {
    typeName: "PolicyId",
    prefix: "pol",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.identityAccess,
    brandLabel: "policyId",
    parseFunction: "parsePolicyId",
    createFunction: "createPolicyId",
    parseOptionalFunction: "parseOptionalPolicyId",
    toFunction: "toPolicyId",
    normalizeForWireFunction: "normalizePolicyIdForWire",
  },
  auditEvent: {
    typeName: "AuditEventId",
    prefix: "aud",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.auditExecution,
    brandLabel: "auditEventId",
    parseFunction: "parseAuditEventId",
    createFunction: "createAuditEventId",
    parseOptionalFunction: "parseOptionalAuditEventId",
    toFunction: "toAuditEventId",
    normalizeForWireFunction: "normalizeAuditEventIdForWire",
  },
  execution: {
    typeName: "ExecutionId",
    prefix: "exe",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.auditExecution,
    brandLabel: "executionId",
    parseFunction: "parseExecutionId",
    createFunction: "createExecutionId",
    parseOptionalFunction: null,
    toFunction: "toExecutionId",
    normalizeForWireFunction: "normalizeExecutionIdForWire",
  },
  correlation: {
    typeName: "CorrelationId",
    prefix: "cor",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.auditExecution,
    brandLabel: "correlationId",
    parseFunction: "parseCorrelationId",
    createFunction: "createCorrelationId",
    parseOptionalFunction: null,
    toFunction: "toCorrelationId",
    normalizeForWireFunction: "normalizeCorrelationIdForWire",
  },
  ownershipInterest: {
    typeName: "OwnershipInterestId",
    prefix: "own",
    owner: "kernel",
    generates: true,
    category: ID_FAMILY_CATEGORIES.enterpriseHierarchy,
    brandLabel: "ownershipInterestId",
    parseFunction: "parseOwnershipInterestId",
    createFunction: "createOwnershipInterestId",
    parseOptionalFunction: "parseOptionalOwnershipInterestId",
    toFunction: "toOwnershipInterestId",
    normalizeForWireFunction: "normalizeOwnershipInterestIdForWire",
    recordOwner: "enterprise-structure",
  },
  customer: {
    typeName: "CustomerId",
    prefix: "cus",
    owner: "kernel",
    recordOwner: "crm-sales",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "customerId",
    parseFunction: "parseCustomerId",
    createFunction: "createCustomerId",
    parseOptionalFunction: "parseOptionalCustomerId",
    toFunction: "toCustomerId",
    normalizeForWireFunction: "normalizeCustomerIdForWire",
  },
  supplier: {
    typeName: "SupplierId",
    prefix: "sup",
    owner: "kernel",
    recordOwner: "procurement",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "supplierId",
    parseFunction: "parseSupplierId",
    createFunction: "createSupplierId",
    parseOptionalFunction: "parseOptionalSupplierId",
    toFunction: "toSupplierId",
    normalizeForWireFunction: "normalizeSupplierIdForWire",
  },
  product: {
    typeName: "ProductId",
    prefix: "prd",
    owner: "kernel",
    recordOwner: "product-inventory",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "productId",
    parseFunction: "parseProductId",
    createFunction: "createProductId",
    parseOptionalFunction: "parseOptionalProductId",
    toFunction: "toProductId",
    normalizeForWireFunction: "normalizeProductIdForWire",
  },
  employee: {
    typeName: "EmployeeId",
    prefix: "emp",
    owner: "kernel",
    recordOwner: "hrm",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "employeeId",
    parseFunction: "parseEmployeeId",
    createFunction: "createEmployeeId",
    parseOptionalFunction: "parseOptionalEmployeeId",
    toFunction: "toEmployeeId",
    normalizeForWireFunction: "normalizeEmployeeIdForWire",
  },
  warehouse: {
    typeName: "WarehouseId",
    prefix: "whs",
    owner: "kernel",
    recordOwner: "inventory-warehouse",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "warehouseId",
    parseFunction: "parseWarehouseId",
    createFunction: "createWarehouseId",
    parseOptionalFunction: "parseOptionalWarehouseId",
    toFunction: "toWarehouseId",
    normalizeForWireFunction: "normalizeWarehouseIdForWire",
  },
  document: {
    typeName: "DocumentId",
    prefix: "doc",
    owner: "kernel",
    recordOwner: "document-management",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "documentId",
    parseFunction: "parseDocumentId",
    createFunction: "createDocumentId",
    parseOptionalFunction: "parseOptionalDocumentId",
    toFunction: "toDocumentId",
    normalizeForWireFunction: "normalizeDocumentIdForWire",
  },
  asset: {
    typeName: "AssetId",
    prefix: "ast",
    owner: "kernel",
    recordOwner: "asset-maintenance-finance",
    generates: true,
    category: ID_FAMILY_CATEGORIES.businessReference,
    brandLabel: "assetId",
    parseFunction: "parseAssetId",
    createFunction: "createAssetId",
    parseOptionalFunction: "parseOptionalAssetId",
    toFunction: "toAssetId",
    normalizeForWireFunction: "normalizeAssetIdForWire",
  },
  localeCode: {
    typeName: "LocaleCode",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "localeCode",
    parseFunction: "parseLocaleCode",
    createFunction: null,
    parseOptionalFunction: null,
    toFunction: "toLocaleCode",
    normalizeForWireFunction: "normalizeLocaleCodeForWire",
  },
  timezoneId: {
    typeName: "TimezoneId",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "timezoneId",
    parseFunction: "parseTimezoneId",
    createFunction: null,
    parseOptionalFunction: null,
    toFunction: "toTimezoneId",
    normalizeForWireFunction: "normalizeTimezoneIdForWire",
  },
  dateFormat: {
    typeName: "DateFormat",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "dateFormat",
    parseFunction: "parseDateFormat",
    createFunction: null,
    parseOptionalFunction: null,
    toFunction: "toDateFormat",
    normalizeForWireFunction: "normalizeDateFormatForWire",
  },
  numberFormat: {
    typeName: "NumberFormat",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "numberFormat",
    parseFunction: "parseNumberFormat",
    createFunction: null,
    parseOptionalFunction: null,
    toFunction: "toNumberFormat",
    normalizeForWireFunction: "normalizeNumberFormatForWire",
  },
  currencyCode: {
    typeName: "CurrencyCode",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "currencyCode",
    parseFunction: "parseCurrencyCode",
    createFunction: null,
    parseOptionalFunction: "brandCurrencyCode",
    toFunction: "toCurrencyCode",
    normalizeForWireFunction: "normalizeCurrencyCodeForWire",
  },
  countryCode: {
    typeName: "CountryCode",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "countryCode",
    parseFunction: "parseCountryCode",
    createFunction: null,
    parseOptionalFunction: "brandCountryCode",
    toFunction: "toCountryCode",
    normalizeForWireFunction: "normalizeCountryCodeForWire",
  },
  uomCode: {
    typeName: "UomCode",
    prefix: "",
    owner: "kernel",
    generates: false,
    category: ID_FAMILY_CATEGORIES.globalPrimitive,
    brandLabel: "uomCode",
    parseFunction: "parseUomCode",
    createFunction: null,
    parseOptionalFunction: "brandUomCode",
    toFunction: "toUomCode",
    normalizeForWireFunction: "normalizeUomCodeForWire",
  },
} as const;

/** Shape check — preserves literal `typeName` / `prefix` on `ID_FAMILIES`. */
type _AssertIdFamilyRegistryShape =
  typeof ID_FAMILIES extends Record<
    keyof typeof ID_FAMILIES,
    IdFamilyDefinition
  >
    ? true
    : never;

export type IdFamily = keyof typeof ID_FAMILIES;

/** Frozen PAS §4.1.4 enterprise family keys — order matches authority table. */
export const ENTERPRISE_ID_FAMILY_KEYS = [
  "tenant",
  "entityGroup",
  "company",
  "organization",
  "team",
  "project",
  "user",
  "role",
  "membership",
  "permission",
  "policy",
  "auditEvent",
  "execution",
  "correlation",
  "ownershipInterest",
  "customer",
  "supplier",
  "product",
  "employee",
  "warehouse",
  "document",
  "asset",
] as const satisfies readonly IdFamily[];

type _AssertEnterpriseFamilyCount =
  (typeof ENTERPRISE_ID_FAMILY_KEYS)["length"] extends typeof ID_FAMILY_COUNT
    ? true
    : never;

export type EnterpriseIdFamily = (typeof ENTERPRISE_ID_FAMILY_KEYS)[number];

export type EnterpriseIdPrefix =
  (typeof ID_FAMILIES)[EnterpriseIdFamily]["prefix"];

/** Enterprise three-letter prefix — excludes primitive families. */
export type IdPrefix = EnterpriseIdPrefix;

type _AssertEnterpriseKeysRegistered = {
  [K in EnterpriseIdFamily]: (typeof ID_FAMILIES)[K]["prefix"] extends ""
    ? never
    : true;
}[EnterpriseIdFamily];

type _AssertNoOrphanEnterpriseFamilies = {
  [K in IdFamily]: (typeof ID_FAMILIES)[K]["prefix"] extends ""
    ? true
    : K extends EnterpriseIdFamily
      ? true
      : never;
}[IdFamily];

export const ENTERPRISE_ID_FAMILIES: readonly EnterpriseIdFamily[] =
  ENTERPRISE_ID_FAMILY_KEYS;

export function isEnterpriseIdFamily(
  family: IdFamily
): family is EnterpriseIdFamily {
  return ID_FAMILIES[family].prefix !== "";
}

export function getEnterpriseIdFamiliesByCategory(
  category: IdFamilyCategory
): readonly EnterpriseIdFamily[] {
  return ENTERPRISE_ID_FAMILY_KEYS.filter(
    (family) => ID_FAMILIES[family].category === category
  );
}

/** @deprecated Use ID_FAMILIES — governance compatibility alias. */
export const PLATFORM_ID_FAMILY_REGISTRY = Object.values(ID_FAMILIES);

export type PlatformIdFamilyTypeName =
  (typeof ID_FAMILIES)[IdFamily]["typeName"];

export const PLATFORM_ID_FAMILY_TYPE_NAMES = Object.values(ID_FAMILIES).map(
  (entry) => entry.typeName
);

export function getIdFamilyDefinition(family: IdFamily): IdFamilyDefinition {
  return ID_FAMILIES[family];
}

export type PlatformIdCategory = IdFamilyCategory;
export type PlatformIdFamilyDefinition = IdFamilyDefinition;

export function getPlatformIdFamilyDefinition(
  typeName: PlatformIdFamilyTypeName
): IdFamilyDefinition {
  const entry = Object.values(ID_FAMILIES).find(
    (family) => family.typeName === typeName
  );

  if (entry === undefined) {
    throw new Error(`Unknown platform id family: ${typeName}`);
  }

  return entry;
}

// --- Governance manifest (PAS-001 §4.1 / Slice E) ---

export const KERNEL_IDENTITY_GOVERNANCE_BUNDLE =
  "check:kernel-identity-governance" as const;

export type KernelIdentityGovernanceGateId =
  | "kernel-identity-surface"
  | "id-prefix-uniqueness"
  | "id-parser-generator-parity"
  | "forbidden-platform-ids"
  | "identity-boundary"
  | "no-local-id-type-definitions"
  | "database-enterprise-id-contract"
  | "tenant-human-reference-uniqueness"
  | "tenant-human-reference-kernel-contract"
  | "fk-uuid-only"
  | "split-id-persistence"
  | "rls-uuid-tenant-only";

export interface KernelIdentityGovernanceGateDefinition {
  readonly id: KernelIdentityGovernanceGateId;
  readonly script: string;
  readonly slice: "B" | "C" | "D" | "E";
  readonly summary: string;
}

export const KERNEL_IDENTITY_GOVERNANCE_GATES = [
  {
    id: "kernel-identity-surface",
    script: "check:kernel-identity-surface",
    slice: "B",
    summary:
      "Registry parity — parse/create/to/wire exports for all ID families.",
  },
  {
    id: "id-prefix-uniqueness",
    script: "check:id-prefix-uniqueness",
    slice: "E",
    summary: "No duplicate three-letter enterprise ID prefixes.",
  },
  {
    id: "id-parser-generator-parity",
    script: "check:id-parser-generator-parity",
    slice: "E",
    summary:
      "Every generating family has parser + generator round-trip metadata.",
  },
  {
    id: "forbidden-platform-ids",
    script: "check:forbidden-platform-ids",
    slice: "E",
    summary: "FiscalCalendarId / FiscalPeriodId remain off platform floor.",
  },
  {
    id: "identity-boundary",
    script: "check:identity-boundary",
    slice: "D",
    summary:
      "Consumer packages forbid enterprise ID casts, kernel Brand imports, and legacy brand helpers.",
  },
  {
    id: "no-local-id-type-definitions",
    script: "check:no-local-id-type-definitions",
    slice: "D",
    summary: "Consumers import enterprise ID types from @afenda/kernel only.",
  },
  {
    id: "database-enterprise-id-contract",
    script: "check:database-enterprise-id-contract",
    slice: "C",
    summary: "Split-ID column contract on governed platform entity tables.",
  },
  {
    id: "tenant-human-reference-uniqueness",
    script: "check:tenant-human-reference-uniqueness",
    slice: "E",
    summary: "Tenant-scoped human reference unique constraints where live.",
  },
  {
    id: "tenant-human-reference-kernel-contract",
    script: "check:tenant-human-reference-kernel-contract",
    slice: "B",
    summary:
      "TenantHumanReference scopes/types separate from canonical enterprise IDs.",
  },
  {
    id: "fk-uuid-only",
    script: "check:fk-uuid-only",
    slice: "E",
    summary: "Platform entity foreign keys reference uuid PK columns only.",
  },
  {
    id: "split-id-persistence",
    script: "check:split-id-persistence",
    slice: "C",
    summary:
      "Split-ID column contract — uuid PK, enterprise_id CHECK, human refs never FK/PK.",
  },
  {
    id: "rls-uuid-tenant-only",
    script: "check:rls-uuid-tenant-only",
    slice: "E",
    summary: "RLS policies use uuid tenant scope — not enterprise_id text.",
  },
] as const satisfies readonly KernelIdentityGovernanceGateDefinition[];

export const KERNEL_IDENTITY_GOVERNANCE_GATE_SCRIPTS =
  KERNEL_IDENTITY_GOVERNANCE_GATES.map((gate) => gate.script);

export const ENTERPRISE_ID_TYPE_NAMES = ENTERPRISE_ID_FAMILIES.map(
  (family) => ID_FAMILIES[family].typeName
) as readonly PlatformIdFamilyTypeName[];

export const IDENTITY_PROMOTION_REQUIREMENT_IDS = [
  "adr-or-pas-amendment",
  "registry-row",
  "unique-prefix",
  "parser-validator",
  "generator-when-generates",
  "wire-normalizer",
  "kernel-tests",
  "kernel-identity-surface-gate",
  "database-check-unique-when-persisted",
  "enterprise-id-db-parity-gate",
  "json-serializable-wire",
  "erp-parse-at-boundary",
  "forbidden-fiscal-ids-off-floor",
] as const;

export type IdentityPromotionRequirementId =
  (typeof IDENTITY_PROMOTION_REQUIREMENT_IDS)[number];

export interface IdentityPromotionRequirementDefinition {
  readonly evidenceGate: string | null;
  readonly id: IdentityPromotionRequirementId;
  readonly summary: string;
}

export const IDENTITY_PROMOTION_REQUIREMENTS = {
  "adr-or-pas-amendment": {
    id: "adr-or-pas-amendment",
    summary: "ADR or PAS amendment records family, prefix, and owner.",
    evidenceGate: null,
  },
  "registry-row": {
    id: "registry-row",
    summary:
      "Registry row in ID_FAMILIES with prefix, typeName, owner, recordOwner, generates.",
    evidenceGate: "check:kernel-identity-surface",
  },
  "unique-prefix": {
    id: "unique-prefix",
    summary: "Prefix is [a-z]{3} and does not collide with existing families.",
    evidenceGate: "check:id-prefix-uniqueness",
  },
  "parser-validator": {
    id: "parser-validator",
    summary: "Family exports parse* and non-throwing validator coverage.",
    evidenceGate: "check:kernel-identity-surface",
  },
  "generator-when-generates": {
    id: "generator-when-generates",
    summary: "generates: true families export create* with round-trip tests.",
    evidenceGate: "check:id-parser-generator-parity",
  },
  "wire-normalizer": {
    id: "wire-normalizer",
    summary:
      "Wire normalizer registered on families/, primitives/, or identity/index.ts.",
    evidenceGate: "check:kernel-identity-surface",
  },
  "kernel-tests": {
    id: "kernel-tests",
    summary:
      "Kernel tests cover valid, invalid, wrong-prefix, wrong-body, registry parity.",
    evidenceGate: null,
  },
  "kernel-identity-surface-gate": {
    id: "kernel-identity-surface-gate",
    summary: "pnpm check:kernel-identity-surface exit 0.",
    evidenceGate: "check:kernel-identity-surface",
  },
  "database-check-unique-when-persisted": {
    id: "database-check-unique-when-persisted",
    summary:
      "Persisted families have enterprise_id CHECK + UNIQUE on entity tables.",
    evidenceGate: "check:database-enterprise-id-contract",
  },
  "enterprise-id-db-parity-gate": {
    id: "enterprise-id-db-parity-gate",
    summary:
      "Database CHECK patterns parity-validated against kernel registry.",
    evidenceGate: "check:database-enterprise-id-contract",
  },
  "json-serializable-wire": {
    id: "json-serializable-wire",
    summary:
      "Canonical IDs cross wire boundaries as plain strings; brands are compile-time only.",
    evidenceGate: null,
  },
  "erp-parse-at-boundary": {
    id: "erp-parse-at-boundary",
    summary: "ERP/API ingress uses parse* — no as FamilyId.",
    evidenceGate: "check:identity-boundary",
  },
  "forbidden-fiscal-ids-off-floor": {
    id: "forbidden-fiscal-ids-off-floor",
    summary: "FiscalCalendarId / FiscalPeriodId remain off platform floor.",
    evidenceGate: "check:forbidden-platform-ids",
  },
} as const satisfies Record<
  IdentityPromotionRequirementId,
  IdentityPromotionRequirementDefinition
>;

export const IDENTITY_GOVERNANCE_AUTHORITY = {
  pas: IDENTITY_AUTHORITY_PAS,
  section: IDENTITY_AUTHORITY_SECTION,
  adr: IDENTITY_AUTHORITY_ADR,
} as const;

export function isKernelIdentityGovernanceGateId(
  value: string
): value is KernelIdentityGovernanceGateId {
  return KERNEL_IDENTITY_GOVERNANCE_GATES.some((gate) => gate.id === value);
}

export function getKernelIdentityGovernanceGate(
  id: KernelIdentityGovernanceGateId
): KernelIdentityGovernanceGateDefinition {
  const gate = KERNEL_IDENTITY_GOVERNANCE_GATES.find(
    (entry) => entry.id === id
  );
  if (gate === undefined) {
    throw new Error(`Unknown kernel identity governance gate: ${id}`);
  }
  return gate;
}

export function isIdentityPromotionRequirementId(
  value: string
): value is IdentityPromotionRequirementId {
  return (IDENTITY_PROMOTION_REQUIREMENT_IDS as readonly string[]).includes(
    value
  );
}

// --- Prohibited identity patterns (ADR-0021 / governance scripts) ---

export const IDENTITY_PROHIBITED_PATTERN_IDS = [
  "unchecked-enterprise-id-cast",
  "unchecked-canonical-enterprise-id-cast",
  "kernel-brand-import-outside-identity",
  "legacy-brand-helper-at-consumer-boundary",
  "local-enterprise-id-type-alias",
  "unchecked-brand-required-id",
  "primitive-through-enterprise-parser",
  "forbidden-platform-floor-id-export",
  "duplicate-platform-id-registry",
  "external-ulid-npm-dependency",
  "math-random-canonical-id-generation",
  "kernel-drizzle-schema-or-migration",
  "human-reference-as-enterprise-id",
  "kernel-human-reference-generation",
  "enterprise-id-as-database-pk",
  "foreign-key-to-enterprise-id",
  "rls-on-enterprise-id-or-human-reference",
  "throwing-parser-for-ui-form-validation",
] as const;

export type IdentityProhibitedPatternId =
  (typeof IDENTITY_PROHIBITED_PATTERN_IDS)[number];

export type IdentityProhibitedPatternAuthority =
  | "PAS-001"
  | "ADR-0021"
  | "ADR-0022"
  | "ADR-0023";

export interface IdentityProhibitedPatternDefinition {
  readonly authority: IdentityProhibitedPatternAuthority;
  readonly enforcementGate: string | null;
  readonly id: IdentityProhibitedPatternId;
  readonly summary: string;
}

export const IDENTITY_PROHIBITED_PATTERNS = {
  "unchecked-enterprise-id-cast": {
    id: "unchecked-enterprise-id-cast",
    summary:
      "Consumer packages must not cast wire strings to enterprise ID types (`as TenantId`).",
    authority: "ADR-0021",
    enforcementGate: "check:identity-boundary",
  },
  "unchecked-canonical-enterprise-id-cast": {
    id: "unchecked-canonical-enterprise-id-cast",
    summary:
      "Consumer packages must not cast wire strings to `CanonicalEnterpriseId<T>` or `CanonicalId<T>`.",
    authority: "ADR-0021",
    enforcementGate: "check:identity-boundary",
  },
  "kernel-brand-import-outside-identity": {
    id: "kernel-brand-import-outside-identity",
    summary:
      "Consumer packages must not import `{ Brand }` from `@afenda/kernel` — use parse* for enterprise IDs.",
    authority: "ADR-0021",
    enforcementGate: "check:identity-boundary",
  },
  "legacy-brand-helper-at-consumer-boundary": {
    id: "legacy-brand-helper-at-consumer-boundary",
    summary:
      "Consumer packages must not call `brandRequiredId`, `brandOptionalId`, or family brand* helpers.",
    authority: "ADR-0021",
    enforcementGate: "check:identity-boundary",
  },
  "local-enterprise-id-type-alias": {
    id: "local-enterprise-id-type-alias",
    summary:
      "Consumer packages must not define local `type CustomerId = string` aliases.",
    authority: "ADR-0021",
    enforcementGate: "check:no-local-id-type-definitions",
  },
  "unchecked-brand-required-id": {
    id: "unchecked-brand-required-id",
    summary:
      "Kernel must not expose trim-only brand helpers that mint enterprise IDs without prefix/body validation.",
    authority: "PAS-001",
    enforcementGate: "check:kernel-identity-surface",
  },
  "primitive-through-enterprise-parser": {
    id: "primitive-through-enterprise-parser",
    summary:
      "ISO/BCP47 primitive codes must not route through the canonical enterprise ID parser.",
    authority: "ADR-0021",
    enforcementGate: "check:kernel-identity-surface",
  },
  "forbidden-platform-floor-id-export": {
    id: "forbidden-platform-floor-id-export",
    summary:
      "Fiscal platform-floor IDs must not export from kernel until ADR promotion.",
    authority: "PAS-001",
    enforcementGate: "check:forbidden-platform-ids",
  },
  "duplicate-platform-id-registry": {
    id: "duplicate-platform-id-registry",
    summary:
      "Legacy `contracts/platform-id*.ts` registries must not duplicate `identity/` authority.",
    authority: "PAS-001",
    enforcementGate: "check:kernel-identity-surface",
  },
  "external-ulid-npm-dependency": {
    id: "external-ulid-npm-dependency",
    summary: "Kernel canonical ID generator must remain zero-dependency.",
    authority: "ADR-0021",
    enforcementGate: "check:kernel-zero-runtime-deps",
  },
  "math-random-canonical-id-generation": {
    id: "math-random-canonical-id-generation",
    summary:
      "Canonical ULID bodies must use cryptographically strong randomness — not Math.random().",
    authority: "ADR-0021",
    enforcementGate: null,
  },
  "kernel-drizzle-schema-or-migration": {
    id: "kernel-drizzle-schema-or-migration",
    summary: "Kernel must not own Drizzle schema, migrations, or RLS policies.",
    authority: "PAS-001",
    enforcementGate: "quality:boundaries",
  },
  "human-reference-as-enterprise-id": {
    id: "human-reference-as-enterprise-id",
    summary:
      "Tenant human references (`EMP-000123`) must not share canonical enterprise ID types.",
    authority: "ADR-0023",
    enforcementGate: "check:tenant-human-reference-kernel-contract",
  },
  "kernel-human-reference-generation": {
    id: "kernel-human-reference-generation",
    summary:
      "Kernel must not generate or allocate tenant human reference numbers.",
    authority: "ADR-0023",
    enforcementGate: "check:tenant-human-reference-kernel-contract",
  },
  "enterprise-id-as-database-pk": {
    id: "enterprise-id-as-database-pk",
    summary: "Canonical enterprise IDs must not be PostgreSQL primary keys.",
    authority: "ADR-0022",
    enforcementGate: "check:database-enterprise-id-contract",
  },
  "foreign-key-to-enterprise-id": {
    id: "foreign-key-to-enterprise-id",
    summary:
      "Foreign keys must reference uuid PK columns — never `enterprise_id`.",
    authority: "ADR-0022",
    enforcementGate: "check:fk-uuid-only",
  },
  "rls-on-enterprise-id-or-human-reference": {
    id: "rls-on-enterprise-id-or-human-reference",
    summary:
      "RLS policies must use uuid tenant scope — not enterprise_id or human reference columns.",
    authority: "ADR-0022",
    enforcementGate: "check:rls-uuid-tenant-only",
  },
  "throwing-parser-for-ui-form-validation": {
    id: "throwing-parser-for-ui-form-validation",
    summary:
      "UI form validation should use non-throwing validators — not family `parse*` throw paths.",
    authority: "PAS-001",
    enforcementGate: null,
  },
} as const satisfies Record<
  IdentityProhibitedPatternId,
  IdentityProhibitedPatternDefinition
>;

export function isIdentityProhibitedPatternId(
  value: string
): value is IdentityProhibitedPatternId {
  return (IDENTITY_PROHIBITED_PATTERN_IDS as readonly string[]).includes(value);
}

export function isForbiddenPlatformFloorIdSymbol(
  value: string
): value is ForbiddenPlatformFloorIdSymbol {
  return (FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS as readonly string[]).includes(
    value
  );
}

export function getIdentityProhibitedPattern(
  id: IdentityProhibitedPatternId
): IdentityProhibitedPatternDefinition {
  return IDENTITY_PROHIBITED_PATTERNS[id];
}

export function listIdentityProhibitedPatternsWithGate(
  gateScript: string
): readonly IdentityProhibitedPatternDefinition[] {
  return IDENTITY_PROHIBITED_PATTERN_IDS.map(
    (id) => IDENTITY_PROHIBITED_PATTERNS[id]
  ).filter((entry) => entry.enforcementGate === gateScript);
}
