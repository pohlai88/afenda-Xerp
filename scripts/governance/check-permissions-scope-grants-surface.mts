#!/usr/bin/env tsx
/**
 * Permissions scope/grants surface gate (multi-tenancy.md §403–409).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PERMISSIONS_LEGACY_FLAT_MODULES,
  PERMISSIONS_SCOPE_GRANTS_BARREL_DIRECTORIES,
  PERMISSIONS_SCOPE_GRANTS_MODULES,
} from "../../packages/permissions/src/permissions-scope-grants-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const permissionsRoot = join(repoRoot, "packages/permissions");
const permissionsSrcRoot = join(permissionsRoot, "src");
const permissionsPackageJson = join(permissionsRoot, "package.json");
const indexSource = join(permissionsSrcRoot, "index.ts");
const registrySource = join(
  permissionsSrcRoot,
  "permissions-scope-grants-registry.ts"
);

const CONSUMER_SCAN_ROOTS = [
  join(repoRoot, "apps/erp/src"),
  join(repoRoot, "packages/appshell/src"),
  join(repoRoot, "packages/auth/src"),
  join(repoRoot, "packages/kernel/src"),
] as const;

const PERMISSIONS_INTERNAL_SCAN_ROOTS = [permissionsSrcRoot] as const;

/** Barrel root imports (`@afenda/permissions/scope`) are allowed; deeper paths are not. */
const FORBIDDEN_PERMISSIONS_DEEP_IMPORT =
  /@afenda\/permissions\/(scope|grants)\/[^"']+/;

const FORBIDDEN_IMPORT_PATTERNS = [
  /@afenda\/permissions\/dist\//,
  /@afenda\/permissions\/src\//,
  FORBIDDEN_PERMISSIONS_DEEP_IMPORT,
] as const;

const REQUIRED_PACKAGE_EXPORTS = ["./scope", "./grants"] as const;

const REQUIRED_INDEX_EXPORTS = [
  "PERMISSIONS_SCOPE_GRANTS_MODULES",
  "PERMISSIONS_PLANNED_MEMBERSHIP_SCOPES",
  "resolveScopedMembership",
  "requirePermission",
  "PERMISSION_REGISTRY",
] as const;

export interface PermissionsScopeGrantsViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
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

    if (/\.(ts|tsx|mts)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function isPermissionsNonBarrelSubdirFile(file: string): boolean {
  const relative = file
    .replace(/\\/g, "/")
    .split("/packages/permissions/src/")[1];
  if (!relative?.includes("/")) {
    return false;
  }
  const topSegment = relative.split("/")[0];
  return topSegment !== "scope" && topSegment !== "grants";
}

function hasLegacyFlatImport(source: string): boolean {
  for (const legacyModule of PERMISSIONS_LEGACY_FLAT_MODULES) {
    const legacyImport = legacyModule.replace(".ts", ".js");
    if (
      source.includes(`from "../${legacyImport}"`) ||
      source.includes(`from "./${legacyImport}"`)
    ) {
      return true;
    }
  }
  return false;
}

function isNewerOrEqual(sourcePath: string, distPath: string): boolean {
  if (!existsSync(distPath)) {
    return false;
  }

  return statSync(distPath).mtimeMs >= statSync(sourcePath).mtimeMs;
}

export function checkPermissionsScopeGrantsSurface(): PermissionsScopeGrantsViolation[] {
  const violations: PermissionsScopeGrantsViolation[] = [];

  for (const module of PERMISSIONS_SCOPE_GRANTS_MODULES) {
    const moduleRoot = join(permissionsSrcRoot, module.directory);

    for (const fileName of module.requiredFiles) {
      const filePath = join(moduleRoot, fileName);
      if (!existsSync(filePath)) {
        violations.push({
          rule: "module-file-missing",
          file: filePath,
          message: `Missing ${module.directory}/${fileName} for ${module.glossaryTerm}`,
        });
      }
    }

    const indexPath = join(moduleRoot, "index.ts");
    if (!existsSync(indexPath)) {
      violations.push({
        rule: "barrel-missing",
        file: indexPath,
        message: `Missing index.ts for permissions module ${module.directory}`,
      });
    }
  }

  for (const legacyModule of PERMISSIONS_LEGACY_FLAT_MODULES) {
    const legacyPath = join(permissionsSrcRoot, legacyModule);
    if (existsSync(legacyPath)) {
      violations.push({
        rule: "legacy-flat-module",
        file: legacyPath,
        message: `Remove flat ${legacyModule} — canonical home is scope/ or grants/`,
      });
    }
  }

  if (existsSync(permissionsPackageJson)) {
    const packageJson = JSON.parse(
      readFileSync(permissionsPackageJson, "utf8")
    ) as { exports?: Record<string, unknown> };
    const exportsMap = packageJson.exports ?? {};

    for (const exportKey of REQUIRED_PACKAGE_EXPORTS) {
      if (!(exportKey in exportsMap)) {
        violations.push({
          rule: "package-export-missing",
          file: permissionsPackageJson,
          message: `Missing package.json export "${exportKey}" for permissions barrel`,
        });
      }
    }
  }

  if (existsSync(indexSource)) {
    const indexSourceText = readFileSync(indexSource, "utf8");

    if (!indexSourceText.includes('from "./scope/index.js"')) {
      violations.push({
        rule: "index-scope-barrel",
        file: indexSource,
        message: "index.ts must re-export scope surface from ./scope/index.js",
      });
    }

    if (!indexSourceText.includes('from "./grants/index.js"')) {
      violations.push({
        rule: "index-grants-barrel",
        file: indexSource,
        message: "index.ts must re-export grants surface from ./grants/index.js",
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

  if (existsSync(registrySource)) {
    const registryText = readFileSync(registrySource, "utf8");
    if (!registryText.includes("PERMISSIONS_SCOPE_GRANTS_MODULES")) {
      violations.push({
        rule: "registry-missing",
        file: registrySource,
        message:
          "permissions-scope-grants-registry.ts must declare PERMISSIONS_SCOPE_GRANTS_MODULES",
      });
    }
    if (!registryText.includes("PERMISSIONS_PLANNED_MEMBERSHIP_SCOPES")) {
      violations.push({
        rule: "registry-planned-scopes",
        file: registrySource,
        message:
          "permissions-scope-grants-registry.ts must declare TIP-008/TIP-030 planned membership scopes",
      });
    }
    if (!registryText.includes("PERMISSIONS_BARREL_DEPENDENCY_RULE")) {
      violations.push({
        rule: "registry-barrel-dependency",
        file: registrySource,
        message:
          "permissions-scope-grants-registry.ts must declare PERMISSIONS_BARREL_DEPENDENCY_RULE",
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registrySource,
      message: "permissions-scope-grants-registry.ts is required",
    });
  }

  for (const scanRoot of [...CONSUMER_SCAN_ROOTS, ...PERMISSIONS_INTERNAL_SCAN_ROOTS]) {
    for (const file of listSourceFiles(scanRoot)) {
      const source = readFileSync(file, "utf8");

      for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
        if (pattern.test(source)) {
          violations.push({
            rule: "forbidden-import",
            file,
            message:
              "Use @afenda/permissions or @afenda/permissions/{scope|grants} — not dist/src/deep paths",
          });
        }
      }

      if (isPermissionsNonBarrelSubdirFile(file) && hasLegacyFlatImport(source)) {
        violations.push({
          rule: "legacy-flat-import",
          file,
          message:
            "Import from ./scope/index.js or ./grants/index.js — not flat legacy module paths",
        });
      }
    }
  }

  const scopeRoot = join(permissionsSrcRoot, "scope");
  for (const file of listSourceFiles(scopeRoot)) {
    const source = readFileSync(file, "utf8");
    if (source.includes("../grants/") || source.includes("@afenda/permissions/grants")) {
      violations.push({
        rule: "scope-imports-grants",
        file,
        message:
          "scope/ must not import grants/ — move shared types to scope/ (e.g. role-scope.contract.ts)",
      });
    }
  }

  for (const directory of PERMISSIONS_SCOPE_GRANTS_BARREL_DIRECTORIES) {
    const barrelSource = join(permissionsSrcRoot, directory, "index.ts");
    const barrelDist = join(permissionsRoot, "dist", directory, "index.d.ts");

    if (!existsSync(barrelDist)) {
      violations.push({
        rule: "barrel-dist-missing",
        file: barrelDist,
        message: `Missing dist/${directory}/index.d.ts — run pnpm --filter @afenda/permissions build`,
      });
      continue;
    }

    if (existsSync(barrelSource) && !isNewerOrEqual(barrelSource, barrelDist)) {
      violations.push({
        rule: "stale-barrel-dist",
        file: barrelDist,
        message: `dist/${directory}/index.d.ts is older than src — run pnpm --filter @afenda/permissions build`,
      });
    }
  }

  const distIndex = join(permissionsRoot, "dist/index.d.ts");
  if (existsSync(distIndex) && existsSync(indexSource)) {
    const distSource = readFileSync(distIndex, "utf8");
    for (const symbol of REQUIRED_INDEX_EXPORTS) {
      if (!distSource.includes(symbol)) {
        violations.push({
          rule: "dist-export-missing",
          file: distIndex,
          message: `Built dist missing ${symbol} — run pnpm --filter @afenda/permissions build`,
        });
      }
    }

    if (!isNewerOrEqual(indexSource, distIndex)) {
      violations.push({
        rule: "stale-dist",
        file: distIndex,
        message:
          "dist/index.d.ts is older than src/index.ts — run pnpm --filter @afenda/permissions build",
      });
    }
  }

  return violations;
}

export function formatPermissionsScopeGrantsViolations(
  violations: readonly PermissionsScopeGrantsViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkPermissionsScopeGrantsSurface();
  if (violations.length > 0) {
    console.error(formatPermissionsScopeGrantsViolations(violations));
    process.exit(1);
  }

  console.log("Permissions scope/grants surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-permissions-scope-grants-surface.mts")
    );
  } catch {
    return entry.endsWith("check-permissions-scope-grants-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
