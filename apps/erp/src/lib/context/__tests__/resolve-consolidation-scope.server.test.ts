import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EntityGroupContext } from "@afenda/kernel";
import {
  createTestEnterpriseId,
  parseOwnershipInterestContext,
} from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../load-operating-context-ownership-interests.server.js", () => ({
  loadOperatingContextOwnershipInterests: vi.fn(),
}));

import { loadOperatingContextOwnershipInterests } from "../load-operating-context-ownership-interests.server";
import { resolveConsolidationScope } from "../resolve-consolidation-scope.server";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const TEST_TENANT_PK = "550e8400-e29b-41d4-a716-446655440000";
const TEST_ENTITY_GROUP_PK = "770e8400-e29b-41d4-a716-446655440002";
const TEST_TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TEST_ENTITY_GROUP_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TEST_PARENT_COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TEST_CHILD_COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);

const SAMPLE_ENTITY_GROUP: EntityGroupContext = {
  entityGroupId: TEST_ENTITY_GROUP_ID,
  tenantId: TEST_TENANT_ID,
  slug: "acme-group",
  displayName: "Acme Group",
  parentLegalEntityId: null,
  status: "active",
};

const SAMPLE_OWNERSHIP_INTEREST = parseOwnershipInterestContext({
  ownershipInterestId: createTestEnterpriseId(
    "ownershipInterest",
    "01ARZ3NDEKTSV4RRFFQ69G5FAV"
  ),
  tenantId: TEST_TENANT_ID,
  entityGroupId: TEST_ENTITY_GROUP_ID,
  parentLegalEntityId: TEST_PARENT_COMPANY_ID,
  childLegalEntityId: TEST_CHILD_COMPANY_ID,
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
});

describe("resolveConsolidationScope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null scope and empty interests when entity group is absent", async () => {
    vi.mocked(loadOperatingContextOwnershipInterests).mockResolvedValueOnce([]);

    const result = await resolveConsolidationScope({
      tenantEnterpriseId: TEST_TENANT_ID,
      tenantPk: TEST_TENANT_PK,
      entityGroup: null,
      entityGroupPk: null,
      reportingDate: "2026-06-01",
    });

    expect(loadOperatingContextOwnershipInterests).toHaveBeenCalledWith({
      tenantPk: TEST_TENANT_PK,
      entityGroupPk: null,
      effectiveOn: "2026-06-01",
    });
    expect(result).toEqual({
      consolidationScope: null,
      ownershipInterests: [],
    });
  });

  it("loads ownership interests and derives consolidation scope metadata", async () => {
    vi.mocked(loadOperatingContextOwnershipInterests).mockResolvedValueOnce([
      SAMPLE_OWNERSHIP_INTEREST,
    ]);

    const result = await resolveConsolidationScope({
      tenantEnterpriseId: TEST_TENANT_ID,
      tenantPk: TEST_TENANT_PK,
      entityGroup: SAMPLE_ENTITY_GROUP,
      entityGroupPk: TEST_ENTITY_GROUP_PK,
      reportingDate: "2026-06-01",
    });

    expect(loadOperatingContextOwnershipInterests).toHaveBeenCalledWith({
      tenantPk: TEST_TENANT_PK,
      entityGroupPk: TEST_ENTITY_GROUP_PK,
      effectiveOn: "2026-06-01",
    });
    expect(result.ownershipInterests).toEqual([SAMPLE_OWNERSHIP_INTEREST]);
    expect(result.consolidationScope).toEqual({
      tenantId: TEST_TENANT_ID,
      entityGroupId: TEST_ENTITY_GROUP_ID,
      reportingDate: "2026-06-01",
      legalEntities: [
        {
          companyId: TEST_CHILD_COMPANY_ID,
          consolidationTreatment: "full_consolidation",
          ownershipPercentage: 100,
        },
      ],
    });
  });
});

describe("resolveConsolidationScope — operating context wiring", () => {
  it("is implemented as a dedicated spine module", () => {
    const moduleSource = readFileSync(
      join(contextRoot, "resolve-consolidation-scope.server.ts"),
      "utf8"
    );
    const buildSource = readFileSync(
      join(contextRoot, "build-operating-context-from-database.server.ts"),
      "utf8"
    );

    expect(moduleSource).toContain("resolveConsolidationScope");
    expect(moduleSource).toContain("loadOperatingContextOwnershipInterests");
    expect(moduleSource).toContain("deriveConsolidationScopeContext");
    expect(buildSource).toContain("resolveConsolidationScope");
  });
});
