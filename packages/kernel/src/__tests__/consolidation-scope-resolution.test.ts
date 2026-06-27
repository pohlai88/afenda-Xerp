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
  createTestEnterpriseId,
  parseEntityGroupId,
  parseTenantId,
} from "../identity/index.js";

const TENANT = createTestEnterpriseId("tenant");
const GROUP = createTestEnterpriseId("entityGroup");
const OI1 = createTestEnterpriseId("ownershipInterest");
const OI2 = createTestEnterpriseId(
  "ownershipInterest",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);
const PARENT = createTestEnterpriseId("company");
const CHILD1 = createTestEnterpriseId("company", "01ARZ3NDEKTSV4RRFFQ69G5FCV");
const CHILD2 = createTestEnterpriseId("company", "01ARZ3NDEKTSV4RRFFQ69G5FDV");

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
  "consolidation-scope-resolution.ts",
  "consolidation-scope-investee-merge.policy.ts",
  "consolidation-scope-context.contract.ts",
] as const;

const SAMPLE_OWNERSHIP_INTEREST: OwnershipInterestContext = {
  ownershipInterestId: OI1,
  tenantId: TENANT,
  entityGroupId: GROUP,
  parentLegalEntityId: PARENT,
  childLegalEntityId: CHILD1,
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

describe("consolidation-scope-resolution", () => {
  it("maps investee legal entities to consolidation treatments without arithmetic", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: TENANT,
      entityGroupId: GROUP,
      reportingDate: "2026-06-01",
      ownershipInterests: [
        SAMPLE_OWNERSHIP_INTEREST,
        {
          ...SAMPLE_OWNERSHIP_INTEREST,
          ownershipInterestId: OI2,
          childLegalEntityId: CHILD2,
          consolidationTreatment: "equity_method",
          ownershipPercentage: 30,
        },
      ],
    });

    expect(scope).toEqual({
      tenantId: TENANT,
      entityGroupId: GROUP,
      reportingDate: "2026-06-01",
      legalEntities: [
        {
          companyId: CHILD1,
          consolidationTreatment: "full_consolidation",
          ownershipPercentage: 100,
        },
        {
          companyId: CHILD2,
          consolidationTreatment: "equity_method",
          ownershipPercentage: 30,
        },
      ],
    });
  });

  it("excludes interests outside the reporting date window", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: TENANT,
      entityGroupId: GROUP,
      reportingDate: "2025-12-31",
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
    });

    expect(scope.legalEntities).toEqual([]);
  });

  it("accepts branded tenant and entity group ids without changing output", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: parseTenantId(TENANT),
      entityGroupId: parseEntityGroupId(GROUP),
      reportingDate: "2026-06-01",
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
    });

    expect(scope).toEqual({
      tenantId: TENANT,
      entityGroupId: GROUP,
      reportingDate: "2026-06-01",
      legalEntities: [
        {
          companyId: CHILD1,
          consolidationTreatment: "full_consolidation",
          ownershipPercentage: 100,
        },
      ],
    });
  });

  it("deduplicates investee legal entities by child company id (last-wins policy)", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: TENANT,
      entityGroupId: GROUP,
      reportingDate: "2026-06-01",
      ownershipInterests: [
        SAMPLE_OWNERSHIP_INTEREST,
        {
          ...SAMPLE_OWNERSHIP_INTEREST,
          ownershipInterestId: createTestEnterpriseId(
            "ownershipInterest",
            "01ARZ3NDEKTSV4RRFFQ69G5FEV"
          ),
          ownershipPercentage: 51,
        },
      ],
    });

    expect(CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY).toBe(
      "last_wins_by_input_order"
    );
    expect(scope.legalEntities).toEqual([
      {
        companyId: CHILD1,
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
