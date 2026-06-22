/**
 * Shared §432–445 dependency enforcement — single source for dependency-rules gate.
 * Architecture-authority gate handles doc/registry sync only (see MULTI_TENANCY_GATE_OWNERSHIP).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

import type {
  ArchitectureViolation,
  ValidationGate,
} from "../../../packages/architecture-authority/src/contracts/validation-result.contract.ts";
import { packageContract } from "../../../packages/architecture-authority/src/data/package-registry.data.ts";
import {
  ARCHITECTURE_DOC_SYNC_COMMANDS,
  ARCHITECTURE_REGISTRY_DRIFT_SOURCES,
  ERP_FORBIDDEN_PERMISSION_ENGINE_SYMBOLS,
  ERP_PERMISSION_ENGINE_ORCHESTRATION_RELATIVE_PATHS,
  ERP_PERMISSION_ENGINE_SCAN_ROOT,
  MULTI_TENANCY_FORBIDDEN_PACKAGE_DEPENDENCIES,
  MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES,
} from "../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts";
import { GOVERNANCE_DIST_BUILD_SCRIPT } from "../delivery-evidence-surface-registry.mts";

const DEPENDENCY_REGISTRY_PATH = ARCHITECTURE_REGISTRY_DRIFT_SOURCES.dependency;

export interface DependencyEnforcementViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
}

export function isDistNewerOrEqual(
  sourcePath: string,
  distPath: string
): boolean {
  if (!existsSync(distPath) || !existsSync(sourcePath)) {
    return false;
  }

  return statSync(distPath).mtimeMs >= statSync(sourcePath).mtimeMs;
}

export function collectArchitectureAuthorityDistFreshnessViolations(
  repoRoot: string
): DependencyEnforcementViolation[] {
  const violations: DependencyEnforcementViolation[] = [];
  const authorityRoot = join(repoRoot, "packages/architecture-authority");
  const indexSource = join(authorityRoot, "src/index.ts");
  const distIndexJs = join(authorityRoot, "dist/index.js");
  const distIndexDts = join(authorityRoot, "dist/index.d.ts");

  if (!existsSync(distIndexJs)) {
    violations.push({
      rule: "dist-missing",
      file: distIndexJs,
      message: `Missing dist/index.js — run ${GOVERNANCE_DIST_BUILD_SCRIPT} before dependency-rules gate`,
    });
    return violations;
  }

  if (existsSync(indexSource) && !isDistNewerOrEqual(indexSource, distIndexJs)) {
    violations.push({
      rule: "stale-dist",
      file: distIndexJs,
      message: `dist/index.js is older than src/index.ts — run ${GOVERNANCE_DIST_BUILD_SCRIPT}`,
    });
  }

  if (
    existsSync(indexSource) &&
    existsSync(distIndexDts) &&
    !isDistNewerOrEqual(indexSource, distIndexDts)
  ) {
    violations.push({
      rule: "stale-dist",
      file: distIndexDts,
      message: `dist/index.d.ts is older than src/index.ts — run ${GOVERNANCE_DIST_BUILD_SCRIPT}`,
    });
  }

  return violations;
}

function packageJsonPathFor(
  repoRoot: string,
  packageName: string
): string | null {
  const entry = packageContract.packages.find(
    (pkg) => pkg.packageName === packageName && pkg.filesystemRequired
  );
  if (!entry) {
    return null;
  }

  return join(repoRoot, entry.path, "package.json");
}

function readPackageJsonDependencies(
  packageJsonPath: string
): Record<string, string> {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };

  return {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
    ...(packageJson.peerDependencies ?? {}),
  };
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

function isErpPermissionOrchestrationFile(
  repoRoot: string,
  absolutePath: string
): boolean {
  const relativePath = relative(repoRoot, absolutePath).replace(/\\/g, "/");
  return ERP_PERMISSION_ENGINE_ORCHESTRATION_RELATIVE_PATHS.some(
    (allowedPath) => relativePath === allowedPath
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

function formatDependenciesGateRemediation(
  violation: ArchitectureViolation
): string {
  const unapproved = violation.message.match(
    /^unapproved runtime dependency (.+?) → (.+)$/
  );
  if (unapproved) {
    const from = unapproved[1] ?? "";
    const to = unapproved[2] ?? "";
    return `Add ["${from}", "${to}"] to runtimeEdges and include "${to}" in approvedRuntimeByPackage["${from}"] inside ${DEPENDENCY_REGISTRY_PATH}, then run ${ARCHITECTURE_DOC_SYNC_COMMANDS.dependencySnapshot} and ${ARCHITECTURE_DOC_SYNC_COMMANDS.architectureValidation}`;
  }

  const missingDeclared = violation.message.match(
    /^declared dependency missing from package\.json: (.+?) → (.+)$/
  );
  if (missingDeclared) {
    const from = missingDeclared[1] ?? "";
    const to = missingDeclared[2] ?? "";
    return `Add "${to}" to dependencies in ${from} package.json or remove it from approvedRuntimeByPackage in ${DEPENDENCY_REGISTRY_PATH}`;
  }

  return `Fix ${DEPENDENCY_REGISTRY_PATH} (runtimeEdges + approvedRuntimeByPackage), then run ${ARCHITECTURE_DOC_SYNC_COMMANDS.dependencySnapshot} and ${ARCHITECTURE_DOC_SYNC_COMMANDS.architectureValidation}`;
}

/** Maps validateArchitecture gate ids to registry fix locations (registry drift mitigation). */
export const ARCHITECTURE_VALIDATION_REMEDIATION_BY_GATE: Record<
  ValidationGate,
  string
> = {
  dependencies: DEPENDENCY_REGISTRY_PATH,
  "forbidden-dependencies": DEPENDENCY_REGISTRY_PATH,
  cycles: "dependency graph (see pnpm architecture:cycles)",
  registry: ARCHITECTURE_REGISTRY_DRIFT_SOURCES.package,
  layers: ARCHITECTURE_REGISTRY_DRIFT_SOURCES.layer,
  ownership: ARCHITECTURE_REGISTRY_DRIFT_SOURCES.ownership,
  exceptions: ARCHITECTURE_REGISTRY_DRIFT_SOURCES.dependency,
};

export function formatArchitectureValidationRemediation(
  violation: ArchitectureViolation
): string {
  switch (violation.gate) {
    case "dependencies":
      return formatDependenciesGateRemediation(violation);
    case "forbidden-dependencies":
      return `Remove forbidden dependency or update ${DEPENDENCY_REGISTRY_PATH}`;
    case "cycles":
      return "Break dependency cycle — run pnpm architecture:cycles";
    case "registry":
      return `Register package in ${ARCHITECTURE_REGISTRY_DRIFT_SOURCES.package}`;
    case "layers":
      return `Update layer assignment in ${ARCHITECTURE_REGISTRY_DRIFT_SOURCES.layer}`;
    case "ownership":
      return `Update ownership in ${ARCHITECTURE_REGISTRY_DRIFT_SOURCES.ownership}`;
    case "exceptions":
      return `Review exception registry in ${ARCHITECTURE_REGISTRY_DRIFT_SOURCES.dependency}`;
    default: {
      const _exhaustive: never = violation.gate;
      return _exhaustive;
    }
  }
}

export function collectForbiddenRuntimeEdgeViolations(
  repoRoot: string
): DependencyEnforcementViolation[] {
  const violations: DependencyEnforcementViolation[] = [];

  for (const edge of MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES) {
    const fromPath = packageJsonPathFor(repoRoot, edge.from);
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

  return violations;
}

export function collectForbiddenPackageDependencyViolations(
  repoRoot: string
): DependencyEnforcementViolation[] {
  const violations: DependencyEnforcementViolation[] = [];

  for (const rule of MULTI_TENANCY_FORBIDDEN_PACKAGE_DEPENDENCIES) {
    const packageJsonPath = packageJsonPathFor(repoRoot, rule.packageName);
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

  return violations;
}

export function collectErpPermissionEngineDuplicationViolations(
  repoRoot: string
): DependencyEnforcementViolation[] {
  const violations: DependencyEnforcementViolation[] = [];
  const erpScanRoot = join(repoRoot, ERP_PERMISSION_ENGINE_SCAN_ROOT);

  for (const file of listProductionSourceFiles(erpScanRoot)) {
    if (isErpPermissionOrchestrationFile(repoRoot, file)) {
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

  return violations;
}

export async function collectLiveArchitectureValidationViolations(
  repoRoot: string
): Promise<DependencyEnforcementViolation[]> {
  const violations: DependencyEnforcementViolation[] = [];
  const authorityRoot = join(repoRoot, "packages/architecture-authority");
  const distIndex = join(authorityRoot, "dist/index.js");

  if (!existsSync(distIndex)) {
    return violations;
  }

  const authority = await import(pathToFileURL(distIndex).href);
  const workspaces = authority.discoverWorkspaces(repoRoot);
  const result = authority.validateArchitecture(workspaces);

  if (!result.ok) {
    for (const violation of result.violations) {
      const remediation = formatArchitectureValidationRemediation(violation);
      violations.push({
        rule: "architecture-validation",
        file: join(repoRoot, DEPENDENCY_REGISTRY_PATH),
        message: `(${violation.gate})${violation.packageName ? ` [${violation.packageName}]` : ""} ${violation.message} — ${remediation}`,
      });
    }
  }

  return violations;
}
