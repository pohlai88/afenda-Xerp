#!/usr/bin/env tsx
/**
 * PAS-005 — CSS Authority consumption proof (R23–R30).
 * Validates token definition boundaries and registry-backed var() references.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  allowedConsumptionVarNames,
  CSS_AUTHORITY_TOKENS,
  validateCssAuthorityRegistry,
} from "../../packages/css-authority/src/index.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

interface Violation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
  readonly severity: "error" | "warning";
}

const violations: Violation[] = [];

function rel(path: string): string {
  return relative(repoRoot, path);
}

function fail(rule: string, file: string, message: string): void {
  violations.push({ rule, file: rel(file), message, severity: "error" });
}

function warn(rule: string, file: string, message: string): void {
  violations.push({ rule, file: rel(file), message, severity: "warning" });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectCssFiles(dir: string): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) {
    return result;
  }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (/node_modules|dist|__tests__|fixtures/.test(full)) {
      continue;
    }
    const stat = statSync(full);
    if (stat.isDirectory()) {
      result.push(...collectCssFiles(full));
    } else if (entry.endsWith(".css")) {
      result.push(full);
    }
  }
  return result;
}

function tokenNamesForAuthority(
  authority:
    | "shadcn-theme"
    | "afenda-extensions"
    | "appshell"
    | "auth-editorial"
): Set<string> {
  return new Set(
    CSS_AUTHORITY_TOKENS.filter((token) => token.authority === authority).map(
      (token) => token.name
    )
  );
}

const SHADCN_TOKEN_NAMES = tokenNamesForAuthority("shadcn-theme");
const AFENDA_TOKEN_NAMES = tokenNamesForAuthority("afenda-extensions");
const APPSHELL_TOKEN_NAMES = tokenNamesForAuthority("appshell");
const AUTH_EDITORIAL_TOKEN_NAMES = tokenNamesForAuthority("auth-editorial");

const SHADCN_DEFINITION_PACKAGES = new Set([
  "@afenda/css-authority",
  "@afenda/design-system",
]);

const AFENDA_DEFINITION_PACKAGES = new Set([
  "@afenda/css-authority",
  "@afenda/design-system",
]);

const APPSHELL_DEFINITION_PACKAGES = new Set(["@afenda/appshell"]);

const PACKAGE_SCAN_ROOTS: Record<string, string> = {
  "@afenda/ui": join(repoRoot, "packages/ui"),
  "@afenda/appshell": join(repoRoot, "packages/appshell"),
  "@afenda/metadata-ui": join(repoRoot, "packages/metadata-ui"),
  "@afenda/css-authority": join(repoRoot, "packages/css-authority"),
  "@afenda/design-system": join(repoRoot, "packages/design-system"),
};

const registryErrors = validateCssAuthorityRegistry();
if (registryErrors.length > 0) {
  for (const error of registryErrors) {
    fail("R27-registry-conformance", repoRoot, error);
  }
}

const allowedVars = allowedConsumptionVarNames();

function stripCssComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, "");
}

function isAuthorityTokenDefinition(
  content: string,
  tokenName: string
): boolean {
  const defRe = new RegExp(
    `^\\s*${escapeRegExp(tokenName)}\\s*:\\s*([^;\\n]+)`,
    "m"
  );
  const match = defRe.exec(content);
  if (match === null) {
    return false;
  }
  const value = match[1]?.trim() ?? "";
  return value.length > 0 && !value.startsWith("var(");
}

function scanDefinitionViolations(options: {
  readonly rule: string;
  readonly tokenNames: Set<string>;
  readonly allowedPackages: Set<string>;
  readonly message: (pkg: string, tokenName: string) => string;
}): void {
  for (const [pkg, root] of Object.entries(PACKAGE_SCAN_ROOTS)) {
    if (options.allowedPackages.has(pkg)) {
      continue;
    }

    const cssPath = join(root, "src");
    for (const file of collectCssFiles(cssPath)) {
      const content = stripCssComments(readFileSync(file, "utf8"));
      for (const tokenName of options.tokenNames) {
        if (isAuthorityTokenDefinition(content, tokenName)) {
          fail(options.rule, file, options.message(pkg, tokenName));
        }
      }
    }
  }
}

scanDefinitionViolations({
  rule: "R23-shadcn-definition-authority",
  tokenNames: SHADCN_TOKEN_NAMES,
  allowedPackages: SHADCN_DEFINITION_PACKAGES,
  message: (pkg, tokenName) =>
    `${pkg} defines ${tokenName} with a literal/authority value — only @afenda/css-authority (and design-system shim) may define shadcn bridge token authority`,
});

scanDefinitionViolations({
  rule: "R28-afenda-definition-authority",
  tokenNames: AFENDA_TOKEN_NAMES,
  allowedPackages: AFENDA_DEFINITION_PACKAGES,
  message: (pkg, tokenName) =>
    `${pkg} defines ${tokenName} with a literal/authority value — only @afenda/css-authority and @afenda/design-system may define --afenda-* token authority`,
});

scanDefinitionViolations({
  rule: "R29-appshell-definition-authority",
  tokenNames: APPSHELL_TOKEN_NAMES,
  allowedPackages: APPSHELL_DEFINITION_PACKAGES,
  message: (pkg, tokenName) =>
    `${pkg} defines ${tokenName} with a literal/authority value — only @afenda/appshell may define --app-shell-* token authority`,
});

scanDefinitionViolations({
  rule: "R30-auth-editorial-definition-authority",
  tokenNames: AUTH_EDITORIAL_TOKEN_NAMES,
  allowedPackages: APPSHELL_DEFINITION_PACKAGES,
  message: (pkg, tokenName) =>
    `${pkg} defines ${tokenName} with a literal/authority value — only @afenda/appshell may define --auth-editorial-* token authority`,
});

for (const [pkg, root] of Object.entries(PACKAGE_SCAN_ROOTS)) {
  if (pkg === "@afenda/css-authority" || pkg === "@afenda/design-system") {
    continue;
  }

  const cssPath = join(root, "src");
  for (const file of collectCssFiles(cssPath)) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
      const varName = match[1];
      if (varName === undefined || !SHADCN_TOKEN_NAMES.has(varName)) {
        continue;
      }
      const bareName = varName.slice(2);
      if (!allowedVars.has(bareName)) {
        warn(
          "R24-shadcn-var-allowlist",
          file,
          `${pkg} references ${varName} which is not in CSS Authority consumption allowlist`
        );
      }
    }
  }
}

for (const token of CSS_AUTHORITY_TOKENS) {
  if (token.lifecycle === "removed" && allowedVars.has(token.name.slice(2))) {
    fail(
      "R25-removed-lifecycle",
      join(
        repoRoot,
        "packages/css-authority/src/generated/css-authority-registry.ts"
      ),
      `Removed token ${token.id} (${token.name}) must not be consumable`
    );
  }
}

const vendoredTheme = join(
  repoRoot,
  "packages/css-authority/src/css/vendored/shadcn-theme.css"
);
if (!existsSync(vendoredTheme)) {
  fail(
    "R26-vendored-theme-present",
    vendoredTheme,
    "Vendored shadcn-theme.css is missing"
  );
}

const errors = violations.filter((v) => v.severity === "error");
const warnings = violations.filter((v) => v.severity === "warning");

if (warnings.length > 0) {
  process.stderr.write("\nCSS Authority consumption warnings:\n");
  for (const v of warnings) {
    process.stderr.write(`  [${v.rule}] ${v.file}\n    ${v.message}\n`);
  }
}

if (errors.length > 0) {
  process.stderr.write("\nCSS Authority consumption errors:\n");
  for (const v of errors) {
    process.stderr.write(`  [${v.rule}] ${v.file}\n    ${v.message}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `css-authority-consumption: PASS (shadcn=${SHADCN_TOKEN_NAMES.size}, afenda=${AFENDA_TOKEN_NAMES.size}, appshell=${APPSHELL_TOKEN_NAMES.size}, auth-editorial=${AUTH_EDITORIAL_TOKEN_NAMES.size}, ${warnings.length} warning(s))\n`
);
