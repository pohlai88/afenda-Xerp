import type { DocsFeatureManifest } from "@/lib/docs-feature-manifest.contract";

const PERMISSION_PARITY_KINDS = new Set<DocsFeatureManifest["kind"]>([
  "module",
  "admin-section",
]);

export interface PermissionOpenApiParityResult {
  readonly warnings: readonly string[];
}

function manifestPermissionSet(manifest: DocsFeatureManifest): Set<string> {
  return new Set(manifest.permissionKeys);
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

    const permissionSet = manifestPermissionSet(manifest);
    const operationPermissions = operations
      .map((operation) => operation.permission)
      .filter((permission): permission is string => typeof permission === "string");

    const hasMatchingOperation = operationPermissions.some((permission) =>
      permissionSet.has(permission)
    );

    if (!hasMatchingOperation) {
      warnings.push(
        `${manifest.id}: no bound OpenAPI operation declares a manifest permission key (${[...permissionSet].join(", ")}).`
      );
    }

    for (const permission of operationPermissions) {
      if (!permissionSet.has(permission)) {
        warnings.push(
          `${manifest.id}: OpenAPI operation permission "${permission}" is not listed in manifest permissionKeys.`
        );
      }
    }
  }

  return { warnings: warnings.sort() };
}

export function applyPermissionParityHardFail(input: {
  readonly warnings: readonly string[];
  readonly score: number;
  readonly threshold?: number;
}): readonly string[] {
  const threshold = input.threshold ?? 0.8;
  if (input.score < threshold) {
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
