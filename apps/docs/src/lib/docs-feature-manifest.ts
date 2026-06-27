import type { DocsAppSurface } from "@/lib/docs-repo-evidence";
import type {
  DocsFeatureCoverageScore,
  DocsFeatureEvidenceGraph,
  DocsFeatureManifest,
  DocsFeatureManifestInput,
  FeatureManifestOverrides,
} from "@/lib/docs-feature-manifest.contract";
import {
  DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD,
  docsFeatureManifestSchema,
  featureManifestOverrideEntrySchema,
} from "@/lib/docs-feature-manifest.contract";

/** ERP dev/demo routes excluded from coverage warnings. */
export const DOCS_FEATURE_COVERAGE_ALLOWLIST = [
  "/appshell-canvas",
  "/appshell-demo",
  "/governance-integration",
  "/metadata-workspace",
] as const;

const AUTH_LANE_SUMMARIES: Record<string, string> = {
  access: "Sign-in, sign-up, and one-time password entry.",
  verify: "Email verification before the workspace opens.",
  recover: "Forgot-password and reset-password flows.",
  invite: "User invitations and acceptance.",
  workspace: "Workspace and organization selection after authentication.",
  security: "MFA, session expiry, and access-denied handling.",
};

const MODULE_SUMMARY_DEFAULT = (label: string): string =>
  `Governed ${label} module in Afenda ERP — open the module route after sign-in when your tenant grants access.`;

function overlaySummary(
  overlay: DocsFeatureManifestInput["overlay"],
  id: string,
  fallback: string
): string {
  return overlay?.[id]?.summary ?? fallback;
}

function overlayTitle(
  overlay: DocsFeatureManifestInput["overlay"],
  id: string,
  fallback: string
): string {
  return overlay?.[id]?.title ?? fallback;
}

function buildModuleManifests(
  input: DocsFeatureManifestInput
): DocsFeatureManifest[] {
  return input.modules.modules.map((module) => {
    const entitlements = [
      ...module.requiredEntitlements,
      ...module.optionalCapabilities.map(
        (capability) => `capability:${capability}`
      ),
    ];

    return docsFeatureManifestSchema.parse({
      id: module.moduleId,
      kind: "module",
      title: overlayTitle(input.overlay, module.moduleId, module.label),
      audience: "end-user",
      summary: overlaySummary(
        input.overlay,
        module.moduleId,
        MODULE_SUMMARY_DEFAULT(module.label)
      ),
      productRoutes: [module.routePath],
      permissionKeys: [module.permissionKey],
      entitlements,
      catalogSources: ["modules"],
    });
  });
}

function buildAuthLaneManifests(
  input: DocsFeatureManifestInput
): DocsFeatureManifest[] {
  const routesByLane = new Map<string, string[]>();

  for (const route of input.authRoutes.routes) {
    const existing = routesByLane.get(route.lane) ?? [];
    existing.push(route.path);
    routesByLane.set(route.lane, existing);
  }

  return input.authRoutes.lanes.map((lane) => {
    const id = `auth-lane-${lane}`;
    const routes = (routesByLane.get(lane) ?? []).sort();

    return docsFeatureManifestSchema.parse({
      id,
      kind: "auth-lane",
      title: overlayTitle(
        input.overlay,
        id,
        `${lane.charAt(0).toUpperCase()}${lane.slice(1)} auth lane`
      ),
      audience: "end-user",
      summary: overlaySummary(
        input.overlay,
        id,
        AUTH_LANE_SUMMARIES[lane] ??
          `Authentication URLs grouped under the ${lane} lane.`
      ),
      productRoutes: routes,
      permissionKeys: [],
      entitlements: [],
      catalogSources: ["auth-routes"],
    });
  });
}

function buildAdminSectionManifests(
  input: DocsFeatureManifestInput
): DocsFeatureManifest[] {
  return input.systemAdmin.sections.map((section) => {
    const id = `admin-${section.sectionId}`;

    return docsFeatureManifestSchema.parse({
      id,
      kind: "admin-section",
      title: overlayTitle(input.overlay, id, section.label),
      audience: "tenant-admin",
      summary: overlaySummary(
        input.overlay,
        id,
        `System Admin area for ${section.label.toLowerCase()} — requires \`${section.readPermissionKey}\`.`
      ),
      productRoutes: [section.href],
      permissionKeys: [section.readPermissionKey],
      entitlements: [],
      catalogSources: ["system-admin"],
    });
  });
}

export function buildDocsFeatureManifests(
  input: DocsFeatureManifestInput
): DocsFeatureManifest[] {
  const manifests = [
    ...buildModuleManifests(input),
    ...buildAuthLaneManifests(input),
    ...buildAdminSectionManifests(input),
  ];

  manifests.sort((left, right) => left.id.localeCompare(right.id));
  return manifests;
}

export function applyFeatureManifestOverrides(
  manifests: readonly DocsFeatureManifest[],
  overrides: FeatureManifestOverrides | undefined
): DocsFeatureManifest[] {
  if (!overrides || Object.keys(overrides).length === 0) {
    return [...manifests];
  }

  return manifests.map((manifest) => {
    const override = overrides[manifest.id];
    if (!override) {
      return manifest;
    }

    const parsed = featureManifestOverrideEntrySchema.parse(override);
    const productRoutes = parsed.extraProductRoutes
      ? [...new Set([...manifest.productRoutes, ...parsed.extraProductRoutes])]
      : manifest.productRoutes;

    return docsFeatureManifestSchema.parse({
      ...manifest,
      title: parsed.title ?? manifest.title,
      summary: parsed.summary ?? manifest.summary,
      audience: parsed.audience ?? manifest.audience,
      productRoutes,
      suppressCasual: parsed.suppressCasual ?? manifest.suppressCasual,
    });
  });
}

export interface DocsFeatureCoverageResult {
  readonly warnings: string[];
  readonly errors: string[];
}

function buildSurfaceRouteSet(surfaces: readonly DocsAppSurface[]): Set<string> {
  const routes = new Set<string>();
  for (const surface of surfaces) {
    routes.add(surface.route);
    if (surface.kind === "error-boundary" && surface.route === "/error") {
      routes.add("/error");
    }
  }
  return routes;
}

function surfaceMatchesProductRoute(
  surfaces: readonly DocsAppSurface[],
  productRoute: string
): boolean {
  const surfaceRoutes = buildSurfaceRouteSet(surfaces);
  if (surfaceRoutesMatchProductRoute(surfaceRoutes, productRoute)) {
    return true;
  }

  return surfaces.some(
    (surface) =>
      surface.kind === "error-boundary" && surface.route === productRoute
  );
}

function normalizeRouteForMatch(route: string): string {
  return route.replace(/\[[^\]]+\]/g, "[param]");
}

function surfaceRoutesMatchProductRoute(
  surfaceRoutes: Set<string>,
  productRoute: string
): boolean {
  if (surfaceRoutes.has(productRoute)) {
    return true;
  }

  if (productRoute.startsWith("/modules/")) {
    return (
      surfaceRoutes.has("/modules/[moduleId]") ||
      surfaceRoutes.has("/modules/[param]")
    );
  }

  return [...surfaceRoutes].some(
    (surfaceRoute) =>
      normalizeRouteForMatch(surfaceRoute) ===
      normalizeRouteForMatch(productRoute)
  );
}

function isAllowlistedRoute(route: string): boolean {
  return DOCS_FEATURE_COVERAGE_ALLOWLIST.some(
    (allowed) => route === allowed || route.startsWith(`${allowed}/`)
  );
}

export function validateFeatureCoverage(input: {
  readonly manifests: readonly DocsFeatureManifest[];
  readonly surfaces: readonly DocsAppSurface[];
  readonly permissionKeys: readonly string[];
}): DocsFeatureCoverageResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const permissionSet = new Set(input.permissionKeys);
  const seenIds = new Map<string, number>();

  for (const manifest of input.manifests) {
    seenIds.set(manifest.id, (seenIds.get(manifest.id) ?? 0) + 1);

    if (manifest.kind === "platform-api") {
      for (const permissionKey of manifest.permissionKeys) {
        if (!permissionSet.has(permissionKey)) {
          warnings.push(
            `${manifest.id}: permission "${permissionKey}" not found in permissions catalog.`
          );
        }
      }
      continue;
    }

    for (const route of manifest.productRoutes) {
      if (isAllowlistedRoute(route)) {
        continue;
      }
      if (!surfaceMatchesProductRoute(input.surfaces, route)) {
        warnings.push(
          `${manifest.id}: product route "${route}" not found in ERP app surface scan.`
        );
      }
    }

    for (const permissionKey of manifest.permissionKeys) {
      if (!permissionSet.has(permissionKey)) {
        warnings.push(
          `${manifest.id}: permission "${permissionKey}" not found in permissions catalog.`
        );
      }
    }
  }

  for (const [id, count] of seenIds) {
    if (count > 1) {
      errors.push(`duplicate feature manifest id "${id}" (${count} occurrences).`);
    }
  }

  for (const surface of input.surfaces) {
    if (
      (surface.kind !== "page" && surface.kind !== "error-boundary") ||
      isAllowlistedRoute(surface.route)
    ) {
      continue;
    }
    if (surface.kind === "error-boundary") {
      continue;
    }
    if (
      surface.route.startsWith("/modules/") &&
      (surface.route.includes("[") || surface.route === "/modules/[moduleId]") &&
      input.manifests.some((manifest) => manifest.kind === "module")
    ) {
      continue;
    }
    if (
      surface.route.startsWith("/modules/") &&
      !input.manifests.some(
        (manifest) =>
          manifest.kind === "module" &&
          manifest.productRoutes.includes(surface.route)
      )
    ) {
      warnings.push(
        `module route "${surface.route}" has no module feature manifest.`
      );
    }
  }

  return {
    warnings: warnings.sort(),
    errors: errors.sort(),
  };
}

export function computeFeatureCoverageScore(input: {
  readonly manifests: readonly DocsFeatureManifest[];
  readonly surfaces: readonly DocsAppSurface[];
  readonly permissionKeys: readonly string[];
  readonly result: DocsFeatureCoverageResult;
}): DocsFeatureCoverageScore {
  let totalChecks = 0;

  for (const manifest of input.manifests) {
    for (const route of manifest.productRoutes) {
      if (isAllowlistedRoute(route)) {
        continue;
      }
      totalChecks += 1;
    }

    totalChecks += manifest.permissionKeys.length;
  }

  for (const surface of input.surfaces) {
    if (surface.kind !== "page" || isAllowlistedRoute(surface.route)) {
      continue;
    }
    if (
      surface.route.startsWith("/modules/") &&
      (surface.route.includes("[") || surface.route === "/modules/[moduleId]")
    ) {
      continue;
    }
    if (!surface.route.startsWith("/modules/")) {
      continue;
    }
    totalChecks += 1;
  }

  const failedChecks = input.result.warnings.length;
  const score =
    totalChecks === 0 ? 1 : (totalChecks - failedChecks) / totalChecks;

  return {
    score,
    totalChecks,
    failedChecks,
  };
}

export function applyFeatureCoverageHardFail(
  result: DocsFeatureCoverageResult,
  score: DocsFeatureCoverageScore
): DocsFeatureCoverageResult {
  if (score.score < DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD) {
    return result;
  }

  if (result.warnings.length === 0) {
    return result;
  }

  return {
    errors: [...result.errors, ...result.warnings].sort(),
    warnings: [],
  };
}

export function applyOpenApiBindingHardFail(input: {
  readonly warnings: readonly string[];
  readonly score: DocsFeatureCoverageScore;
}): readonly string[] {
  if (input.score.score < DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD) {
    return input.warnings;
  }

  return input.warnings.length > 0 ? [...input.warnings].sort() : [];
}

export function buildDocsFeatureEvidenceGraph(input: {
  readonly manifests: readonly DocsFeatureManifest[];
  readonly coverage: DocsFeatureCoverageResult;
  readonly score: DocsFeatureCoverageScore;
  readonly openApiBindingWarnings?: readonly string[];
}): DocsFeatureEvidenceGraph {
  const bindingWarnings = input.openApiBindingWarnings ?? [];

  return {
    generated: true,
    version: 2,
    exportedAt: new Date().toISOString(),
    manifests: input.manifests,
    coverageWarnings: input.coverage.warnings,
    coverageErrors: input.coverage.errors,
    coverageScore: input.score.score,
    coverageThreshold: DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD,
    openApiBindingWarnings: bindingWarnings,
  };
}

export function listModuleManifests(
  manifests: readonly DocsFeatureManifest[]
): DocsFeatureManifest[] {
  return manifests.filter((manifest) => manifest.kind === "module");
}

export function listAuthLaneManifests(
  manifests: readonly DocsFeatureManifest[]
): DocsFeatureManifest[] {
  return manifests.filter((manifest) => manifest.kind === "auth-lane");
}

export function listAdminSectionManifests(
  manifests: readonly DocsFeatureManifest[]
): DocsFeatureManifest[] {
  return manifests.filter((manifest) => manifest.kind === "admin-section");
}

export function listPlatformApiManifests(
  manifests: readonly DocsFeatureManifest[]
): DocsFeatureManifest[] {
  return manifests.filter((manifest) => manifest.kind === "platform-api");
}
