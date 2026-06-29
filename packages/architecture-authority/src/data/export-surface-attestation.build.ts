/**
 * Builds per-export surface attestation rows from package.json manifests (B44).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ConsumerExportAttestationEntry,
  SurfaceStabilityClass,
} from "../contracts/architecture-governance-amendment.contract.js";
import type { PackageDefinition } from "../contracts/package.contract.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

function resolveExportKind(
  exportPath: string
): ConsumerExportAttestationEntry["exportKind"] {
  if (exportPath === ".") {
    return "barrel";
  }

  if (exportPath.includes("types") || exportPath.endsWith(".d.ts")) {
    return "types-only";
  }

  return "subpath";
}

function listPackageExportPaths(packagePath: string): string[] {
  const manifestPath = join(repoRoot, packagePath, "package.json");

  if (!existsSync(manifestPath)) {
    return ["."];
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    exports?: unknown;
  };

  if (manifest.exports === undefined || typeof manifest.exports === "string") {
    return ["."];
  }

  if (Array.isArray(manifest.exports)) {
    return ["."];
  }

  const exportKeys = Object.keys(manifest.exports as Record<string, unknown>);

  return exportKeys.length > 0 ? exportKeys.sort() : ["."];
}

export function buildConsumerExportAttestation(
  governed: readonly PackageDefinition[],
  resolveStability: (pkg: PackageDefinition) => SurfaceStabilityClass
): readonly ConsumerExportAttestationEntry[] {
  const entries: ConsumerExportAttestationEntry[] = [];

  for (const pkg of governed) {
    const stabilityClass = resolveStability(pkg);

    for (const exportPath of listPackageExportPaths(pkg.path)) {
      entries.push({
        packageName: pkg.packageName,
        exportPath,
        stabilityClass,
        exportKind: resolveExportKind(exportPath),
      });
    }
  }

  return entries;
}

export function readLivePackageExportPaths(
  packagePath: string
): readonly string[] {
  return listPackageExportPaths(packagePath);
}

export { repoRoot as architectureAuthorityRepoRoot };
