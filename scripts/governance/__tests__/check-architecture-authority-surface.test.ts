import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { dependencyContract } from "../../../packages/architecture-authority/src/data/dependency-registry.data.ts";
import {
  ARCHITECTURE_DOC_SYNC_COMMANDS,
  ERP_FORBIDDEN_PERMISSION_ENGINE_SYMBOLS,
  LAYER_DOC_DISPLAY_OVERRIDES,
  MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES,
} from "../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts";
import {
  checkArchitectureAuthoritySurface,
  formatArchitectureAuthoritySurfaceViolations,
} from "../check-architecture-authority-surface.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-architecture-authority-surface script", () => {
  it("passes on the current repository state", async () => {
    const violations = await checkArchitectureAuthoritySurface();
    expect(
      violations,
      formatArchitectureAuthoritySurfaceViolations(violations)
    ).toEqual([]);
  });

  it("documents multi-tenancy forbidden edges for appshell authority boundary", () => {
    const forbiddenTargets = MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES.map(
      (edge) => edge.to
    );

    expect(forbiddenTargets).toContain("@afenda/database");
    expect(forbiddenTargets).toContain("@afenda/permissions");
  });

  it("delegates §432–445 runtime enforcement to dependency-rules gate", () => {
    const architectureGate = readFileSync(
      join(
        repoRoot,
        "scripts/governance/check-architecture-authority-surface.mts"
      ),
      "utf8"
    );

    expect(architectureGate).toContain(
      "check-multi-tenancy-dependency-rules.mts"
    );
    expect(architectureGate).not.toContain(
      "MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES"
    );
  });

  it("documents permissions→kernel as an approved registry edge (Foundation phase 07)", () => {
    const permissionsKernel = dependencyContract.runtimeEdges.find(
      (edge) =>
        edge.from === "@afenda/permissions" && edge.to === "@afenda/kernel"
    );

    expect(permissionsKernel).toBeDefined();
    expect(
      dependencyContract.approvedRuntimeByPackage["@afenda/permissions"]
    ).toContain("@afenda/kernel");
  });

  it("accepts typescript-config Platform (tooling) layer doc variant", () => {
    const layerDoc = readFileSync(
      join(repoRoot, "docs/architecture/layer-registry.md"),
      "utf8"
    );

    for (const label of LAYER_DOC_DISPLAY_OVERRIDES[
      "@afenda/typescript-config"
    ] ?? []) {
      expect(layerDoc).toContain(`| \`@afenda/typescript-config\` | ${label}`);
    }
  });

  it("does not treat ERP permission orchestration helpers as duplicate engines", () => {
    const authorizeRoute = readFileSync(
      join(repoRoot, "apps/erp/src/lib/api/authorize-api-route.ts"),
      "utf8"
    );

    expect(authorizeRoute).toContain("evaluatePermissionAndPolicy");
    for (const symbol of ERP_FORBIDDEN_PERMISSION_ENGINE_SYMBOLS) {
      if (symbol === "export const PERMISSION_REGISTRY") {
        expect(authorizeRoute).not.toMatch(
          /export\s+const\s+PERMISSION_REGISTRY\b/
        );
      }
    }
  });

  it("surfaces doc sync remediation commands in registry", () => {
    expect(ARCHITECTURE_DOC_SYNC_COMMANDS.dependencySnapshot).toBe(
      "pnpm architecture:dependencies"
    );
    expect(ARCHITECTURE_DOC_SYNC_COMMANDS.architectureValidation).toBe(
      "pnpm quality:architecture"
    );
  });

  it("reports violations with actionable rule ids", async () => {
    const violations = await checkArchitectureAuthoritySurface();
    const formatted = formatArchitectureAuthoritySurfaceViolations(violations);

    if (violations.length > 0) {
      expect(formatted).toMatch(
        /\[(required-module-missing|doc-dependency-drift|doc-dependency-summary-drift|registry-export-drift|stale-dist|unapproved-afenda-dependency)\]/
      );
    }
  });
});
