#!/usr/bin/env tsx
/**
 * Database tenant-domain surface gate (multi-tenancy.md §371–384).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES,
  DATABASE_TENANT_DOMAIN_MODULES,
} from "../../packages/database/src/tenant-domain/tenant-domain-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const databaseRoot = join(repoRoot, "packages/database");
const databaseSrcRoot = join(databaseRoot, "src");
const databasePackageJson = join(databaseRoot, "package.json");
const publicApiSource = join(databaseSrcRoot, "public-api.ts");
const distPublicApi = join(databaseRoot, "dist/public-api.d.ts");

const CONSUMER_SCAN_ROOTS = [
  join(repoRoot, "apps/erp/src"),
  join(repoRoot, "packages/permissions/src"),
  join(repoRoot, "packages/auth/src"),
  join(repoRoot, "packages/kernel/src"),
] as const;

/** Barrel root imports (`@afenda/database/legal-entity`) are allowed; deeper paths are not. */
const FORBIDDEN_DOMAIN_DEEP_IMPORT =
  /@afenda\/database\/(tenant|entity-group|legal-entity|ownership-interest|organization-unit|team|project|grant-scope|tenant-domain)\/[^"']+/;

/** Legacy write paths — use glossary barrels or package root instead. */
const FORBIDDEN_LEGACY_IMPORT_PATTERNS = [
  /@afenda\/database\/dist\//,
  /@afenda\/database\/src\//,
  /@afenda\/database\/(company|organization|rls|workspace|membership)\//,
] as const;

const FORBIDDEN_IMPORT_PATTERNS = [
  ...FORBIDDEN_LEGACY_IMPORT_PATTERNS,
  FORBIDDEN_DOMAIN_DEEP_IMPORT,
] as const;

const REQUIRED_PACKAGE_EXPORT_PREFIX = "./";

const REQUIRED_PUBLIC_EXPORTS = [
  "DATABASE_TENANT_DOMAIN_MODULES",
  "PROJECT_DOMAIN_STATUS",
  "LegalEntityLookupRow",
  "OrganizationUnitLookupRow",
] as const;

export interface DatabaseTenantDomainViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
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

    if (
      /\.(ts|tsx|mts)$/.test(entry.name) &&
      !/\.(test|spec)\./.test(entry.name)
    ) {
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

export function checkDatabaseTenantDomainSurface(): DatabaseTenantDomainViolation[] {
  const violations: DatabaseTenantDomainViolation[] = [];

  for (const directory of DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES) {
    const indexPath = join(databaseSrcRoot, directory, "index.ts");
    if (!existsSync(indexPath)) {
      violations.push({
        rule: "barrel-missing",
        file: indexPath,
        message: `Missing index.ts for tenant-domain module ${directory}`,
      });
    }
  }

  const projectContract = join(databaseSrcRoot, "project/project.contract.ts");
  if (existsSync(projectContract)) {
    const projectSource = readFileSync(projectContract, "utf8");
    if (!projectSource.includes("PROJECT_DOMAIN_STATUS")) {
      violations.push({
        rule: "project-stub-marker",
        file: projectContract,
        message: "project.contract.ts must declare PROJECT_DOMAIN_STATUS",
      });
    }
  } else {
    violations.push({
      rule: "project-stub-missing",
      file: projectContract,
      message: "TIP-030 project authority stub is missing",
    });
  }

  const projectService = join(databaseSrcRoot, "project/project.service.ts");
  if (existsSync(projectService)) {
    violations.push({
      rule: "project-stub-no-service",
      file: projectService,
      message:
        "TIP-030 project must remain stub-only — remove project.service.ts",
    });
  }

  if (existsSync(databasePackageJson)) {
    const packageJson = JSON.parse(
      readFileSync(databasePackageJson, "utf8")
    ) as { exports?: Record<string, unknown> };
    const exportsMap = packageJson.exports ?? {};

    for (const directory of DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES) {
      const exportKey = `${REQUIRED_PACKAGE_EXPORT_PREFIX}${directory}`;
      if (!(exportKey in exportsMap)) {
        violations.push({
          rule: "package-export-missing",
          file: databasePackageJson,
          message: `Missing package.json export "${exportKey}" for tenant-domain barrel`,
        });
      }
    }
  }

  const grantScopeIndex = join(databaseSrcRoot, "grant-scope/index.ts");
  if (existsSync(grantScopeIndex)) {
    const grantScopeSource = readFileSync(grantScopeIndex, "utf8");
    if (!grantScopeSource.includes("rls-grant.contract")) {
      violations.push({
        rule: "grant-scope-alias",
        file: grantScopeIndex,
        message: "grant-scope/index.ts must re-export rls-grant.contract",
      });
    }
  }

  const legalEntityIndex = join(databaseSrcRoot, "legal-entity/index.ts");
  if (existsSync(legalEntityIndex)) {
    const legalEntitySource = readFileSync(legalEntityIndex, "utf8");
    if (!legalEntitySource.includes("../company/")) {
      violations.push({
        rule: "legal-entity-alias",
        file: legalEntityIndex,
        message: "legal-entity/index.ts must alias company/ writes",
      });
    }
  }

  if (existsSync(publicApiSource)) {
    const publicApi = readFileSync(publicApiSource, "utf8");
    for (const symbol of REQUIRED_PUBLIC_EXPORTS) {
      if (!publicApi.includes(symbol)) {
        violations.push({
          rule: "public-export-missing",
          file: publicApiSource,
          message: `${symbol} is not exported from public-api.ts`,
        });
      }
    }
  }

  for (const scanRoot of CONSUMER_SCAN_ROOTS) {
    for (const file of listSourceFiles(scanRoot)) {
      const source = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
        if (pattern.test(source)) {
          violations.push({
            rule: "forbidden-deep-import",
            file,
            message:
              "Use @afenda/database or @afenda/database/{tenant-domain-barrel} — not dist/src/legacy/deep paths",
          });
        }
      }
    }
  }

  if (existsSync(distPublicApi)) {
    const distSource = readFileSync(distPublicApi, "utf8");
    for (const symbol of REQUIRED_PUBLIC_EXPORTS) {
      if (!distSource.includes(symbol)) {
        violations.push({
          rule: "dist-export-missing",
          file: distPublicApi,
          message: `Built dist missing ${symbol} — run pnpm --filter @afenda/database build`,
        });
      }
    }

    if (!isNewerOrEqual(publicApiSource, distPublicApi)) {
      violations.push({
        rule: "stale-dist",
        file: distPublicApi,
        message:
          "dist/public-api.d.ts is older than src/public-api.ts — run pnpm --filter @afenda/database build",
      });
    }
  }

  for (const directory of DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES) {
    const barrelSource = join(databaseSrcRoot, directory, "index.ts");
    const barrelDist = join(databaseRoot, "dist", directory, "index.d.ts");

    if (!existsSync(barrelDist)) {
      violations.push({
        rule: "barrel-dist-missing",
        file: barrelDist,
        message: `Missing dist/${directory}/index.d.ts — run pnpm --filter @afenda/database build`,
      });
      continue;
    }

    if (existsSync(barrelSource) && !isNewerOrEqual(barrelSource, barrelDist)) {
      violations.push({
        rule: "stale-barrel-dist",
        file: barrelDist,
        message: `dist/${directory}/index.d.ts is older than src — run pnpm --filter @afenda/database build`,
      });
    }
  }

  const plannedModules = DATABASE_TENANT_DOMAIN_MODULES.filter(
    (module) => module.status === "planned"
  );
  if (
    plannedModules.length !== 1 ||
    plannedModules[0]?.directory !== "project"
  ) {
    violations.push({
      rule: "registry-planned-modules",
      file: join(databaseSrcRoot, "tenant-domain/tenant-domain-registry.ts"),
      message: "Only project module may remain planned (TIP-030)",
    });
  }

  return violations;
}

export function formatDatabaseTenantDomainViolations(
  violations: readonly DatabaseTenantDomainViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkDatabaseTenantDomainSurface();
  if (violations.length > 0) {
    console.error(formatDatabaseTenantDomainViolations(violations));
    process.exit(1);
  }

  console.log("Database tenant-domain surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-database-tenant-domain-surface.mts")
    );
  } catch {
    return entry.endsWith("check-database-tenant-domain-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
