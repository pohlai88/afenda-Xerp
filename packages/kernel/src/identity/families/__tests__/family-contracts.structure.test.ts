import { describe, expect, it } from "vitest";

import {
  ENTERPRISE_ID_FAMILY_KEYS,
  getEnterpriseIdFamiliesByCategory,
  ID_FAMILY_CATEGORIES,
} from "../../registry/id-family.registry.js";
import {
  type EnterpriseBrand,
  parseAuditEventId,
  parseCorrelationId,
  parseCustomerId,
  parseExecutionId,
  parseMembershipId,
  parseOwnershipInterestId,
  parsePermissionId,
  parsePolicyId,
  parseProductId,
  parseRoleId,
  parseTenantId,
  parseUserId,
} from "../index.js";

const ENTERPRISE_ID_FAMILY_CATEGORIES = [
  ID_FAMILY_CATEGORIES.tenantHierarchy,
  ID_FAMILY_CATEGORIES.identityAccess,
  ID_FAMILY_CATEGORIES.auditExecution,
  ID_FAMILY_CATEGORIES.enterpriseHierarchy,
  ID_FAMILY_CATEGORIES.businessReference,
] as const;

describe("family contract structure (PAS-001 §4.1.4)", () => {
  it("covers all 22 enterprise families across five category files", () => {
    expect(ENTERPRISE_ID_FAMILY_KEYS).toHaveLength(22);

    const byCategory = ENTERPRISE_ID_FAMILY_CATEGORIES.map((category) => ({
      category,
      families: getEnterpriseIdFamiliesByCategory(category),
    }));

    expect(byCategory).toEqual([
      {
        category: "tenant-hierarchy",
        families: [
          "tenant",
          "entityGroup",
          "company",
          "organization",
          "team",
          "project",
        ],
      },
      {
        category: "identity-access",
        families: ["user", "role", "membership", "permission", "policy"],
      },
      {
        category: "audit-execution",
        families: ["auditEvent", "execution", "correlation"],
      },
      {
        category: "enterprise-hierarchy",
        families: ["ownershipInterest"],
      },
      {
        category: "business-reference",
        families: [
          "customer",
          "supplier",
          "product",
          "employee",
          "warehouse",
          "document",
          "asset",
        ],
      },
    ]);
  });

  it("exports a representative parse* from each category via the families barrel", () => {
    expect(parseTenantId("ten_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseUserId("usr_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseAuditEventId("aud_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "aud_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseOwnershipInterestId("own_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "own_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseProductId("prd_01ARZ3NDEKTSV4RRFFQ69G5FBV")).toBe(
      "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV"
    );
  });

  it("re-exports identity-access, audit, and business-reference parsers from barrel", () => {
    expect(parseRoleId("rol_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "rol_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseExecutionId("exe_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "exe_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseCustomerId("cus_01ARZ3NDEKTSV4RRFFQ69G5FCV")).toBe(
      "cus_01ARZ3NDEKTSV4RRFFQ69G5FCV"
    );
    expect(parseMembershipId("mem_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "mem_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parsePermissionId("per_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "per_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parsePolicyId("pol_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "pol_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    expect(parseCorrelationId("cor_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
  });

  it("keeps EnterpriseBrand serializable as plain string on the wire", () => {
    type TenantBrand = EnterpriseBrand<"tenant">;
    const tenantId: TenantBrand = parseTenantId(
      "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );

    expect(JSON.parse(JSON.stringify({ tenantId }))).toEqual({
      tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
    });
  });
});
