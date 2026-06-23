import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { dependencyContract } from "../../../packages/architecture-authority/src/data/dependency-registry.data.ts";
import {
  ERP_PERMISSION_ENGINE_ORCHESTRATION_RELATIVE_PATHS,
  MULTI_TENANCY_AUTHORITY_OWNERS,
  MULTI_TENANCY_DEPENDENCY_DOC_MARKERS,
  MULTI_TENANCY_DEPENDENCY_RULES_SURFACE_RULE,
  MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES,
  MULTI_TENANCY_GATE_OWNERSHIP,
  MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES,
} from "../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts";
import {
  checkMultiTenancyDependencyRules,
  formatMultiTenancyDependencyRulesViolations,
} from "../check-multi-tenancy-dependency-rules.mts";
import { formatArchitectureValidationRemediation } from "../lib/multi-tenancy-dependency-enforcement.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-dependency-rules script", () => {
  it("passes on the current repository state", async () => {
    const violations = await checkMultiTenancyDependencyRules();
    expect(
      violations,
      formatMultiTenancyDependencyRulesViolations(violations)
    ).toEqual([]);
  });

  it("documents all authority owners from multi-tenancy.md §432–439", () => {
    const owners = MULTI_TENANCY_AUTHORITY_OWNERS.map((entry) => entry.owner);

    expect(owners).toContain("@afenda/kernel");
    expect(owners).toContain("@afenda/database");
    expect(owners).toContain("apps/erp");
    expect(owners).toContain("@afenda/permissions");
    expect(owners).toContain("@afenda/observability");
    expect(owners).toContain("@afenda/appshell");
    expect(owners).toHaveLength(6);
  });

  it("forbids appshell database and permissions authority edges", () => {
    const forbiddenTargets = MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES.map(
      (edge) => edge.to
    );

    expect(forbiddenTargets).toContain("@afenda/database");
    expect(forbiddenTargets).toContain("@afenda/permissions");
  });

  it("requires erp→kernel as an approved registry edge (multi-tenancy.md line 445)", () => {
    const erpKernel = MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES.find(
      (edge) => edge.from === "@afenda/erp" && edge.to === "@afenda/kernel"
    );

    expect(erpKernel).toBeDefined();
    expect(
      dependencyContract.approvedRuntimeByPackage["@afenda/erp"]
    ).toContain("@afenda/kernel");
    expect(
      dependencyContract.runtimeEdges.some(
        (edge) => edge.from === "@afenda/erp" && edge.to === "@afenda/kernel"
      )
    ).toBe(true);
  });

  it("aligns multi-tenancy.md dependency markers with architecture registry", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DEPENDENCY_DOC_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("declares gate ownership split between dependency-rules and architecture-authority", () => {
    expect(MULTI_TENANCY_GATE_OWNERSHIP.dependencyRules).toBe(
      "scripts/governance/check-multi-tenancy-dependency-rules.mts"
    );
    expect(MULTI_TENANCY_GATE_OWNERSHIP.architectureAuthority).toBe(
      "scripts/governance/check-architecture-authority-surface.mts"
    );
  });

  it("excludes ERP permission orchestration adapters from duplication scan", () => {
    expect(ERP_PERMISSION_ENGINE_ORCHESTRATION_RELATIVE_PATHS).toContain(
      "apps/erp/src/lib/api/authorize-api-route.ts"
    );

    const authorizeRoute = readFileSync(
      join(repoRoot, "apps/erp/src/lib/api/authorize-api-route.ts"),
      "utf8"
    );
    expect(authorizeRoute).toContain("evaluatePermissionAndPolicy");
  });

  it("maps architecture validation failures to registry remediation hints", () => {
    const hint = formatArchitectureValidationRemediation({
      gate: "dependencies",
      packageName: "@afenda/erp",
      message: "unapproved runtime dependency @afenda/erp → @afenda/example",
    });

    expect(hint).toContain("dependency-registry.data.ts");
    expect(hint).toContain('["@afenda/erp", "@afenda/example"]');
    expect(hint).toContain("pnpm architecture:dependencies");
  });

  it("declares the dependency-rules surface rule in registry source", () => {
    const registrySource = readFileSync(
      join(
        repoRoot,
        "packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts"
      ),
      "utf8"
    );

    expect(registrySource).toContain(
      MULTI_TENANCY_DEPENDENCY_RULES_SURFACE_RULE
    );
  });

  it("reports violations with actionable rule ids", async () => {
    const violations = await checkMultiTenancyDependencyRules();
    const formatted = formatMultiTenancyDependencyRulesViolations(violations);

    if (violations.length > 0) {
      expect(formatted).toMatch(
        /\[(multi-tenancy-forbidden-edge|required-registry-edge-missing|architecture-validation|erp-permission-engine-duplication|stale-dist)\]/
      );
    }
  });
});
