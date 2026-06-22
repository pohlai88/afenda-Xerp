#!/usr/bin/env tsx
/**
 * Architecture authority surface gate (multi-tenancy.md §421–445).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { ARCHITECTURE_BASELINE_FINGERPRINT } from "../../packages/architecture-authority/src/contracts/architecture-authority-version.ts";
import { dependencyContract } from "../../packages/architecture-authority/src/data/dependency-registry.data.ts";
import { layerContract } from "../../packages/architecture-authority/src/data/layer-registry.data.ts";
import { packageContract } from "../../packages/architecture-authority/src/data/package-registry.data.ts";
import {
  ARCHITECTURE_AUTHORITY_CANONICAL_DOCS,
  ARCHITECTURE_AUTHORITY_CONSUMER_SCAN_ROOTS,
  ARCHITECTURE_AUTHORITY_DATA_MODULES,
  ARCHITECTURE_AUTHORITY_DEPENDENCY_SNAPSHOT,
  ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES,
  ARCHITECTURE_DOC_SYNC_COMMANDS,
  ERP_FORBIDDEN_PERMISSION_ENGINE_SYMBOLS,
  ERP_PERMISSION_ENGINE_SCAN_ROOT,
  LAYER_DOC_DISPLAY_OVERRIDES,
  MULTI_TENANCY_FORBIDDEN_PACKAGE_DEPENDENCIES,
  MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES,
} from "../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const authorityRoot = join(repoRoot, "packages/architecture-authority");
const authoritySrcRoot = join(authorityRoot, "src");
const authorityPackageJson = join(authorityRoot, "package.json");
const indexSource = join(authoritySrcRoot, "index.ts");
const registrySource = join(
  authoritySrcRoot,
  "surface/architecture-authority-surface-registry.ts"
);
const surfaceIndexSource = join(authoritySrcRoot, "surface/index.ts");

const REQUIRED_PACKAGE_EXPORTS = ["./surface"] as const;

const REQUIRED_INDEX_EXPORTS = [
  "ARCHITECTURE_AUTHORITY_SURFACE_RULE",
  "ARCHITECTURE_AUTHORITY_DATA_MODULES",
  "validateArchitecture",
  "ARCHITECTURE_BASELINE_FINGERPRINT",
] as const;

const CONSUMER_SCAN_ROOTS = ARCHITECTURE_AUTHORITY_CONSUMER_SCAN_ROOTS.map(
  (relativePath) => join(repoRoot, relativePath)
);

/** Root package import only — `./surface` barrel is allowed. */
const FORBIDDEN_DEEP_IMPORT_PATTERN =
  /@afenda\/architecture-authority\/(?!surface["'])[^"']+/;

export interface ArchitectureAuthoritySurfaceViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
}

function listProductionSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "__tests__" ||
        entry.name === "node_modules" ||
        entry.name === "dist"
      ) {
        continue;
      }
      files.push(...listProductionSourceFiles(fullPath));
      continue;
    }

    if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/\.(test|spec)\.tsx?$/.test(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      files.push(...listSourceFiles(fullPath));
      continue;
    }

    if (/\.(ts|tsx|mts|mjs)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function isNewerOrEqual(sourcePath: string, distPath: string): boolean {
  if (!existsSync(distPath)) {
    return false;
  }

  return statSync(distPath).mtimeMs >= statSync(sourcePath).mtimeMs;
}

function readPackageJsonDependencies(packageJsonPath: string): Record<string, string> {
  if (!existsSync(packageJsonPath)) {
    return {};
  }

  const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    dependencies?: Record<string, string>;
  };

  return parsed.dependencies ?? {};
}

function packageJsonPathFor(packageName: string): string | null {
  const entry = packageContract.packages.find(
    (pkg) => pkg.packageName === packageName && pkg.filesystemRequired
  );
  if (!entry) {
    return null;
  }

  return join(repoRoot, entry.path, "package.json");
}

function layerDocMatchesAssignment(
  layerDoc: string,
  packageName: string,
  layer: string
): boolean {
  const overrides = LAYER_DOC_DISPLAY_OVERRIDES[packageName];
  const layerLabels = overrides ?? [layer];

  return layerLabels.some((label) =>
    layerDoc.includes(`| \`${packageName}\` | ${label}`)
  );
}

function referencesForbiddenErpPermissionSymbol(
  source: string,
  symbol: string
): boolean {
  if (symbol === "export const PERMISSION_REGISTRY") {
    return /export\s+const\s+PERMISSION_REGISTRY\b/.test(source);
  }

  if (symbol === "class PermissionEngine") {
    return /class\s+PermissionEngine\b/.test(source);
  }

  return source.includes(symbol);
}

function verifyDocRegistryAlignment(
  violations: ArchitectureAuthoritySurfaceViolation[]
): void {
  for (const doc of ARCHITECTURE_AUTHORITY_CANONICAL_DOCS) {
    const docPath = join(repoRoot, doc.path);
    if (!existsSync(docPath)) {
      violations.push({
        rule: "canonical-doc-missing",
        file: docPath,
        message: `Missing canonical architecture doc: ${doc.path}`,
      });
      continue;
    }

    const docSource = readFileSync(docPath, "utf8");

    if (
      doc.fingerprintRequired &&
      !docSource.includes(ARCHITECTURE_BASELINE_FINGERPRINT)
    ) {
      violations.push({
        rule: "doc-fingerprint-drift",
        file: docPath,
        message: `${doc.path} must include fingerprint ${ARCHITECTURE_BASELINE_FINGERPRINT}`,
      });
    }
  }

  const packageDocPath = join(repoRoot, "docs/architecture/package-registry.md");
  if (existsSync(packageDocPath)) {
    const packageDoc = readFileSync(packageDocPath, "utf8");
    const activePackages = packageContract.packages.filter(
      (pkg) => pkg.filesystemRequired && pkg.lifecycle !== "planned"
    );

    if (
      !packageDoc.includes(`| **Active workspaces** | ${activePackages.length} |`)
    ) {
      violations.push({
        rule: "doc-package-count-drift",
        file: packageDocPath,
        message: `package-registry.md active workspace count must be ${activePackages.length}`,
      });
    }

    for (const pkg of activePackages) {
      if (!packageDoc.includes(pkg.packageName)) {
        violations.push({
          rule: "doc-package-drift",
          file: packageDocPath,
          message: `package-registry.md missing active package ${pkg.packageName}`,
        });
      }
    }
  }

  const dependencyDocPath = join(
    repoRoot,
    "docs/architecture/dependency-registry.md"
  );
  if (existsSync(dependencyDocPath)) {
    const dependencyDoc = readFileSync(dependencyDocPath, "utf8");

    for (const edge of dependencyContract.runtimeEdges) {
      const rowPattern = `| \`${edge.from}\` | \`${edge.to}\` |`;
      if (!dependencyDoc.includes(rowPattern)) {
        violations.push({
          rule: "doc-dependency-drift",
          file: dependencyDocPath,
          message: `dependency-registry.md missing runtime edge ${edge.from} → ${edge.to}. Run ${ARCHITECTURE_DOC_SYNC_COMMANDS.dependencySnapshot}.`,
        });
      }
    }

    for (const [packageName, approvedDeps] of Object.entries(
      dependencyContract.approvedRuntimeByPackage
    )) {
      const summaryRow = `| \`${packageName}\` |`;
      if (!dependencyDoc.includes(summaryRow)) {
        violations.push({
          rule: "doc-dependency-summary-drift",
          file: dependencyDocPath,
          message: `dependency-registry.md missing approved dependency summary for ${packageName}`,
        });
        continue;
      }

      for (const dependency of approvedDeps) {
        if (!dependencyDoc.includes(dependency)) {
          violations.push({
            rule: "doc-dependency-summary-drift",
            file: dependencyDocPath,
            message: `dependency-registry.md missing approved dependency ${packageName} → ${dependency}`,
          });
        }
      }
    }
  }

  const layerDocPath = join(repoRoot, "docs/architecture/layer-registry.md");
  if (existsSync(layerDocPath)) {
    const layerDoc = readFileSync(layerDocPath, "utf8");
    const activeLayerCount = Object.keys(layerContract.assignments).length;

    if (!layerDoc.includes(`active — ${activeLayerCount}`)) {
      violations.push({
        rule: "doc-layer-count-drift",
        file: layerDocPath,
        message: `layer-registry.md active package count must be ${activeLayerCount}`,
      });
    }

    for (const [packageName, layer] of Object.entries(layerContract.assignments)) {
      if (!layerDoc.includes(`\`${packageName}\``)) {
        violations.push({
          rule: "doc-layer-drift",
          file: layerDocPath,
          message: `layer-registry.md missing layer assignment for ${packageName}`,
        });
        continue;
      }

      if (!layerDocMatchesAssignment(layerDoc, packageName, layer)) {
        violations.push({
          rule: "doc-layer-drift",
          file: layerDocPath,
          message: `layer-registry.md missing layer assignment ${packageName} → ${layer}`,
        });
      }
    }
  }
}

async function verifyLiveArchitectureValidation(
  violations: ArchitectureAuthoritySurfaceViolation[]
): Promise<void> {
  const distIndex = join(authorityRoot, "dist/index.js");
  if (!existsSync(distIndex)) {
    violations.push({
      rule: "dist-missing",
      file: distIndex,
      message:
        "Missing dist/index.js — run pnpm --filter @afenda/architecture-authority build",
    });
    return;
  }

  const authority = await import(pathToFileURL(distIndex).href);
  const workspaces = authority.discoverWorkspaces(repoRoot);
  const result = authority.validateArchitecture(workspaces);

  if (!result.ok) {
    for (const violation of result.violations) {
      violations.push({
        rule: "architecture-validation",
        file: distIndex,
        message: `(${violation.gate})${violation.packageName ? ` [${violation.packageName}]` : ""} ${violation.message}`,
      });
    }
  }
}

export async function checkArchitectureAuthoritySurface(): Promise<
  ArchitectureAuthoritySurfaceViolation[]
> {
  const violations: ArchitectureAuthoritySurfaceViolation[] = [];

  for (const module of [
    ...ARCHITECTURE_AUTHORITY_DATA_MODULES,
    ...ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES,
  ]) {
    const modulePath = join(authoritySrcRoot, module.path);
    if (!existsSync(modulePath)) {
      violations.push({
        rule: "required-module-missing",
        file: modulePath,
        message: `Missing architecture authority module ${module.path}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    for (const exportName of module.primaryExports) {
      if (!moduleSource.includes(exportName)) {
        violations.push({
          rule: "registry-export-drift",
          file: modulePath,
          message: `Registry expects ${exportName} in ${module.path}`,
        });
      }
    }
  }

  if (!existsSync(surfaceIndexSource)) {
    violations.push({
      rule: "surface-barrel-missing",
      file: surfaceIndexSource,
      message: "packages/architecture-authority/src/surface/index.ts is required",
    });
  }

  verifyDocRegistryAlignment(violations);

  const snapshotPath = join(repoRoot, ARCHITECTURE_AUTHORITY_DEPENDENCY_SNAPSHOT);
  if (!existsSync(snapshotPath)) {
    violations.push({
      rule: "dependency-snapshot-missing",
      file: snapshotPath,
      message: `Run ${ARCHITECTURE_DOC_SYNC_COMMANDS.dependencySnapshot} to generate ${ARCHITECTURE_AUTHORITY_DEPENDENCY_SNAPSHOT}`,
    });
  } else {
    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as {
      fingerprint?: string;
      runtimeEdges?: Array<{ from: string; to: string }>;
    };

    if (snapshot.fingerprint !== ARCHITECTURE_BASELINE_FINGERPRINT) {
      violations.push({
        rule: "dependency-snapshot-fingerprint-drift",
        file: snapshotPath,
        message: `dependency-snapshot.json fingerprint must be ${ARCHITECTURE_BASELINE_FINGERPRINT}`,
      });
    }

    const expectedEdgeCount = dependencyContract.runtimeEdges.length;
    const snapshotEdgeCount = snapshot.runtimeEdges?.length ?? 0;
    if (snapshotEdgeCount !== expectedEdgeCount) {
      violations.push({
        rule: "dependency-snapshot-edge-drift",
        file: snapshotPath,
        message: `dependency-snapshot.json has ${snapshotEdgeCount} edges; registry declares ${expectedEdgeCount}. Run ${ARCHITECTURE_DOC_SYNC_COMMANDS.dependencySnapshot}.`,
      });
    }
  }

  for (const edge of MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES) {
    const fromPath = packageJsonPathFor(edge.from);
    if (!fromPath) {
      continue;
    }

    const fromDeps = readPackageJsonDependencies(fromPath);
    if (edge.to in fromDeps) {
      violations.push({
        rule: "multi-tenancy-forbidden-edge",
        file: fromPath,
        message: `${edge.from} must not depend on ${edge.to}: ${edge.reason}`,
      });
    }
  }

  for (const rule of MULTI_TENANCY_FORBIDDEN_PACKAGE_DEPENDENCIES) {
    const packageJsonPath = packageJsonPathFor(rule.packageName);
    if (!packageJsonPath) {
      continue;
    }

    const dependencies = readPackageJsonDependencies(packageJsonPath);
    for (const forbidden of rule.forbidden) {
      if (forbidden in dependencies) {
        violations.push({
          rule: "multi-tenancy-forbidden-dependency",
          file: packageJsonPath,
          message: `${rule.packageName} must not depend on ${forbidden}: ${rule.reason}`,
        });
      }
    }
  }

  const erpScanRoot = join(repoRoot, ERP_PERMISSION_ENGINE_SCAN_ROOT);
  for (const file of listProductionSourceFiles(erpScanRoot)) {
    if (file.includes("__tests__")) {
      continue;
    }

    const source = readFileSync(file, "utf8");
    for (const symbol of ERP_FORBIDDEN_PERMISSION_ENGINE_SYMBOLS) {
      if (referencesForbiddenErpPermissionSymbol(source, symbol)) {
        violations.push({
          rule: "erp-permission-engine-duplication",
          file,
          message: `ERP must delegate permission evaluation to @afenda/permissions — found ${symbol}`,
        });
      }
    }
  }

  if (existsSync(authorityPackageJson)) {
    const packageJson = JSON.parse(
      readFileSync(authorityPackageJson, "utf8")
    ) as {
      dependencies?: Record<string, string>;
      exports?: Record<string, unknown>;
    };

    for (const exportKey of REQUIRED_PACKAGE_EXPORTS) {
      if (!(exportKey in (packageJson.exports ?? {}))) {
        violations.push({
          rule: "package-export-missing",
          file: authorityPackageJson,
          message: `Missing package.json export "${exportKey}" for architecture authority barrel`,
        });
      }
    }

    for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
      if (dependency.startsWith("@afenda/")) {
        violations.push({
          rule: "unapproved-afenda-dependency",
          file: authorityPackageJson,
          message: `${dependency} is not an approved @afenda/architecture-authority runtime dependency`,
        });
      }
    }
  }

  if (existsSync(indexSource)) {
    const indexSourceText = readFileSync(indexSource, "utf8");

    if (!indexSourceText.includes('from "./surface/index.js"')) {
      violations.push({
        rule: "index-surface-barrel",
        file: indexSource,
        message: "index.ts must export surface registry from ./surface/index.js",
      });
    }

    for (const symbol of REQUIRED_INDEX_EXPORTS) {
      if (!indexSourceText.includes(symbol)) {
        violations.push({
          rule: "index-export-missing",
          file: indexSource,
          message: `${symbol} must be exported from index.ts`,
        });
      }
    }
  }

  if (!existsSync(registrySource)) {
    violations.push({
      rule: "registry-missing",
      file: registrySource,
      message: "architecture-authority-surface-registry.ts is required",
    });
  } else {
    const registryText = readFileSync(registrySource, "utf8");
    if (!registryText.includes("ARCHITECTURE_AUTHORITY_SURFACE_RULE")) {
      violations.push({
        rule: "registry-missing",
        file: registrySource,
        message:
          "architecture-authority-surface-registry.ts must declare ARCHITECTURE_AUTHORITY_SURFACE_RULE",
      });
    }
  }

  for (const scanRoot of CONSUMER_SCAN_ROOTS) {
    for (const file of listSourceFiles(scanRoot)) {
      const source = readFileSync(file, "utf8");

      if (FORBIDDEN_DEEP_IMPORT_PATTERN.test(source)) {
        violations.push({
          rule: "forbidden-deep-import",
          file,
          message:
            "Import @afenda/architecture-authority root or /surface barrel only — not internal paths",
        });
      }
    }
  }

  const distIndex = join(authorityRoot, "dist/index.d.ts");
  if (!existsSync(distIndex)) {
    violations.push({
      rule: "dist-missing",
      file: distIndex,
      message:
        "Missing dist/index.d.ts — run pnpm --filter @afenda/architecture-authority build",
    });
  } else if (existsSync(indexSource)) {
    const distSource = readFileSync(distIndex, "utf8");
    for (const symbol of REQUIRED_INDEX_EXPORTS) {
      if (!distSource.includes(symbol)) {
        violations.push({
          rule: "dist-export-missing",
          file: distIndex,
          message: `Built dist missing ${symbol} — run pnpm --filter @afenda/architecture-authority build`,
        });
      }
    }

    if (!isNewerOrEqual(indexSource, distIndex)) {
      violations.push({
        rule: "stale-dist",
        file: distIndex,
        message:
          "dist/index.d.ts is older than src/index.ts — run pnpm --filter @afenda/architecture-authority build",
      });
    }
  }

  const surfaceDist = join(authorityRoot, "dist/surface/index.d.ts");
  if (!existsSync(surfaceDist)) {
    violations.push({
      rule: "surface-dist-missing",
      file: surfaceDist,
      message:
        "Missing dist/surface/index.d.ts — run pnpm --filter @afenda/architecture-authority build",
    });
  } else if (
    existsSync(surfaceIndexSource) &&
    !isNewerOrEqual(surfaceIndexSource, surfaceDist)
  ) {
    violations.push({
      rule: "stale-surface-dist",
      file: surfaceDist,
      message:
        "dist/surface/index.d.ts is older than src — run pnpm --filter @afenda/architecture-authority build",
    });
  }

  await verifyLiveArchitectureValidation(violations);

  return violations;
}

export function formatArchitectureAuthoritySurfaceViolations(
  violations: readonly ArchitectureAuthoritySurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

async function main(): Promise<void> {
  const violations = await checkArchitectureAuthoritySurface();
  if (violations.length > 0) {
    console.error(formatArchitectureAuthoritySurfaceViolations(violations));
    process.exit(1);
  }

  console.log("Architecture authority surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-architecture-authority-surface.mts")
    );
  } catch {
    return entry.endsWith("check-architecture-authority-surface.mts");
  }
})();

if (isDirectRun) {
  void main();
}
