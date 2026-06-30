import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  DocsFeatureApiOperation,
  DocsFeatureManifest,
} from "@/lib/docs-feature-manifest.contract";
import {
  isOpenApiHttpMethod,
  openApiInternalV1DocHref,
  openApiOperationDocSlug,
} from "@/lib/docs-openapi-slug";
import { resolveDocsRepoRoot } from "@/lib/docs-repo-evidence";

const HTTP_METHODS = ["get", "post", "put", "delete", "patch"] as const;

interface OpenApiOperationRecord {
  readonly operationId?: string;
  readonly tags?: readonly string[];
  readonly "x-afenda-permission"?: string;
  readonly "x-afenda-contract-id"?: string;
}

interface OpenApiSpec {
  readonly paths?: Record<
    string,
    Partial<Record<(typeof HTTP_METHODS)[number], OpenApiOperationRecord>>
  >;
}

export interface OpenApiManifestBindingResult {
  readonly manifests: readonly DocsFeatureManifest[];
  readonly warnings: readonly string[];
}

function resolveOpenApiSpecPath(root: string): string {
  return join(root, "apps/docs/openapi/afenda-internal-v1.openapi.json");
}

export function parseOpenApiOperations(
  specPath: string
): DocsFeatureApiOperation[] {
  const spec = JSON.parse(readFileSync(specPath, "utf8")) as OpenApiSpec;
  const operations: DocsFeatureApiOperation[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) {
        continue;
      }

      const contractId =
        operation["x-afenda-contract-id"] ??
        operation.operationId ??
        `${method}:${path}`;

      operations.push({
        id: contractId,
        method,
        path,
        permission: operation["x-afenda-permission"],
        docSlug: openApiOperationDocSlug(path, method),
      });
    }
  }

  return operations.sort((left, right) =>
    left.id.localeCompare(right.id)
  );
}

function primaryOpenApiTag(
  operation: OpenApiOperationRecord | undefined
): string | undefined {
  const tag = operation?.tags?.[0];
  return typeof tag === "string" && tag.length > 0 ? tag : undefined;
}

/** Resource-oriented admin API paths that do not share legacy section URL prefixes. */
const SYSTEM_ADMIN_API_PATH_MANIFEST_IDS: Record<string, string> = {
  "/system-admin/membership-role-assignments": "admin-memberships",
  "/system-admin/user-invitations": "admin-users",
};

function adminManifestForPath(
  manifests: readonly DocsFeatureManifest[],
  apiPath: string
): DocsFeatureManifest | undefined {
  const manifestId = SYSTEM_ADMIN_API_PATH_MANIFEST_IDS[apiPath];
  if (manifestId !== undefined) {
    return manifests.find((manifest) => manifest.id === manifestId);
  }

  return manifests.find(
    (manifest) =>
      manifest.kind === "admin-section" &&
      manifest.productRoutes.some((route) => apiPath.startsWith(route))
  );
}

function resolveManifestForOpenApiTag(input: {
  readonly tag: string;
  readonly apiPath: string;
  readonly manifests: readonly DocsFeatureManifest[];
}): DocsFeatureManifest | undefined {
  if (input.tag === "public") {
    return input.manifests.find((manifest) => manifest.id === "platform-docs");
  }

  if (input.tag === "system-admin") {
    return adminManifestForPath(input.manifests, input.apiPath);
  }

  const moduleManifest = input.manifests.find(
    (manifest) => manifest.kind === "module" && manifest.id === input.tag
  );
  if (moduleManifest) {
    return moduleManifest;
  }

  return input.manifests.find(
    (manifest) =>
      manifest.kind === "platform-api" &&
      (manifest.openapiTag === input.tag || manifest.id === `platform-${input.tag}`)
  );
}

export function bindOpenApiOperationsToManifests(input: {
  readonly manifests: readonly DocsFeatureManifest[];
  readonly specPath?: string;
  readonly root?: string;
}): OpenApiManifestBindingResult {
  const root = input.root ?? resolveDocsRepoRoot();
  const specPath = input.specPath ?? resolveOpenApiSpecPath(root);
  const spec = JSON.parse(readFileSync(specPath, "utf8")) as OpenApiSpec;
  const warnings: string[] = [];
  const bindings = new Map<string, DocsFeatureApiOperation[]>();

  for (const manifest of input.manifests) {
    bindings.set(manifest.id, manifest.apiOperations ? [...manifest.apiOperations] : []);
  }

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) {
        continue;
      }

      const tag = primaryOpenApiTag(operation);
      if (!tag) {
        warnings.push(`OpenAPI operation ${method.toUpperCase()} ${path} has no primary tag.`);
        continue;
      }

      const contractId =
        operation["x-afenda-contract-id"] ??
        operation.operationId ??
        `${method}:${path}`;

      if (!isOpenApiHttpMethod(method)) {
        continue;
      }

      const apiOperation: DocsFeatureApiOperation = {
        id: contractId,
        method,
        path,
        permission: operation["x-afenda-permission"],
        docSlug: openApiOperationDocSlug(path, method),
      };

      let targetManifest: DocsFeatureManifest | undefined = resolveManifestForOpenApiTag(
        {
          tag,
          apiPath: path,
          manifests: input.manifests,
        }
      );

      if (!targetManifest) {
        warnings.push(
          `OpenAPI tag "${tag}" for ${method.toUpperCase()} ${path} has no feature manifest.`
        );
        continue;
      }

      const existing = bindings.get(targetManifest.id) ?? [];
      if (existing.some((entry) => entry.id === apiOperation.id)) {
        warnings.push(`Duplicate OpenAPI operation id "${apiOperation.id}" during binding.`);
        continue;
      }
      existing.push(apiOperation);
      bindings.set(targetManifest.id, existing);
    }
  }

  const manifests = input.manifests.map((manifest) => ({
    ...manifest,
    apiOperations: bindings.get(manifest.id) ?? [],
  }));

  return {
    manifests,
    warnings: warnings.sort(),
  };
}

export function formatApiOperationTableRow(operation: DocsFeatureApiOperation): string {
  return `| [${operation.method.toUpperCase()} ${operation.path}](${openApiInternalV1DocHref(operation.docSlug)}) | \`${operation.permission ?? "—"}\` | \`${operation.id}\` |`;
}
