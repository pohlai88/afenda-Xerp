import { describe, expect, it } from "vitest";

import {
  verifyEntityGroupBoundary,
  verifyProjectBoundary,
} from "@/lib/context/operating-context.resolution.contract";

const TENANT_ID = "tenant-001";
const ENTITY_GROUP_ID = "group-001";
const COMPANY_PK = "660e8400-e29b-41d4-a716-446655440001";
const ORG_PK = "770e8400-e29b-41d4-a716-446655440002";
const PROJECT_PK = "880e8400-e29b-41d4-a716-446655440003";

describe("operating-context.resolution.contract", () => {
  describe("verifyEntityGroupBoundary", () => {
    it("allows legal entities without an entity group", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: null,
          entityGroupRow: null,
          tenantId: TENANT_ID,
        })
      ).toBeNull();
    });

    it("rejects missing entity group rows fail-closed", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: ENTITY_GROUP_ID,
          entityGroupRow: null,
          tenantId: TENANT_ID,
        })
      ).toEqual({
        code: "ENTITY_GROUP_NOT_FOUND",
        userMessage: "Corporate group for this legal entity was not found.",
      });
    });

    it("rejects entity groups outside tenant boundary", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: ENTITY_GROUP_ID,
          entityGroupRow: {
            id: ENTITY_GROUP_ID,
            enterpriseId: "entgrp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
            tenantId: "other-tenant",
            slug: "acme-group",
            displayName: "Acme Group",
            parentLegalEntityId: null,
            parentLegalEntityEnterpriseId: null,
            status: "active",
          },
          tenantId: TENANT_ID,
        })
      ).toEqual({
        code: "ENTITY_GROUP_SCOPE_MISMATCH",
        userMessage: "Corporate group does not belong to this tenant.",
      });
    });
  });

  describe("verifyProjectBoundary", () => {
    const activeProjectRow = {
      id: PROJECT_PK,
      enterpriseId: "prj_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      tenantId: TENANT_ID,
      companyId: COMPANY_PK,
      companyEnterpriseId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      organizationUnitId: ORG_PK,
      organizationUnitEnterpriseId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      slug: "alpha-project",
      displayName: "Alpha Project",
      status: "active" as const,
    };

    it("allows requests without project hints", () => {
      expect(
        verifyProjectBoundary({
          tenantId: TENANT_ID,
          companyId: COMPANY_PK,
          organizationId: null,
          projectRow: null,
        })
      ).toBeNull();
    });

    it("rejects missing project rows when a hint is present", () => {
      expect(
        verifyProjectBoundary({
          tenantId: TENANT_ID,
          companyId: COMPANY_PK,
          organizationId: null,
          projectSlug: "missing-project",
          projectRow: null,
        })
      ).toEqual({
        code: "PROJECT_NOT_FOUND",
        userMessage: "Selected project was not found in this workspace.",
      });
    });

    it("rejects projects outside tenant boundary", () => {
      expect(
        verifyProjectBoundary({
          tenantId: TENANT_ID,
          companyId: COMPANY_PK,
          organizationId: null,
          projectSlug: "alpha-project",
          projectRow: {
            ...activeProjectRow,
            tenantId: "other-tenant",
          },
        })
      ).toEqual({
        code: "PROJECT_SCOPE_MISMATCH",
        userMessage: "Project does not belong to this tenant.",
      });
    });

    it("rejects non-operational projects", () => {
      expect(
        verifyProjectBoundary({
          tenantId: TENANT_ID,
          companyId: COMPANY_PK,
          organizationId: null,
          projectSlug: "alpha-project",
          projectRow: {
            ...activeProjectRow,
            status: "draft",
          },
        })
      ).toEqual({
        code: "PROJECT_NOT_OPERATIONAL",
        userMessage:
          "Project is still in draft and workspace access is blocked.",
      });
    });

    it("allows active projects within scope", () => {
      expect(
        verifyProjectBoundary({
          tenantId: TENANT_ID,
          companyId: COMPANY_PK,
          organizationId: ORG_PK,
          projectSlug: "alpha-project",
          projectRow: activeProjectRow,
        })
      ).toBeNull();
    });
  });
});
