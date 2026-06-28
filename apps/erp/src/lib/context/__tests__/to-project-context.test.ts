import type { ProjectLookupRow } from "@afenda/database";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { toProjectContext } from "../to-project-context";

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
const PROJECT_ENTERPRISE_ID = createTestEnterpriseId(
  "project",
  "01ARZ3NDEKTSV4RRFFQ69G5FCV"
);

describe("toProjectContext (ADR-0022 split-ID)", () => {
  it("brands enterpriseId as ProjectId — not uuid PK", () => {
    const row: ProjectLookupRow = {
      id: "990e8400-e29b-41d4-a716-446655440004",
      enterpriseId: PROJECT_ENTERPRISE_ID,
      tenantId: "550e8400-e29b-41d4-a716-446655440000",
      companyId: "660e8400-e29b-41d4-a716-446655440001",
      companyEnterpriseId: COMPANY_ENTERPRISE_ID,
      organizationUnitId: "770e8400-e29b-41d4-a716-446655440002",
      organizationUnitEnterpriseId: ORG_ENTERPRISE_ID,
      slug: "alpha-project",
      displayName: "Alpha Project",
      status: "active",
    };

    const project = toProjectContext(row, TENANT_ENTERPRISE_ID);

    expect(`${project.projectId}`).toBe(PROJECT_ENTERPRISE_ID);
    expect(`${project.projectId}`).not.toBe(row.id);
    expect(`${project.tenantId}`).toBe(TENANT_ENTERPRISE_ID);
    expect(`${project.companyId}`).toBe(COMPANY_ENTERPRISE_ID);
    expect(`${project.organizationUnitId}`).toBe(ORG_ENTERPRISE_ID);
  });
});
