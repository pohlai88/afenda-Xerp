#!/usr/bin/env tsx
/**
 * PAS-001A B71 — permission-scope ownership split gate.
 *
 * Wire assert/parse in @afenda/permissions; kernel projection-only branding.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES } from "../../packages/kernel/src/context/context-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const permissionsScopeRoot = join(repoRoot, "packages/permissions/src/scope");
const kernelContextRoot = join(repoRoot, "packages/kernel/src/context");
const permissionsIndex = join(repoRoot, "packages/permissions/src/index.ts");
const erpResolverPath = join(
  repoRoot,
  "apps/erp/src/lib/context/resolve-operating-context.server.ts"
);

const REQUIRED_PERMISSIONS_SCOPE_FILES = [
  "permission-scope-context.assert.ts",
  "permission-scope-context.parser.ts",
  "permission-scope-context.contract.ts",
] as const;

const REQUIRED_PERMISSIONS_BARREL_EXPORTS = [
  "assertWirePermissionScopeContext",
  "parsePermissionScopeContext",
  "parseUnknownPermissionScopeContext",
] as const;

const KERNEL_FORBIDDEN_PARSER = "permission-scope-context.parser.ts";
const KERNEL_REQUIRED_PROJECTION = "permission-scope-context.projection.ts";

export interface PermissionScopePermissionsSurfaceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export function checkPermissionScopePermissionsSurface(): PermissionScopePermissionsSurfaceViolation[] {
  const violations: PermissionScopePermissionsSurfaceViolation[] = [];

  for (const fileName of REQUIRED_PERMISSIONS_SCOPE_FILES) {
    const filePath = join(permissionsScopeRoot, fileName);
    if (!existsSync(filePath)) {
      violations.push({
        rule: "permissions-scope-file-missing",
        file: filePath,
        message: `@afenda/permissions must own ${fileName}`,
      });
    }
  }

  const permissionsTestPath = join(
    permissionsScopeRoot,
    "__tests__/permission-scope-context.test.ts"
  );
  if (!existsSync(permissionsTestPath)) {
    violations.push({
      rule: "permissions-scope-tests-missing",
      file: permissionsTestPath,
      message: "permissions scope wire triad requires unit tests",
    });
  }

  const kernelParserPath = join(kernelContextRoot, KERNEL_FORBIDDEN_PARSER);
  if (existsSync(kernelParserPath)) {
    violations.push({
      rule: "kernel-parser-forbidden",
      file: kernelParserPath,
      message:
        "Kernel must not parse permission-scope wire — delete permission-scope-context.parser.ts",
    });
  }

  const kernelProjectionPath = join(
    kernelContextRoot,
    KERNEL_REQUIRED_PROJECTION
  );
  if (!existsSync(kernelProjectionPath)) {
    violations.push({
      rule: "kernel-projection-missing",
      file: kernelProjectionPath,
      message:
        "Kernel must expose permission-scope-context.projection.ts for branding only",
    });
  }

  const permissionScopeModule = KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES.find(
    (entry) => entry.file === "permission-scope-context.contract.ts"
  );
  if (!permissionScopeModule) {
    violations.push({
      rule: "context-registry-permission-scope-missing",
      file: join(kernelContextRoot, "context-registry.ts"),
      message:
        "context-registry must declare permission-scope-context.contract.ts",
    });
  } else if (permissionScopeModule.wireIngress !== false) {
    violations.push({
      rule: "context-registry-wire-ingress",
      file: join(kernelContextRoot, "context-registry.ts"),
      message:
        "permission-scope must have wireIngress: false in context-registry",
    });
  }

  if (existsSync(permissionsIndex)) {
    const indexSource = readFileSync(permissionsIndex, "utf8");
    for (const symbol of REQUIRED_PERMISSIONS_BARREL_EXPORTS) {
      if (!indexSource.includes(symbol)) {
        violations.push({
          rule: "permissions-barrel-export-missing",
          file: permissionsIndex,
          message: `packages/permissions index.ts must export ${symbol}`,
        });
      }
    }
  } else {
    violations.push({
      rule: "permissions-index-missing",
      file: permissionsIndex,
      message: "packages/permissions/src/index.ts is required",
    });
  }

  if (existsSync(erpResolverPath)) {
    const erpSource = readFileSync(erpResolverPath, "utf8");
    if (!erpSource.includes("brandPermissionScopeContextFromUnknownWire")) {
      violations.push({
        rule: "erp-kernel-projection-missing",
        file: erpResolverPath,
        message:
          "resolve-operating-context.server.ts must brand permission scope via brandPermissionScopeContextFromUnknownWire",
      });
    }
  } else {
    violations.push({
      rule: "erp-resolver-missing",
      file: erpResolverPath,
      message: "resolve-operating-context.server.ts is required",
    });
  }

  return violations;
}

function main(): void {
  const violations = checkPermissionScopePermissionsSurface();
  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(
        `[${violation.rule}] ${violation.file}\n  ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  process.stdout.write(
    "Permission scope permissions surface gate passed (PAS-001A B71).\n"
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-permission-scope-permissions-surface.mts")
    );
  } catch {
    return entry.endsWith("check-permission-scope-permissions-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
