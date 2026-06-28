import type {
  CompanyLookupRow,
  EntityGroupLookupRow,
  OrganizationLookupRow,
  TenantLookupRow,
} from "@afenda/database";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  toEntityGroupContext,
  toLegalEntityContext,
  toOrganizationUnitContext,
  toTeamContext,
  toTenantContext,
} from "../operating-context.mappers";

const TENANT_ENTERPRISE_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const COMPANY_ENTERPRISE_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5C02"
);
const ORG_ENTERPRISE_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);
const ENTITY_GROUP_ENTERPRISE_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FCV"
);
const PARENT_COMPANY_ENTERPRISE_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FDV"
);
const PARENT_ORG_ENTERPRISE_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FEW"
);
const PARENT_ORG_PK = "660e8400-e29b-41d4-a716-446655440005";

describe("toTenantContext (ADR-0022 split-ID)", () => {
  it("brands enterpriseId as TenantId — not uuid PK", () => {
    const row: TenantLookupRow = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      enterpriseId: TENANT_ENTERPRISE_ID,
      slug: "dev-local",
      name: "Dev Local Workspace",
      status: "active",
    };

    const tenant = toTenantContext(row);

    expect(`${tenant.tenantId}`).toBe(TENANT_ENTERPRISE_ID);
    expect(`${tenant.tenantId}`).not.toBe(row.id);
  });
});

describe("toLegalEntityContext (ADR-0022 split-ID)", () => {
  it("brands enterpriseId as CompanyId — not uuid PK", () => {
    const row: CompanyLookupRow = {
      id: "660e8400-e29b-41d4-a716-446655440001",
      enterpriseId: COMPANY_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      entityGroupId: null,
      entityGroupEnterpriseId: null,
      slug: "dev-company",
      legalName: "Dev Company Pty Ltd",
      displayName: "Dev Company",
      registrationNumber: "DEV-001",
      taxId: null,
      baseCurrency: "AUD",
      countryCode: "AU",
      companyType: "standalone",
      fiscalCalendarId: null,
      effectiveFrom: null,
      effectiveTo: null,
      status: "active",
    };

    const legalEntity = toLegalEntityContext(row, TENANT_ENTERPRISE_ID);

    expect(`${legalEntity.companyId}`).toBe(COMPANY_ENTERPRISE_ID);
    expect(`${legalEntity.companyId}`).not.toBe(row.id);
  });
});

describe("toOrganizationUnitContext (ADR-0022 split-ID)", () => {
  it("brands organization and company enterprise IDs — not uuid PKs", () => {
    const row: OrganizationLookupRow = {
      id: "770e8400-e29b-41d4-a716-446655440002",
      enterpriseId: ORG_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      companyId: "660e8400-e29b-41d4-a716-446655440001",
      companyEnterpriseId: COMPANY_ENTERPRISE_ID,
      slug: "finance",
      name: "Finance",
      type: "department",
      parentOrganizationEnterpriseId: null,
      parentOrganizationId: null,
      status: "active",
      effectiveFrom: null,
      effectiveTo: null,
    };

    const organizationUnit = toOrganizationUnitContext(
      row,
      TENANT_ENTERPRISE_ID
    );

    expect(`${organizationUnit.organizationUnitId}`).toBe(ORG_ENTERPRISE_ID);
    expect(`${organizationUnit.organizationUnitId}`).not.toBe(row.id);
    expect(`${organizationUnit.companyId}`).toBe(COMPANY_ENTERPRISE_ID);
    expect(`${organizationUnit.companyId}`).not.toBe(row.companyId);
  });

  it("brands parent organization enterprise ID — not uuid FK", () => {
    const row: OrganizationLookupRow = {
      id: "770e8400-e29b-41d4-a716-446655440006",
      enterpriseId: ORG_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      companyId: "660e8400-e29b-41d4-a716-446655440001",
      companyEnterpriseId: COMPANY_ENTERPRISE_ID,
      slug: "finance-sub",
      name: "Finance Sub",
      type: "department",
      parentOrganizationId: PARENT_ORG_PK,
      parentOrganizationEnterpriseId: PARENT_ORG_ENTERPRISE_ID,
      status: "active",
      effectiveFrom: null,
      effectiveTo: null,
    };

    const organizationUnit = toOrganizationUnitContext(
      row,
      TENANT_ENTERPRISE_ID
    );

    expect(`${organizationUnit.parentOrganizationUnitId}`).toBe(
      PARENT_ORG_ENTERPRISE_ID
    );
    expect(`${organizationUnit.parentOrganizationUnitId}`).not.toBe(
      row.parentOrganizationId
    );
  });
});

describe("toEntityGroupContext (ADR-0022 split-ID)", () => {
  it("brands entity group and parent legal entity enterprise IDs — not uuid PKs", () => {
    const row: EntityGroupLookupRow = {
      id: "880e8400-e29b-41d4-a716-446655440003",
      enterpriseId: ENTITY_GROUP_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      slug: "dev-group",
      displayName: "Dev Group",
      parentLegalEntityId: "660e8400-e29b-41d4-a716-446655440001",
      parentLegalEntityEnterpriseId: PARENT_COMPANY_ENTERPRISE_ID,
      status: "active",
    };

    const entityGroup = toEntityGroupContext(row, TENANT_ENTERPRISE_ID);

    expect(`${entityGroup.entityGroupId}`).toBe(ENTITY_GROUP_ENTERPRISE_ID);
    expect(`${entityGroup.entityGroupId}`).not.toBe(row.id);
    expect(`${entityGroup.parentLegalEntityId}`).toBe(
      PARENT_COMPANY_ENTERPRISE_ID
    );
    expect(`${entityGroup.parentLegalEntityId}`).not.toBe(
      row.parentLegalEntityId
    );
  });

  it("leaves parentLegalEntityId null when parent is absent", () => {
    const row: EntityGroupLookupRow = {
      id: "880e8400-e29b-41d4-a716-446655440004",
      enterpriseId: ENTITY_GROUP_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      slug: "standalone-group",
      displayName: "Standalone Group",
      parentLegalEntityId: null,
      parentLegalEntityEnterpriseId: null,
      status: "active",
    };

    const entityGroup = toEntityGroupContext(row, TENANT_ENTERPRISE_ID);

    expect(entityGroup.parentLegalEntityId).toBeNull();
  });
});

describe("toTeamContext (ADR-0022 org-backed wire)", () => {
  it("derives team authority from branded organization unit context — org_* as TeamAuthorityId", () => {
    const row: OrganizationLookupRow = {
      id: "770e8400-e29b-41d4-a716-446655440002",
      enterpriseId: ORG_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      companyId: "660e8400-e29b-41d4-a716-446655440001",
      companyEnterpriseId: COMPANY_ENTERPRISE_ID,
      slug: "finance",
      name: "Finance",
      type: "department",
      parentOrganizationEnterpriseId: null,
      parentOrganizationId: null,
      status: "active",
      effectiveFrom: null,
      effectiveTo: null,
    };

    const organizationUnit = toOrganizationUnitContext(
      row,
      TENANT_ENTERPRISE_ID
    );
    const team = toTeamContext(organizationUnit);

    expect(`${team.teamId}`).toBe(ORG_ENTERPRISE_ID);
    expect(`${team.teamId}`).not.toBe(row.id);
    expect(`${team.organizationUnitId}`).toBe(ORG_ENTERPRISE_ID);
    expect(`${team.companyId}`).toBe(COMPANY_ENTERPRISE_ID);
    expect(`${team.companyId}`).not.toBe(row.companyId);
  });
});
