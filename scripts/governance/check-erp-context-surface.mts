#!/usr/bin/env tsx
/**
 * ERP context surface gate (multi-tenancy.md §386–401).
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpRoot = join(repoRoot, "apps/erp");
const erpSrcRoot = join(erpRoot, "src");
const contextRoot = join(erpSrcRoot, "lib/context");

const ERP_CONTEXT_SCAN_ROOTS = [
  contextRoot,
  join(erpSrcRoot, "lib/api"),
  join(erpSrcRoot, "server/api"),
  join(erpSrcRoot, "lib/server-actions"),
  join(erpSrcRoot, "app/(protected)/actions"),
] as const;

const REQUIRED_CONTEXT_MODULES = [
  "tenant-domain.server.ts",
  "resolve-operating-context.server.ts",
  "resolve-legal-entity-context.server.ts",
  "resolve-grant-scope.server.ts",
  "context-errors.ts",
  "context-switch.action.ts",
] as const;

const FORBIDDEN_ERP_IMPORT_PATTERNS = [
  /@afenda\/kernel\/dist\//,
  /@afenda\/kernel\/src\//,
  /@afenda\/database\/dist\//,
  /@afenda\/database\/src\//,
  /@afenda\/database\/(company|organization|rls|workspace|membership)\//,
  /@afenda\/database\/(tenant|entity-group|legal-entity|ownership-interest|organization-unit|team|project|grant-scope|tenant-domain)\/[^"']+/,
  /@afenda\/permissions\/(dist|src)\//,
] as const;

const AUTHORITY_GUARD_FILES = [
  {
    path: join(erpSrcRoot, "lib/context/reject-untrusted-authority-fields.ts"),
    rule: "authority-guard-module",
    message: "reject-untrusted-authority-fields.ts is required",
  },
  {
    path: join(
      erpSrcRoot,
      "lib/server-actions/parse-protected-action-input.ts"
    ),
    rule: "authority-guard-actions",
    needle: "rejectUntrustedAuthorityFields",
    message:
      "parse-protected-action-input.ts must reject untrusted authority fields",
  },
  {
    path: join(erpSrcRoot, "server/api/runtime/api-validation.ts"),
    rule: "authority-guard-api",
    needle: "rejectUntrustedAuthorityFields",
    message: "api-validation.ts must reject untrusted authority fields",
  },
] as const;

export interface ErpContextSurfaceViolation {
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

export function checkErpContextSurface(): ErpContextSurfaceViolation[] {
  const violations: ErpContextSurfaceViolation[] = [];

  const proxyPath = join(erpSrcRoot, "proxy.ts");
  const middlewarePath = join(erpSrcRoot, "middleware.ts");

  if (!existsSync(proxyPath)) {
    violations.push({
      rule: "proxy-missing",
      file: proxyPath,
      message:
        "apps/erp/src/proxy.ts is required for tenant routing (Next.js 16+)",
    });
  }

  if (existsSync(middlewarePath)) {
    violations.push({
      rule: "middleware-legacy",
      file: middlewarePath,
      message:
        "Remove legacy middleware.ts — tenant routing lives in proxy.ts for Next.js 16+",
    });
  }

  if (existsSync(proxyPath)) {
    const proxySource = readFileSync(proxyPath, "utf8");
    if (!proxySource.includes("TENANT_SLUG_HEADER")) {
      violations.push({
        rule: "proxy-tenant-header",
        file: proxyPath,
        message: "proxy.ts must inject x-tenant-slug header",
      });
    }
    if (!proxySource.includes("@/lib/context/tenant-domain")) {
      violations.push({
        rule: "proxy-tenant-domain-import",
        file: proxyPath,
        message: "proxy.ts must resolve tenant slug via tenant-domain module",
      });
    }
  }

  for (const moduleName of REQUIRED_CONTEXT_MODULES) {
    const modulePath = join(contextRoot, moduleName);
    if (!existsSync(modulePath)) {
      violations.push({
        rule: "context-module-missing",
        file: modulePath,
        message: `Missing ERP context module ${moduleName}`,
      });
    }
  }

  const tenantDomainPath = join(contextRoot, "tenant-domain.ts");
  if (!existsSync(tenantDomainPath)) {
    violations.push({
      rule: "tenant-domain-pure-missing",
      file: tenantDomainPath,
      message: "tenant-domain.ts (edge-safe pure helpers) is required",
    });
  }

  const grantScopePath = join(contextRoot, "resolve-grant-scope.server.ts");
  if (existsSync(grantScopePath)) {
    const grantScopeSource = readFileSync(grantScopePath, "utf8");
    if (!grantScopeSource.includes("resolvePermissionScopeContext")) {
      violations.push({
        rule: "grant-scope-delegation",
        file: grantScopePath,
        message:
          "resolve-grant-scope.server.ts must delegate to @afenda/permissions",
      });
    }
  }

  const legalEntityPath = join(
    contextRoot,
    "resolve-legal-entity-context.server.ts"
  );
  if (existsSync(legalEntityPath)) {
    const legalEntitySource = readFileSync(legalEntityPath, "utf8");
    if (!legalEntitySource.includes("toLegalEntityContext")) {
      violations.push({
        rule: "legal-entity-mapper",
        file: legalEntityPath,
        message:
          "resolve-legal-entity-context.server.ts must map company rows to LegalEntityContext",
      });
    }
  }

  const operatingContextPath = join(
    contextRoot,
    "resolve-operating-context.server.ts"
  );
  if (existsSync(operatingContextPath)) {
    const operatingContextSource = readFileSync(operatingContextPath, "utf8");
    for (const needle of [
      "resolveLegalEntityContext",
      "resolveGrantScope",
      "verifyProjectBoundary",
      "toProjectContext",
      "denyOperatingContext",
    ] as const) {
      if (!operatingContextSource.includes(needle)) {
        violations.push({
          rule: "operating-context-wiring",
          file: operatingContextPath,
          message: `resolve-operating-context.server.ts must delegate via ${needle}`,
        });
      }
    }
  }

  const fromHeadersPath = join(
    contextRoot,
    "resolve-operating-context-from-headers.server.ts"
  );
  if (existsSync(fromHeadersPath)) {
    const fromHeadersSource = readFileSync(fromHeadersPath, "utf8");
    if (
      !fromHeadersSource.includes("buildOperatingContextSelectionFromRequest")
    ) {
      violations.push({
        rule: "from-headers-wiring",
        file: fromHeadersPath,
        message:
          "resolve-operating-context-from-headers.server.ts must use tenant-domain.server selection builder",
      });
    }
  }

  const selectionSchemaPath = join(
    contextRoot,
    "operating-context-selection.schema.ts"
  );
  if (existsSync(selectionSchemaPath)) {
    const selectionSchemaSource = readFileSync(selectionSchemaPath, "utf8");
    if (!selectionSchemaSource.includes(".strict()")) {
      violations.push({
        rule: "selection-schema-strict",
        file: selectionSchemaPath,
        message: "operating-context-selection.schema.ts must use .strict()",
      });
    }
    for (const forbiddenField of [
      "tenantId",
      "companyId",
      "organizationId",
      "projectId",
    ] as const) {
      if (selectionSchemaSource.includes(forbiddenField)) {
        violations.push({
          rule: "selection-schema-authority-field",
          file: selectionSchemaPath,
          message: `Selection schema must not accept authority field ${forbiddenField}`,
        });
      }
    }
  }

  for (const guardFile of AUTHORITY_GUARD_FILES) {
    if (!existsSync(guardFile.path)) {
      violations.push({
        rule: guardFile.rule,
        file: guardFile.path,
        message: guardFile.message,
      });
      continue;
    }

    if ("needle" in guardFile) {
      const source = readFileSync(guardFile.path, "utf8");
      if (!source.includes(guardFile.needle)) {
        violations.push({
          rule: guardFile.rule,
          file: guardFile.path,
          message: guardFile.message,
        });
      }
    }
  }

  for (const scanRoot of ERP_CONTEXT_SCAN_ROOTS) {
    for (const file of listSourceFiles(scanRoot)) {
      const source = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_ERP_IMPORT_PATTERNS) {
        if (pattern.test(source)) {
          violations.push({
            rule: "forbidden-deep-import",
            file,
            message:
              "Use @afenda/kernel, @afenda/database, or @afenda/database/{barrel} — not dist/src/legacy/deep paths",
          });
        }
      }
    }
  }

  return violations;
}

export function formatErpContextSurfaceViolations(
  violations: readonly ErpContextSurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkErpContextSurface();
  if (violations.length > 0) {
    console.error(formatErpContextSurfaceViolations(violations));
    process.exit(1);
  }

  console.log("ERP context surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-erp-context-surface.mts")
    );
  } catch {
    return entry.endsWith("check-erp-context-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
