import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DocsFeatureManifest } from "@/lib/docs-feature-manifest.contract";
import { docsFeatureManifestSchema } from "@/lib/docs-feature-manifest.contract";
import { resolveDocsRepoRoot } from "@/lib/docs-repo-evidence";

const HTTP_METHODS = ["get", "post", "put", "delete", "patch"] as const;

/** OpenAPI sub-tags bound via a parent module or admin manifest — never primary-only targets. */
export const OPENAPI_SECONDARY_TAGS = [
  "products",
  "warehouses",
  "stock",
  "dashboard",
  "users",
  "audit",
  "memberships",
  "appearance",
  "telemetry",
  "public",
] as const;

interface OpenApiTagDefinition {
  readonly name: string;
  readonly description?: string;
}

interface OpenApiSpecTags {
  readonly tags?: readonly OpenApiTagDefinition[];
  readonly paths?: Record<
    string,
    Partial<Record<(typeof HTTP_METHODS)[number], { readonly tags?: readonly string[] }>>
  >;
}

function resolveOpenApiSpecPath(root: string): string {
  return join(root, "apps/docs/openapi/afenda-internal-v1.openapi.json");
}

export function collectOpenApiPrimaryTags(spec: OpenApiSpecTags): Set<string> {
  const tags = new Set<string>();

  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      const primary = operation?.tags?.[0];
      if (primary) {
        tags.add(primary);
      }
    }
  }

  return tags;
}

function tagDefinitionsByName(
  spec: OpenApiSpecTags
): Map<string, OpenApiTagDefinition> {
  return new Map(
    (spec.tags ?? []).map((tag) => [tag.name, tag] as const)
  );
}

function isSecondaryOnlyTag(tag: string): boolean {
  return (OPENAPI_SECONDARY_TAGS as readonly string[]).includes(tag);
}

function specHasApiDocsOperations(spec: OpenApiSpecTags): boolean {
  return (
    spec.paths?.["/docs"] !== undefined ||
    spec.paths?.["/openapi.json"] !== undefined
  );
}

export function buildPlatformApiManifests(input: {
  readonly specPath?: string;
  readonly root?: string;
  readonly existingManifests: readonly DocsFeatureManifest[];
}): DocsFeatureManifest[] {
  const root = input.root ?? resolveDocsRepoRoot();
  const specPath = input.specPath ?? resolveOpenApiSpecPath(root);
  const spec = JSON.parse(readFileSync(specPath, "utf8")) as OpenApiSpecTags;
  const moduleIds = new Set(
    input.existingManifests
      .filter((manifest) => manifest.kind === "module")
      .map((manifest) => manifest.id)
  );
  const tagDefs = tagDefinitionsByName(spec);
  const primaryTags = collectOpenApiPrimaryTags(spec);
  const manifests: DocsFeatureManifest[] = [];

  for (const tag of primaryTags) {
    if (tag === "system-admin" || moduleIds.has(tag) || isSecondaryOnlyTag(tag)) {
      continue;
    }

    const definition = tagDefs.get(tag);
    const title =
      definition?.name ??
      `${tag.charAt(0).toUpperCase()}${tag.slice(1)} API`;
    const summary =
      definition?.description ??
      `Internal v1 OpenAPI operations tagged \`${tag}\`.`;

    manifests.push(
      docsFeatureManifestSchema.parse({
        id: `platform-${tag}`,
        kind: "platform-api",
        openapiTag: tag,
        title,
        audience: "integrator",
        summary,
        productRoutes: [],
        permissionKeys: [],
        entitlements: [],
        catalogSources: [],
        suppressCasual: true,
      })
    );
  }

  if (specHasApiDocsOperations(spec)) {
    manifests.push(
      docsFeatureManifestSchema.parse({
        id: "platform-docs",
        kind: "platform-api",
        openapiTag: "docs",
        title: "API documentation",
        audience: "integrator",
        summary:
          "Hosted OpenAPI reference UI and machine-readable contract export for internal v1.",
        productRoutes: [],
        permissionKeys: [],
        entitlements: [],
        catalogSources: [],
        suppressCasual: true,
      })
    );
  }

  return manifests.sort((left, right) => left.id.localeCompare(right.id));
}

export function mergeFeatureManifestsWithPlatformApi(input: {
  readonly catalogManifests: readonly DocsFeatureManifest[];
  readonly specPath?: string;
  readonly root?: string;
}): DocsFeatureManifest[] {
  const platformManifests = buildPlatformApiManifests({
    existingManifests: input.catalogManifests,
    ...(input.specPath !== undefined ? { specPath: input.specPath } : {}),
    ...(input.root !== undefined ? { root: input.root } : {}),
  });

  return [...input.catalogManifests, ...platformManifests].sort((left, right) =>
    left.id.localeCompare(right.id)
  );
}
