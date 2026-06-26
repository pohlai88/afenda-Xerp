#!/usr/bin/env tsx
/**
 * ARCH-AUTH-002 Slice 5 — auth shell boundary guard (legacy + V2).
 *
 * Prevents consumer drift: app-owned shell CSS, deep package imports,
 * and forbidden provider imports inside @afenda/appshell auth modules.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const APP_AUTH_SEGMENTS = [
  join(repoRoot, "apps/erp/src/app/(auth)"),
  join(repoRoot, "apps/erp/src/app/(auth-v2)"),
] as const;

const APPSHELL_AUTH_MODULES = [
  join(repoRoot, "packages/appshell/src/auth-shell"),
  join(repoRoot, "packages/appshell/src/auth-shell-V2"),
] as const;

const FORBIDDEN_APP_SHELL_CLASS_RE =
  /\.(?:login-|auth-wrapper|auth-card|auth-shell-)[\w-]*/;

const FORBIDDEN_DEEP_APPSHELL_IMPORT_RE =
  /@afenda\/appshell\/auth-shell(?:-v2)?\/src\//;

const FORBIDDEN_PROVIDER_IMPORT_RE =
  /from\s+["'](?:better-auth|@supabase\/)/;

const FORBIDDEN_LEGACY_CROSS_IMPORT_RE =
  /from\s+["']@\/app\/\(auth\)\//;

const FORBIDDEN_V2_CROSS_IMPORT_RE =
  /from\s+["']@\/app\/\(auth-v2\)\//;

export interface AuthShellBoundaryViolation {
  readonly file: string;
  readonly line: number;
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
      entry.name.endsWith(".ts") ||
      entry.name.endsWith(".tsx") ||
      entry.name.endsWith(".css")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberAt(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function scanFile(
  absolutePath: string,
  rules: readonly {
    readonly rule: string;
    readonly pattern: RegExp;
    readonly message: string;
  }[]
): AuthShellBoundaryViolation[] {
  const content = readFileSync(absolutePath, "utf8");
  const relativePath = relative(repoRoot, absolutePath).replace(/\\/g, "/");
  const violations: AuthShellBoundaryViolation[] = [];

  for (const { rule, pattern, message } of rules) {
    const match = pattern.exec(content);
    if (match?.index !== undefined) {
      violations.push({
        file: relativePath,
        line: lineNumberAt(content, match.index),
        message,
        rule,
      });
    }
  }

  return violations;
}

function scanAuthV2AppImports(): AuthShellBoundaryViolation[] {
  const authV2Root = join(repoRoot, "apps/erp/src/app/(auth-v2)");
  const violations: AuthShellBoundaryViolation[] = [];

  for (const file of listSourceFiles(authV2Root)) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) {
      continue;
    }

    violations.push(
      ...scanFile(file, [
        {
          rule: "v2-imports-legacy-auth-components",
          pattern: FORBIDDEN_LEGACY_CROSS_IMPORT_RE,
          message:
            "(auth-v2) must not import from legacy (auth) app components.",
        },
      ])
    );
  }

  return violations;
}

function scanLegacyAuthImports(): AuthShellBoundaryViolation[] {
  const authRoot = join(repoRoot, "apps/erp/src/app/(auth)");
  const violations: AuthShellBoundaryViolation[] = [];

  for (const file of listSourceFiles(authRoot)) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) {
      continue;
    }

    violations.push(
      ...scanFile(file, [
        {
          rule: "legacy-imports-v2-auth-components",
          pattern: FORBIDDEN_V2_CROSS_IMPORT_RE,
          message: "Legacy (auth) must not import from (auth-v2) components.",
        },
      ])
    );
  }

  return violations;
}

function scanAppShellCss(): AuthShellBoundaryViolation[] {
  const violations: AuthShellBoundaryViolation[] = [];

  for (const segment of APP_AUTH_SEGMENTS) {
    for (const file of listSourceFiles(segment)) {
      if (!file.endsWith(".css")) {
        continue;
      }

      violations.push(
        ...scanFile(file, [
          {
            rule: "app-owned-shell-css-classes",
            pattern: FORBIDDEN_APP_SHELL_CLASS_RE,
            message:
              "Auth app segments must not define shell-level CSS (.login-*, .auth-shell-*, etc.).",
          },
        ])
      );
    }
  }

  return violations;
}

function scanAppshellAuthModules(): AuthShellBoundaryViolation[] {
  const violations: AuthShellBoundaryViolation[] = [];

  for (const moduleRoot of APPSHELL_AUTH_MODULES) {
    for (const file of listSourceFiles(moduleRoot)) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) {
        continue;
      }

      violations.push(
        ...scanFile(file, [
          {
            rule: "appshell-forbidden-provider-import",
            pattern: FORBIDDEN_PROVIDER_IMPORT_RE,
            message:
              "Auth shell packages must not import better-auth or @supabase/*.",
          },
          {
            rule: "appshell-imports-erp-app",
            pattern: /from\s+["']@\/app\//,
            message: "Auth shell packages must not import apps/erp paths.",
          },
        ])
      );
    }
  }

  return violations;
}

function scanConsumerDeepImports(): AuthShellBoundaryViolation[] {
  const violations: AuthShellBoundaryViolation[] = [];

  for (const segment of APP_AUTH_SEGMENTS) {
    for (const file of listSourceFiles(segment)) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) {
        continue;
      }

      violations.push(
        ...scanFile(file, [
          {
            rule: "consumer-deep-appshell-import",
            pattern: FORBIDDEN_DEEP_APPSHELL_IMPORT_RE,
            message:
              "Auth pages must import @afenda/appshell/auth-shell(-v2) public exports only.",
          },
        ])
      );
    }
  }

  return violations;
}

export function collectAuthShellBoundaryViolations(): AuthShellBoundaryViolation[] {
  return [
    ...scanAppShellCss(),
    ...scanAppshellAuthModules(),
    ...scanConsumerDeepImports(),
    ...scanAuthV2AppImports(),
    ...scanLegacyAuthImports(),
  ];
}

function main(): void {
  const violations = collectAuthShellBoundaryViolations();

  if (violations.length === 0) {
    console.log("check:auth-shell-boundary — pass (0 violations)");
    return;
  }

  console.error(`check:auth-shell-boundary — fail (${violations.length})`);
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line} [${violation.rule}] ${violation.message}`
    );
  }

  process.exitCode = 1;
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-auth-shell-boundary.mts")
    );
  } catch {
    return entry.endsWith("check-auth-shell-boundary.mts");
  }
})();

if (isDirectRun) {
  main();
}
