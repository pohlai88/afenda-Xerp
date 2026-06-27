import type { DocsAppSurface } from "@/lib/docs-repo-evidence";
import type { DocsFeatureEvidenceGraph } from "@/lib/docs-feature-manifest.contract";
import type { DocsFeatureManifest } from "@/lib/docs-feature-manifest.contract";
import { formatApiOperationTableRow } from "@/lib/docs-openapi-manifest-bindings";
import {
  listAdminSectionManifests,
  listAuthLaneManifests,
  listModuleManifests,
  listPlatformApiManifests,
} from "@/lib/docs-feature-manifest";

function jsxString(value: string): string {
  return JSON.stringify(value);
}

function jsxValue(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function typeTable(
  rows: Record<string, { type: string; description: string; required?: boolean }>
): string {
  const table = Object.fromEntries(
    Object.entries(rows).map(([name, row]) => [
      name,
      {
        type: row.type,
        description: row.description,
        required: row.required ?? true,
      },
    ])
  );

  return `<TypeTable type={${jsxValue(table)}} />`;
}

function resolveSurfaceLabels(
  routes: readonly string[],
  surfaces: readonly DocsAppSurface[]
): string[] {
  return routes.map((route) => {
    const matches = surfaces.filter((surface) => surface.route === route);
    if (matches.length === 0) {
      return route;
    }
    return matches
      .map((surface) => `${surface.route} (${surface.file})`)
      .join(" · ");
  });
}

function filesTree(items: readonly string[], folder: string): string {
  if (items.length === 0) {
    return `<Files>
  <Folder name=${jsxString(folder)} defaultOpen>
    <File name="None declared" />
  </Folder>
</Files>`;
  }

  return `<Files>
  <Folder name=${jsxString(folder)} defaultOpen>
${items.map((item) => `    <File name=${jsxString(item)} />`).join("\n")}
  </Folder>
</Files>`;
}

function renderApiOperationsSection(manifest: DocsFeatureManifest): string {
  const operations = manifest.apiOperations ?? [];
  if (operations.length === 0) {
    return `## API operations

No internal v1 operations are bound to this manifest yet. Regenerate after OpenAPI tag alignment.

`;
  }

  const rows = operations.map((operation) => formatApiOperationTableRow(operation)).join("\n");

  return `## API operations

| Operation | Permission | Contract |
| --- | --- | --- |
${rows}
`;
}

function renderEvidenceBanner(manifestId: string): string {
  return `<Banner id=${jsxString(`evidence-${manifestId}`)} changeLayout={false}>
  GENERATED EVIDENCE — synced from product catalogs. Do not edit by hand.
</Banner>`;
}

function renderEvidenceFrontmatter(
  manifest: DocsFeatureManifest,
  titleSuffix: string
): string {
  return `---
title: ${jsxString(`${manifest.title} evidence`)}
description: ${jsxString(`Developer evidence for ${manifest.title} — ${titleSuffix}.`)}
noIndex: true
docsType: generated-evidence
catalogBindings:${manifest.catalogSources.length > 0 ? `\n${manifest.catalogSources.map((source) => `  - ${source}`).join("\n")}` : " []"}
---`;
}

export function renderDeveloperModuleEvidenceMdx(
  manifest: DocsFeatureManifest,
  surfaces: readonly DocsAppSurface[] = []
): string {
  const entitlementList =
    manifest.entitlements.length > 0
      ? manifest.entitlements.map((item) => `- \`${item}\``).join("\n")
      : "- None required.";
  const surfaceLabels = resolveSurfaceLabels(manifest.productRoutes, surfaces);
  const apiSection = renderApiOperationsSection(manifest);

  return `${renderEvidenceFrontmatter(manifest, "routes, permissions, entitlements, and catalog traceability")}

import { Banner } from "fumadocs-ui/components/banner";
import { Step, Steps } from "fumadocs-ui/components/steps";

${renderEvidenceBanner(manifest.id)}

## Overview

${manifest.summary}

## Source contract

${typeTable({
  Module: { type: manifest.id, description: "Stable module identifier from modules.catalog.json." },
  Audience: { type: manifest.audience, description: "Primary docs audience for the casual guide." },
  Permission: {
    type: manifest.permissionKeys[0] ?? "—",
    description: "Primary permission key gating module access.",
  },
  Routes: {
    type: `${manifest.productRoutes.length}`,
    description: "Product routes declared for this module.",
  },
  ApiOperations: {
    type: `${(manifest.apiOperations ?? []).length}`,
    description: "Internal v1 OpenAPI operations bound by primary tag.",
  },
})}

## Runtime surfaces

${filesTree(surfaceLabels, "Product routes")}

### Entitlements and capabilities

${entitlementList}

${apiSection}## Traceability

<Steps>
  <Step>Catalog source: \`modules.catalog.json\` via \`pnpm sync:product-docs\`.</Step>
  <Step>Casual guide: [${manifest.title}](/docs/use-erp/modules/${manifest.id}).</Step>
  <Step>Tabular reference: [Module catalog table](/docs/integrate/modules/${manifest.id}) · [End-user guide](/docs/use-erp/modules/${manifest.id}).</Step>
  <Step>Regenerate with \`pnpm sync:product-docs\` after entitlement or route changes.</Step>
</Steps>
`;
}

export function renderDeveloperAuthLaneEvidenceMdx(
  manifest: DocsFeatureManifest,
  surfaces: readonly DocsAppSurface[] = []
): string {
  const surfaceLabels = resolveSurfaceLabels(manifest.productRoutes, surfaces);

  return `${renderEvidenceFrontmatter(manifest, "auth lane routes and catalog traceability")}

import { Banner } from "fumadocs-ui/components/banner";
import { Step, Steps } from "fumadocs-ui/components/steps";

${renderEvidenceBanner(manifest.id)}

## Overview

${manifest.summary}

## Source contract

${typeTable({
  Lane: { type: manifest.id, description: "Auth lane manifest compiled from auth-routes.catalog.json." },
  Audience: { type: manifest.audience, description: "Primary docs audience for the casual auth map." },
  Routes: {
    type: `${manifest.productRoutes.length}`,
    description: "Auth paths grouped under this lane.",
  },
})}

## Runtime surfaces

${filesTree(surfaceLabels, "Auth routes")}

## Traceability

<Steps>
  <Step>Catalog source: \`auth-routes.catalog.json\` via \`pnpm sync:product-docs\`.</Step>
  <Step>Casual guide: [Authentication routes by lane](/docs/use-erp/auth-lanes).</Step>
  <Step>Sign-in task article: [Sign in to Afenda ERP](/docs/use-erp/sign-in).</Step>
  <Step>Regenerate with \`pnpm sync:product-docs\` after auth registry changes.</Step>
</Steps>
`;
}

export function renderDeveloperAdminSectionEvidenceMdx(
  manifest: DocsFeatureManifest,
  surfaces: readonly DocsAppSurface[] = []
): string {
  const surfaceLabels = resolveSurfaceLabels(manifest.productRoutes, surfaces);
  const apiSection = renderApiOperationsSection(manifest);

  return `${renderEvidenceFrontmatter(manifest, "System Admin routes, permissions, and catalog traceability")}

import { Banner } from "fumadocs-ui/components/banner";
import { Step, Steps } from "fumadocs-ui/components/steps";

${renderEvidenceBanner(manifest.id)}

## Overview

${manifest.summary}

## Source contract

${typeTable({
  Section: { type: manifest.id, description: "Admin section manifest from system-admin.catalog.json." },
  Audience: { type: manifest.audience, description: "Tenant administrator audience." },
  Permission: {
    type: manifest.permissionKeys[0] ?? "—",
    description: "Read permission for the admin surface.",
  },
  Routes: {
    type: `${manifest.productRoutes.length}`,
    description: "System Admin routes for this section.",
  },
  ApiOperations: {
    type: `${(manifest.apiOperations ?? []).length}`,
    description: "Internal v1 OpenAPI operations bound to this admin section.",
  },
})}

## Runtime surfaces

${filesTree(surfaceLabels, "Admin routes")}

${apiSection}## Traceability

<Steps>
  <Step>Catalog source: \`system-admin.catalog.json\` via \`pnpm sync:product-docs\`.</Step>
  <Step>Casual map: [System Admin areas](/docs/configure-tenant/generated/admin-sections).</Step>
  <Step>Permissions reference: [Permissions reference](/docs/configure-tenant/generated/permissions).</Step>
  <Step>Regenerate with \`pnpm sync:product-docs\` after admin catalog changes.</Step>
</Steps>
`;
}

export function renderDeveloperPlatformApiEvidenceMdx(
  manifest: DocsFeatureManifest
): string {
  const operations = manifest.apiOperations ?? [];
  const apiPaths = operations.map(
    (operation) => `/api/internal/v1${operation.path}`
  );
  const apiSection = renderApiOperationsSection(manifest);

  return `${renderEvidenceFrontmatter(manifest, "internal v1 OpenAPI operations and contract traceability")}

import { Banner } from "fumadocs-ui/components/banner";
import { Step, Steps } from "fumadocs-ui/components/steps";

${renderEvidenceBanner(manifest.id)}

## Overview

${manifest.summary}

## Source contract

${typeTable({
  PlatformTag: {
    type: manifest.openapiTag ?? manifest.id,
    description: "Primary OpenAPI tag for operation binding.",
  },
  Audience: { type: manifest.audience, description: "Integrator and platform operator audience." },
  ApiOperations: {
    type: `${operations.length}`,
    description: "Bound internal v1 operations for this platform tag.",
  },
})}

## Runtime surfaces

${filesTree(apiPaths, "Internal v1 API paths")}

${apiSection}## Traceability

<Steps>
  <Step>OpenAPI source: \`apps/docs/openapi/afenda-internal-v1.openapi.json\`.</Step>
  <Step>Reference index: [Internal v1 API](/docs/integrate/internal-v1).</Step>
  <Step>Regenerate with \`pnpm sync:product-docs\` after contract export changes.</Step>
</Steps>
`;
}

export function renderDeveloperEvidenceIndexMdx(
  manifests: readonly DocsFeatureManifest[]
): string {
  const modules = listModuleManifests([...manifests]);
  const authLanes = listAuthLaneManifests([...manifests]);
  const adminSections = listAdminSectionManifests([...manifests]);
  const platformApis = listPlatformApiManifests([...manifests]);

  const moduleRows = modules
    .map(
      (module) =>
        `| [${module.title}](./${module.id}) | \`${module.productRoutes[0] ?? "—"}\` | \`${module.permissionKeys[0] ?? "—"}\` |`
    )
    .join("\n");
  const authRows = authLanes
    .map(
      (lane) =>
        `| [${lane.title}](./${lane.id}) | ${lane.productRoutes.length} routes | — |`
    )
    .join("\n");
  const adminRows = adminSections
    .map(
      (section) =>
        `| [${section.title}](./${section.id}) | \`${section.productRoutes[0] ?? "—"}\` | \`${section.permissionKeys[0] ?? "—"}\` |`
    )
    .join("\n");
  const platformRows = platformApis
    .map(
      (platform) =>
        `| [${platform.title}](./${platform.id}) | \`${platform.openapiTag ?? "—"}\` | ${platform.apiOperations?.length ?? 0} ops |`
    )
    .join("\n");

  return `---
title: "Feature evidence index"
description: "Developer evidence for ERP modules, auth lanes, admin sections, and platform APIs."
noIndex: true
docsType: generated-evidence
---

## Overview

Structured evidence pages compiled from product catalogs, ERP route discovery, and internal v1 OpenAPI tags.

## Modules

| Module | Route | Permission |
| --- | --- | --- |
${moduleRows}

## Auth lanes

| Lane | Routes | Permission |
| --- | --- | --- |
${authRows}

## Admin sections

| Section | Route | Permission |
| --- | --- | --- |
${adminRows}

## Platform APIs

| Surface | OpenAPI tag | Operations |
| --- | --- | --- |
${platformRows}
`;
}

export interface DeveloperEvidenceFile {
  readonly relativePath: string;
  readonly body: string;
}

export interface RenderDeveloperEvidenceInput {
  readonly manifests: readonly DocsFeatureManifest[];
  readonly surfaces?: readonly DocsAppSurface[];
}

export function renderDeveloperEvidenceFiles(
  input: RenderDeveloperEvidenceInput
): DeveloperEvidenceFile[] {
  const surfaces = input.surfaces ?? [];
  const modules = listModuleManifests([...input.manifests]);
  const authLanes = listAuthLaneManifests([...input.manifests]);
  const adminSections = listAdminSectionManifests([...input.manifests]);
  const platformApis = listPlatformApiManifests([...input.manifests]);

  const files: DeveloperEvidenceFile[] = [
    {
      relativePath: "integrate/generated/evidence/index.mdx",
      body: renderDeveloperEvidenceIndexMdx(input.manifests),
    },
    ...modules.map((module) => ({
      relativePath: `integrate/generated/evidence/${module.id}.mdx`,
      body: renderDeveloperModuleEvidenceMdx(module, surfaces),
    })),
    ...authLanes.map((lane) => ({
      relativePath: `integrate/generated/evidence/${lane.id}.mdx`,
      body: renderDeveloperAuthLaneEvidenceMdx(lane, surfaces),
    })),
    ...adminSections.map((section) => ({
      relativePath: `integrate/generated/evidence/${section.id}.mdx`,
      body: renderDeveloperAdminSectionEvidenceMdx(section, surfaces),
    })),
    ...platformApis.map((platform) => ({
      relativePath: `integrate/generated/evidence/${platform.id}.mdx`,
      body: renderDeveloperPlatformApiEvidenceMdx(platform),
    })),
  ];

  return files.sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath)
  );
}

export function serializeFeatureEvidenceGraph(
  graph: DocsFeatureEvidenceGraph
): string {
  return `${JSON.stringify(graph, null, 2)}\n`;
}

export function listDeveloperEvidencePageIds(
  manifests: readonly DocsFeatureManifest[]
): string[] {
  return ["index", ...manifests.map((manifest) => manifest.id)];
}
