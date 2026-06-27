import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderCasualModulePageMdx } from "@/lib/docs-casual-feature-pages";
import { renderDeveloperModuleEvidenceMdx } from "@/lib/docs-developer-evidence-pages";
import {
  applyFeatureCoverageHardFail,
  buildDocsFeatureEvidenceGraph,
  buildDocsFeatureManifests,
  computeFeatureCoverageScore,
  listModuleManifests,
  validateFeatureCoverage,
} from "@/lib/docs-feature-manifest";
import { DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD } from "@/lib/docs-feature-manifest.contract";
import { bindOpenApiOperationsToManifests } from "@/lib/docs-openapi-manifest-bindings";
import { mergeFeatureManifestsWithPlatformApi } from "@/lib/docs-openapi-platform-manifests";
import type {
  AuthRoutesCatalog,
  ModulesCatalog,
  PermissionsCatalog,
  SystemAdminCatalog,
} from "@/lib/docs-product-catalog.contract";
import { discoverErpAppSurfaces, resolveDocsRepoRoot } from "@/lib/docs-repo-evidence";
import { docsDefaultLocale } from "@/lib/i18n";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";

const docsDataDir = join(resolveDocsRepoRoot(), "apps/docs/data");
const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

function readCatalog<T>(fileName: string): T {
  const path = join(docsDataDir, fileName);
  if (!existsSync(path)) {
    throw new Error(`Missing catalog ${path}. Run pnpm sync:product-docs first.`);
  }
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

describe("docs feature evidence", () => {
  it("builds eight module manifests from modules.catalog.json", () => {
    const modules = readCatalog<ModulesCatalog>("modules.catalog.json");
    const authRoutes = readCatalog<AuthRoutesCatalog>("auth-routes.catalog.json");
    const systemAdmin = readCatalog<SystemAdminCatalog>("system-admin.catalog.json");

    const manifests = buildDocsFeatureManifests({
      modules,
      authRoutes,
      systemAdmin,
    });

    expect(listModuleManifests(manifests)).toHaveLength(8);
    expect(manifests.some((manifest) => manifest.id === "inventory")).toBe(true);
    expect(manifests.some((manifest) => manifest.kind === "auth-lane")).toBe(
      true
    );
    expect(
      manifests.some((manifest) => manifest.kind === "admin-section")
    ).toBe(true);
  });

  it("passes hard coverage gate with zero warnings at threshold", () => {
    const modules = readCatalog<ModulesCatalog>("modules.catalog.json");
    const authRoutes = readCatalog<AuthRoutesCatalog>("auth-routes.catalog.json");
    const systemAdmin = readCatalog<SystemAdminCatalog>("system-admin.catalog.json");
    const permissions = readCatalog<PermissionsCatalog>("permissions.catalog.json");
    const surfaces = discoverErpAppSurfaces();
    const permissionKeys = permissions.permissions.map((entry) => entry.key);

    const compiled = buildDocsFeatureManifests({
      modules,
      authRoutes,
      systemAdmin,
    });
    const withPlatform = mergeFeatureManifestsWithPlatformApi({
      catalogManifests: compiled,
      root: resolveDocsRepoRoot(),
    });
    const bound = bindOpenApiOperationsToManifests({
      manifests: withPlatform,
      root: resolveDocsRepoRoot(),
    });
    const initial = validateFeatureCoverage({
      manifests: bound.manifests,
      surfaces,
      permissionKeys,
    });
    const score = computeFeatureCoverageScore({
      manifests: bound.manifests,
      surfaces,
      permissionKeys,
      result: initial,
    });
    const coverage = applyFeatureCoverageHardFail(initial, score);

    expect(score.score).toBeGreaterThanOrEqual(
      DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD
    );
    expect(coverage.errors).toEqual([]);
    expect(coverage.warnings).toEqual([]);
    expect(bound.warnings).toEqual([]);
  });

  it("renders casual pages without noIndex and developer pages with noIndex", () => {
    const modules = readCatalog<ModulesCatalog>("modules.catalog.json");
    const authRoutes = readCatalog<AuthRoutesCatalog>("auth-routes.catalog.json");
    const systemAdmin = readCatalog<SystemAdminCatalog>("system-admin.catalog.json");
    const manifests = buildDocsFeatureManifests({
      modules,
      authRoutes,
      systemAdmin,
    });
    const inventory = manifests.find((manifest) => manifest.id === "inventory");
    expect(inventory).toBeDefined();

    const bound = bindOpenApiOperationsToManifests({
      manifests: mergeFeatureManifestsWithPlatformApi({
        catalogManifests: manifests,
        root: resolveDocsRepoRoot(),
      }),
      root: resolveDocsRepoRoot(),
    });
    const boundInventory = bound.manifests.find((manifest) => manifest.id === "inventory");
    expect(boundInventory).toBeDefined();

    const casual = renderCasualModulePageMdx(inventory!);
    const developer = renderDeveloperModuleEvidenceMdx(
      boundInventory!,
      discoverErpAppSurfaces()
    );

    expect(casual).toContain("Inventory");
    expect(casual).not.toContain("noIndex:");
    expect(casual).not.toContain("apps/erp/src/app");
    expect(developer).toContain("noIndex: true");
    expect(developer).toContain("docsType: generated-evidence");
    expect(developer).toContain("## API operations");
  });

  it("serializes feature evidence graph with version 3", () => {
    const modules = readCatalog<ModulesCatalog>("modules.catalog.json");
    const authRoutes = readCatalog<AuthRoutesCatalog>("auth-routes.catalog.json");
    const systemAdmin = readCatalog<SystemAdminCatalog>("system-admin.catalog.json");
    const permissions = readCatalog<PermissionsCatalog>("permissions.catalog.json");
    const surfaces = discoverErpAppSurfaces();
    const permissionKeys = permissions.permissions.map((entry) => entry.key);

    const manifests = buildDocsFeatureManifests({
      modules,
      authRoutes,
      systemAdmin,
    });
    const initial = validateFeatureCoverage({
      manifests,
      surfaces,
      permissionKeys,
    });
    const score = computeFeatureCoverageScore({
      manifests,
      surfaces,
      permissionKeys,
      result: initial,
    });
    const coverage = applyFeatureCoverageHardFail(initial, score);
    const graph = buildDocsFeatureEvidenceGraph({ manifests, coverage, score });

    expect(graph.version).toBe(3);
    expect(graph.generated).toBe(true);
    expect(graph.manifests.length).toBeGreaterThan(0);
    expect(graph.permissionParityWarnings).toEqual([]);
    expect(graph.manifestApiOperationCounts.length).toBe(graph.manifests.length);
    expect(graph.coverageScore).toBeGreaterThanOrEqual(
      DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD
    );
  });

  it("writes searchable casual inventory page when sync has run", () => {
    const inventoryPath = join(contentRoot, "use-erp/modules/inventory.mdx");
    if (!existsSync(inventoryPath)) {
      return;
    }

    const source = readFileSync(inventoryPath, "utf8");
    expect(source).toContain("Inventory");
    expect(source).not.toContain("noIndex: true");
    expect(source).toContain("audience: end-user");
  });
});
