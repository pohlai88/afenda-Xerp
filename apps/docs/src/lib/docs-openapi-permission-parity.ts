import type {
  DocsFeatureCoverageScore,
  DocsFeatureManifest,
} from "@/lib/docs-feature-manifest.contract";
import { DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD } from "@/lib/docs-feature-manifest.contract";

const PERMISSION_PARITY_KINDS = new Set<DocsFeatureManifest["kind"]>(["module"]);

export interface PermissionOpenApiParityResult {
  readonly warnings: readonly string[];
}

function permissionNamespace(key: string): string {
  const dotIndex = key.indexOf(".");
  return dotIndex >= 0 ? key.slice(0, dotIndex) : key;
}

function manifestPermissionNamespaces(manifest: DocsFeatureManifest): Set<string> {
  return new Set(manifest.permissionKeys.map(permissionNamespace));
}

function operationPermissionMatchesManifest(input: {
  readonly permission: string;
  readonly manifestKeys: Set<string>;
  readonly manifestNamespaces: Set<string>;
}): boolean {
  if (input.manifestKeys.has(input.permission)) {
    return true;
  }

  return input.manifestNamespaces.has(permissionNamespace(input.permission));
}

export function validatePermissionOpenApiParity(
  manifests: readonly DocsFeatureManifest[]
): PermissionOpenApiParityResult {
  const warnings: string[] = [];

  for (const manifest of manifests) {
    if (!PERMISSION_PARITY_KINDS.has(manifest.kind)) {
      continue;
    }

    const operations = manifest.apiOperations ?? [];
    if (manifest.permissionKeys.length === 0 || operations.length === 0) {
      continue;
    }

    const manifestKeys = new Set(manifest.permissionKeys);
    const manifestNamespaces = manifestPermissionNamespaces(manifest);
    const operationPermissions = operations
      .map((operation) => operation.permission)
      .filter((permission): permission is string => typeof permission === "string");

    const hasMatchingOperation = operationPermissions.some((permission) =>
      operationPermissionMatchesManifest({
        permission,
        manifestKeys,
        manifestNamespaces,
      })
    );

    if (!hasMatchingOperation) {
      warnings.push(
        `${manifest.id}: no bound OpenAPI operation declares a manifest permission key (${[...manifestKeys].join(", ")}).`
      );
    }

    for (const permission of operationPermissions) {
      if (
        !operationPermissionMatchesManifest({
          permission,
          manifestKeys,
          manifestNamespaces,
        })
      ) {
        warnings.push(
          `${manifest.id}: OpenAPI operation permission "${permission}" is outside manifest permission namespace (${[...manifestNamespaces].join(", ")}).`
        );
      }
    }
  }

  return { warnings: warnings.sort() };
}

export function applyPermissionParityHardFail(input: {
  readonly warnings: readonly string[];
  readonly score: DocsFeatureCoverageScore;
}): readonly string[] {
  if (input.score.score < DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD) {
    return input.warnings;
  }

  return input.warnings.length > 0 ? [...input.warnings].sort() : [];
}

export function summarizeManifestApiOperationCounts(
  manifests: readonly DocsFeatureManifest[]
): readonly { readonly id: string; readonly apiOperationCount: number }[] {
  return manifests.map((manifest) => ({
    id: manifest.id,
    apiOperationCount: manifest.apiOperations?.length ?? 0,
  }));
}
