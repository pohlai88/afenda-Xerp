import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyFeatureCoverageHardFail,
  applyFeatureManifestOverrides,
  applyOpenApiBindingHardFail,
  applyPermissionParityHardFail,
  buildDocsFeatureEvidenceGraph,
  buildDocsFeatureManifests,
  computeFeatureCoverageScore,
  validateFeatureCoverage,
  validatePermissionOpenApiParity,
} from "../src/lib/docs-feature-manifest.ts";
import type {
  AuthRoutesCatalog,
  ModulesCatalog,
  PermissionsCatalog,
  SystemAdminCatalog,
} from "../src/lib/docs-product-catalog.contract.ts";
import type {
  FeatureCopyOverlay,
  FeatureManifestOverrides,
} from "../src/lib/docs-feature-manifest.contract.ts";
import { bindOpenApiOperationsToManifests } from "../src/lib/docs-openapi-manifest-bindings.ts";
import { mergeFeatureManifestsWithPlatformApi } from "../src/lib/docs-openapi-platform-manifests.ts";
import {
  discoverErpAppSurfaces,
  resolveDocsRepoRoot,
} from "../src/lib/docs-repo-evidence.ts";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const repoRoot = resolveDocsRepoRoot();
const docsDataDir = join(appDir, "data");

function readJson<T>(fileName: string): T {
  const path = join(docsDataDir, fileName);
  if (!existsSync(path)) {
    throw new Error(`Missing ${path}. Run pnpm sync:product-docs first.`);
  }
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function readOptionalOverlay(): FeatureCopyOverlay | undefined {
  const path = join(docsDataDir, "feature-copy.overlay.json");
  if (!existsSync(path)) {
    return undefined;
  }
  const payload = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !key.startsWith("_"))
  ) as FeatureCopyOverlay;
}

function readManifestOverrides(): FeatureManifestOverrides | undefined {
  const path = join(docsDataDir, "feature-manifest.overrides.json");
  if (!existsSync(path)) {
    return undefined;
  }
  const payload = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  const entries = Object.fromEntries(
    Object.entries(payload).filter(([key]) => !key.startsWith("_"))
  ) as FeatureManifestOverrides;
  return Object.keys(entries).length > 0 ? entries : undefined;
}

function main(): void {
  const modules = readJson<ModulesCatalog>("modules.catalog.json");
  const authRoutes = readJson<AuthRoutesCatalog>("auth-routes.catalog.json");
  const systemAdmin = readJson<SystemAdminCatalog>("system-admin.catalog.json");
  const permissions = readJson<PermissionsCatalog>("permissions.catalog.json");
  const overlay = readOptionalOverlay();
  const overrides = readManifestOverrides();

  const surfaces = discoverErpAppSurfaces(repoRoot);
  const permissionKeys = permissions.permissions.map((entry) => entry.key);

  const compiled = buildDocsFeatureManifests({
    modules,
    authRoutes,
    systemAdmin,
    overlay,
  });
  const withOverrides = applyFeatureManifestOverrides(compiled, overrides);
  const withPlatform = mergeFeatureManifestsWithPlatformApi({
    catalogManifests: withOverrides,
    root: repoRoot,
  });
  const openApiBinding = bindOpenApiOperationsToManifests({
    manifests: withPlatform,
    root: repoRoot,
  });

  const initialCoverage = validateFeatureCoverage({
    manifests: openApiBinding.manifests,
    surfaces,
    permissionKeys,
  });
  const score = computeFeatureCoverageScore({
    manifests: openApiBinding.manifests,
    surfaces,
    permissionKeys,
    result: initialCoverage,
  });
  const coverage = applyFeatureCoverageHardFail(initialCoverage, score);
  const openApiBindingErrors = applyOpenApiBindingHardFail({
    warnings: openApiBinding.warnings,
    score,
  });
  const permissionParity = validatePermissionOpenApiParity(openApiBinding.manifests);
  const permissionParityErrors = applyPermissionParityHardFail({
    warnings: permissionParity.warnings,
    score: score.score,
  });

  console.log(
    `[check:feature-evidence-coverage] score=${score.score.toFixed(3)} failed=${score.failedChecks}/${score.totalChecks} openapiWarnings=${openApiBinding.warnings.length} permissionParityWarnings=${permissionParity.warnings.length}`
  );

  if (coverage.warnings.length > 0) {
    for (const warning of coverage.warnings) {
      console.warn(`[check:feature-evidence-coverage] ${warning}`);
    }
  }

  if (openApiBinding.warnings.length > 0) {
    for (const warning of openApiBinding.warnings) {
      console.warn(`[check:feature-evidence-coverage] openapi: ${warning}`);
    }
  }

  if (coverage.errors.length > 0 || openApiBindingErrors.length > 0) {
    throw new Error([...coverage.errors, ...openApiBindingErrors].join("\n"));
  }

  const graph = buildDocsFeatureEvidenceGraph({
    manifests: openApiBinding.manifests,
    coverage,
    score,
    openApiBindingWarnings: openApiBinding.warnings,
  });

  if (graph.version !== 2) {
    throw new Error("Expected feature evidence graph version 2.");
  }

  console.log("[check:feature-evidence-coverage] pass");
}

main();
