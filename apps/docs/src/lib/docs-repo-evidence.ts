import { globSync } from "node:fs";
import { join, relative, sep } from "node:path";

export interface DocsAppSurface {
  readonly file: string;
  readonly route: string;
  readonly kind: "api" | "page" | "error-boundary";
}

export interface DocsRepoEvidenceGraph {
  readonly generated: true;
  readonly version: 1;
  readonly exportedAt: string;
  readonly erpAppSurfaces: readonly DocsAppSurface[];
  readonly catalogCounts: {
    readonly authRoutes: number;
    readonly permissions: number;
    readonly modules: number;
    readonly envVariables: number;
  };
}

export interface DocsCatalogCounts {
  readonly authRoutes: number;
  readonly permissions: number;
  readonly modules: number;
  readonly envVariables: number;
}

/** Monorepo root — works under vitest (`apps/docs` cwd) and tsx scripts (repo cwd). */
export function resolveDocsRepoRoot(): string {
  const normalized = process.cwd().replace(/\\/g, "/");
  if (normalized.endsWith("/apps/docs")) {
    return join(process.cwd(), "../..");
  }
  return process.cwd();
}

function toPosixPath(path: string): string {
  return path.split(sep).join("/");
}

function normalizeRoute(route: string): string {
  if (route === "") {
    return "/";
  }
  return route.startsWith("/") ? route : `/${route}`;
}

function routeFromAppFile(root: string, absolutePath: string): DocsAppSurface {
  const file = toPosixPath(relative(root, absolutePath));
  const kind = file.endsWith("/route.ts") ? "api" : "page";
  const withoutRoot = file
    .replace(/^apps\/erp\/src\/app\//, "")
    .replace(/(?:^|\/)(?:page\.tsx|route\.ts)$/, "");
  const segments = withoutRoot
    .split("/")
    .filter((segment) => segment.length > 0)
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));

  return {
    file,
    route: normalizeRoute(segments.join("/")),
    kind,
  };
}

function routeFromErrorBoundary(root: string, absolutePath: string): DocsAppSurface {
  const file = toPosixPath(relative(root, absolutePath));
  const withoutRoot = file
    .replace(/^apps\/erp\/src\/app\//, "")
    .replace(/\/error\.tsx$/, "");
  const segments = withoutRoot
    .split("/")
    .filter((segment) => segment.length > 0)
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));

  const route =
    segments.length === 0 ? "/error" : normalizeRoute(`${segments.join("/")}/error`);

  return {
    file,
    route,
    kind: "error-boundary",
  };
}

export function discoverErpAppSurfaces(root = resolveDocsRepoRoot()): DocsAppSurface[] {
  const appDir = join(root, "apps/erp/src/app");
  const matches = globSync("**/page.tsx", { cwd: appDir });
  const apiMatches = globSync("**/route.ts", { cwd: appDir });
  const errorMatches = globSync("**/error.tsx", { cwd: appDir });

  const surfaces = [
    ...matches.map((match) => routeFromAppFile(root, join(appDir, match))),
    ...apiMatches.map((match) => routeFromAppFile(root, join(appDir, match))),
    ...errorMatches.map((match) =>
      routeFromErrorBoundary(root, join(appDir, match))
    ),
  ].sort(
    (left, right) =>
      left.route.localeCompare(right.route) || left.file.localeCompare(right.file)
  );

  const expanded = [...surfaces];
  for (const surface of surfaces) {
    if (surface.kind === "page" && surface.route.endsWith("/[[...slug]]")) {
      expanded.push({
        ...surface,
        route: surface.route.slice(0, -"/[[...slug]]".length) || "/",
      });
    }
  }

  return expanded.sort(
    (left, right) =>
      left.route.localeCompare(right.route) || left.file.localeCompare(right.file)
  );
}

function jsxString(value: string): string {
  return JSON.stringify(value);
}

export function renderRepoRouteTree(surfaces: readonly DocsAppSurface[]): string {
  const pages = surfaces.filter((surface) => surface.kind === "page");
  const apis = surfaces.filter((surface) => surface.kind === "api");
  const errorBoundaries = surfaces.filter(
    (surface) => surface.kind === "error-boundary"
  );

  const pageItems = pages
    .map((surface) => `    <File name=${jsxString(`${surface.route} (${surface.file})`)} />`)
    .join("\n");
  const apiItems = apis
    .map((surface) => `    <File name=${jsxString(`${surface.route} (${surface.file})`)} />`)
    .join("\n");
  const errorItems = errorBoundaries
    .map((surface) => `    <File name=${jsxString(`${surface.route} (${surface.file})`)} />`)
    .join("\n");

  return `<Files>
  <Folder name="apps/erp/src/app — pages" defaultOpen>
${pageItems || '    <File name="(none discovered)" />'}
  </Folder>
  <Folder name="apps/erp/src/app — API routes">
${apiItems || '    <File name="(none discovered)" />'}
  </Folder>
  <Folder name="apps/erp/src/app — error boundaries">
${errorItems || '    <File name="(none discovered)" />'}
  </Folder>
</Files>`;
}

export function renderRepoInventoryBody(graph: DocsRepoEvidenceGraph): string {
  const { erpAppSurfaces, catalogCounts } = graph;
  const pageCount = erpAppSurfaces.filter((surface) => surface.kind === "page").length;
  const apiCount = erpAppSurfaces.filter((surface) => surface.kind === "api").length;

  return `# Monorepo runtime inventory

Machine-synced from \`apps/erp/src/app\` and product JSON catalogs. Regenerate with \`pnpm sync:product-docs\`.

| Surface | Count |
| --- | ---: |
| ERP page routes | ${pageCount} |
| ERP API routes | ${apiCount} |
| Auth route catalog | ${catalogCounts.authRoutes} |
| Permission catalog | ${catalogCounts.permissions} |
| Module catalog | ${catalogCounts.modules} |
| Env variable catalog | ${catalogCounts.envVariables} |

## ERP App Router surfaces

${renderRepoRouteTree(erpAppSurfaces)}

## Related generated references

- [Auth routes reference](/docs/use-erp/generated/auth-routes)
- [Permissions reference](/docs/configure-tenant/generated/permissions)
- [ERP modules reference](/docs/integrate/generated/modules)
- [Environment variables reference](/docs/operate-tenant/generated/env)
- [Module feature evidence](/docs/integrate/generated/evidence)

## Source evidence

<Steps>
  <Step>Route discovery scans \`apps/erp/src/app/**/page.tsx\` and \`route.ts\`.</Step>
  <Step>Catalog counts come from \`apps/docs/data/*.catalog.json\` exports.</Step>
  <Step>Run \`pnpm sync:product-docs\` after route or catalog changes.</Step>
</Steps>
`;
}

export function buildRepoEvidenceGraph(
  catalogCounts: DocsCatalogCounts,
  root = resolveDocsRepoRoot()
): DocsRepoEvidenceGraph {
  return {
    generated: true,
    version: 1,
    exportedAt: new Date().toISOString(),
    erpAppSurfaces: discoverErpAppSurfaces(root),
    catalogCounts,
  };
}
