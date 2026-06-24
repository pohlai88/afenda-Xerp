import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY,
  deriveConsolidationScopeContext,
  type OwnershipInterestContext,
} from "../context/index.js";
import {
  brandEntityGroupId,
  brandTenantId,
} from "../contracts/platform-id.contract.js";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "../context");

const FORBIDDEN_ACCOUNTING_PATTERNS = [
  /journal\.post/i,
  /insertJournal/i,
  /postJournal/i,
  /\bledger\b/i,
  /consolidationElimination/i,
  /general_ledger/i,
  /chart_of_accounts/i,
  /@afenda\/accounting/,
] as const;

const CONSOLIDATION_RESOLVER_FILES = [
  "consolidation-scope-resolution.server.ts",
  "consolidation-scope-investee-merge.policy.ts",
  "consolidation-scope-context.contract.ts",
] as const;

const SAMPLE_OWNERSHIP_INTEREST: OwnershipInterestContext = {
  ownershipInterestId: "oi-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  parentLegalEntityId: "parent-1",
  childLegalEntityId: "child-1",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

describe("consolidation-scope-resolution.server", () => {
  it("maps investee legal entities to consolidation treatments without arithmetic", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      ownershipInterests: [
        SAMPLE_OWNERSHIP_INTEREST,
        {
          ...SAMPLE_OWNERSHIP_INTEREST,
          ownershipInterestId: "oi-2",
          childLegalEntityId: "child-2",
          consolidationTreatment: "equity_method",
          ownershipPercentage: 30,
        },
      ],
    });

    expect(scope).toEqual({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      legalEntities: [
        {
          companyId: "child-1",
          consolidationTreatment: "full_consolidation",
          ownershipPercentage: 100,
        },
        {
          companyId: "child-2",
          consolidationTreatment: "equity_method",
          ownershipPercentage: 30,
        },
      ],
    });
  });

  it("excludes interests outside the reporting date window", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2025-12-31",
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
    });

    expect(scope.legalEntities).toEqual([]);
  });

  it("accepts branded tenant and entity group ids without changing output", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: brandTenantId("tenant-1")!,
      entityGroupId: brandEntityGroupId("group-1")!,
      reportingDate: "2026-06-01",
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
    });

    expect(scope).toEqual({
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

  it("deduplicates investee legal entities by child company id (last-wins policy)", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      ownershipInterests: [
        SAMPLE_OWNERSHIP_INTEREST,
        {
          ...SAMPLE_OWNERSHIP_INTEREST,
          ownershipInterestId: "oi-duplicate",
          ownershipPercentage: 51,
        },
      ],
    });

    expect(CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY).toBe(
      "last_wins_by_input_order"
    );
    expect(scope.legalEntities).toEqual([
      {
        companyId: "child-1",
        consolidationTreatment: "full_consolidation",
        ownershipPercentage: 51,
      },
    ]);
  });
});

describe("consolidation-scope-resolution — accounting-readiness guard", () => {
  it("does not introduce journal, ledger, or accounting package references", () => {
    const violations: string[] = [];

    for (const fileName of CONSOLIDATION_RESOLVER_FILES) {
      const content = readFileSync(join(contextRoot, fileName), "utf8");
      for (const pattern of FORBIDDEN_ACCOUNTING_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${fileName} matched ${pattern.source}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
