import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EntityGroupContext } from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../load-operating-context-ownership-interests.server.js", () => ({
  loadOperatingContextOwnershipInterests: vi.fn(),
}));

import { loadOperatingContextOwnershipInterests } from "../load-operating-context-ownership-interests.server";
import { resolveConsolidationScope } from "../resolve-consolidation-scope.server";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const SAMPLE_ENTITY_GROUP: EntityGroupContext = {
  entityGroupId: "group-1",
  tenantId: "tenant-1",
  slug: "acme-group",
  displayName: "Acme Group",
  parentLegalEntityId: null,
  status: "active",
};

const SAMPLE_OWNERSHIP_INTEREST = {
  ownershipInterestId: "oi-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  parentLegalEntityId: "parent-1",
  childLegalEntityId: "child-1",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control" as const,
  consolidationTreatment: "full_consolidation" as const,
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active" as const,
};

describe("resolveConsolidationScope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null scope and empty interests when entity group is absent", async () => {
    vi.mocked(loadOperatingContextOwnershipInterests).mockResolvedValueOnce([]);

    const result = await resolveConsolidationScope({
      tenantId: "tenant-1",
      entityGroup: null,
      reportingDate: "2026-06-01",
    });

    expect(loadOperatingContextOwnershipInterests).toHaveBeenCalledWith({
      tenantId: "tenant-1",
      entityGroupId: null,
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
      tenantId: "tenant-1",
      entityGroup: SAMPLE_ENTITY_GROUP,
      reportingDate: "2026-06-01",
    });

    expect(loadOperatingContextOwnershipInterests).toHaveBeenCalledWith({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      effectiveOn: "2026-06-01",
    });
    expect(result.ownershipInterests).toEqual([SAMPLE_OWNERSHIP_INTEREST]);
    expect(result.consolidationScope).toEqual({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      legalEntities: [
        {
          companyId: "child-1",
          consolidationTreatment: "full_consolidation",
          ownershipPercentage: 100,
        },
      ],
    });
  });
});

describe("resolveConsolidationScope — operating context wiring", () => {
  it("is invoked by the governed operating context resolver", () => {
    const source = readFileSync(
      join(contextRoot, "resolve-operating-context.server.ts"),
      "utf8"
    );

    expect(source).toContain("resolveConsolidationScope");
    expect(source).not.toContain("loadOperatingContextOwnershipInterests");
    expect(source).not.toContain("deriveConsolidationScopeContext");
  });
});
