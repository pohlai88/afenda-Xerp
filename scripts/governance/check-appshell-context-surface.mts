#!/usr/bin/env tsx
/**
 * AppShell context surface gate (multi-tenancy.md §411–416).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  APPSHELL_APPROVED_RUNTIME_DEPENDENCIES,
  APPSHELL_CONTEXT_CONSUMPTION_MODULES,
  APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES,
  APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS,
} from "../../packages/appshell/src/context/appshell-context-surface-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const appshellRoot = join(repoRoot, "packages/appshell");
const appshellSrcRoot = join(appshellRoot, "src");
const appshellPackageJson = join(appshellRoot, "package.json");
const indexSource = join(appshellSrcRoot, "index.ts");
const registrySource = join(
  appshellSrcRoot,
  "context/appshell-context-surface-registry.ts"
);
const contextIndexSource = join(appshellSrcRoot, "context/index.ts");

const REQUIRED_PACKAGE_EXPORTS = ["./context"] as const;

const REQUIRED_INDEX_EXPORTS = [
  "APPSHELL_CONTEXT_SURFACE_RULE",
  "APPSHELL_CONTEXT_CONSUMPTION_MODULES",
  "ApplicationShellOperatingContext",
] as const;

export interface AppshellContextSurfaceViolation {
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
        entry.name === "_storybook" ||
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
      !/\.(test|spec|stories)\.tsx?$/.test(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function referencesAuthoritySymbol(source: string, symbol: string): boolean {
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const callPattern = new RegExp(`\\b${escaped}\\s*\\(`);
  const importPattern = new RegExp(
    `import\\s+(?:type\\s+)?(?:\\{[^}]*\\b${escaped}\\b[^}]*\\}|${escaped}\\b)\\s*from`
  );
  const reExportPattern = new RegExp(
    `export\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}\\s*from`
  );
  return (
    callPattern.test(source) ||
    importPattern.test(source) ||
    reExportPattern.test(source)
  );
}

function isNewerOrEqual(sourcePath: string, distPath: string): boolean {
  if (!existsSync(distPath)) {
    return false;
  }

  return statSync(distPath).mtimeMs >= statSync(sourcePath).mtimeMs;
}

export function checkAppshellContextSurface(): AppshellContextSurfaceViolation[] {
  const violations: AppshellContextSurfaceViolation[] = [];

  for (const module of APPSHELL_CONTEXT_CONSUMPTION_MODULES) {
    const modulePath = join(appshellSrcRoot, module.path);
    if (!existsSync(modulePath)) {
      violations.push({
        rule: "context-module-missing",
        file: modulePath,
        message: `Missing AppShell context consumption module ${module.path}`,
      });
    }
  }

  if (!existsSync(contextIndexSource)) {
    violations.push({
      rule: "context-barrel-missing",
      file: contextIndexSource,
      message: "packages/appshell/src/context/index.ts is required",
    });
  }

  if (existsSync(appshellPackageJson)) {
    const packageJson = JSON.parse(
      readFileSync(appshellPackageJson, "utf8")
    ) as {
      dependencies?: Record<string, string>;
      exports?: Record<string, unknown>;
    };

    for (const dependency of APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES) {
      if (dependency in (packageJson.dependencies ?? {})) {
        violations.push({
          rule: "forbidden-dependency",
          file: appshellPackageJson,
          message: `Remove forbidden dependency ${dependency} from @afenda/appshell`,
        });
      }
    }

    const approved = new Set<string>(APPSHELL_APPROVED_RUNTIME_DEPENDENCIES);
    for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
      if (dependency.startsWith("@afenda/") && !approved.has(dependency)) {
        violations.push({
          rule: "unapproved-afenda-dependency",
          file: appshellPackageJson,
          message: `${dependency} is not an approved @afenda/appshell runtime dependency`,
        });
      }
    }

    for (const exportKey of REQUIRED_PACKAGE_EXPORTS) {
      if (!(exportKey in (packageJson.exports ?? {}))) {
        violations.push({
          rule: "package-export-missing",
          file: appshellPackageJson,
          message: `Missing package.json export "${exportKey}" for AppShell context barrel`,
        });
      }
    }
  }

  if (existsSync(indexSource)) {
    const indexSourceText = readFileSync(indexSource, "utf8");

    if (!indexSourceText.includes('from "./context/index.js"')) {
      violations.push({
        rule: "index-context-barrel",
        file: indexSource,
        message: "index.ts must export context surface from ./context/index.js",
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
    if (!registryText.includes("APPSHELL_CONTEXT_SURFACE_RULE")) {
      violations.push({
        rule: "registry-missing",
        file: registrySource,
        message: "appshell-context-surface-registry.ts must declare APPSHELL_CONTEXT_SURFACE_RULE",
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registrySource,
      message: "appshell-context-surface-registry.ts is required",
    });
  }

  const appShellTypesPath = join(appshellSrcRoot, "app-shell.types.ts");
  if (existsSync(appShellTypesPath)) {
    const typesSource = readFileSync(appShellTypesPath, "utf8");
    if (!typesSource.includes("ApplicationShellOperatingContext")) {
      violations.push({
        rule: "operating-context-type",
        file: appShellTypesPath,
        message: "ApplicationShellOperatingContext display contract is required",
      });
    }
  }

  for (const file of listProductionSourceFiles(appshellSrcRoot)) {
    const source = readFileSync(file, "utf8");

    for (const dependency of APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES) {
      const importPattern = new RegExp(
        `from ["']${dependency.replace("/", "\\/")}(?:/[^"']+)?["']`
      );
      if (importPattern.test(source)) {
        violations.push({
          rule: "forbidden-import",
          file,
          message: `AppShell must not import ${dependency} — consume context from host app only`,
        });
      }
    }

    // Registry documents forbidden symbols as string literals — scan usage, not declarations.
    if (file === registrySource) {
      continue;
    }

    for (const symbol of APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS) {
      if (referencesAuthoritySymbol(source, symbol)) {
        violations.push({
          rule: "forbidden-authority-symbol",
          file,
          message: `AppShell must not reference authority resolver ${symbol}`,
        });
      }
    }

    if (/from ["']next\/headers["']/.test(source)) {
      violations.push({
        rule: "forbidden-next-headers",
        file,
        message: "AppShell must not read Next.js request headers — host app resolves context",
      });
    }
  }

  const contextDist = join(appshellRoot, "dist/context/index.d.ts");
  if (!existsSync(contextDist)) {
    violations.push({
      rule: "context-dist-missing",
      file: contextDist,
      message: "Missing dist/context/index.d.ts — run pnpm --filter @afenda/appshell build",
    });
  } else if (
    existsSync(contextIndexSource) &&
    !isNewerOrEqual(contextIndexSource, contextDist)
  ) {
    violations.push({
      rule: "stale-context-dist",
      file: contextDist,
      message:
        "dist/context/index.d.ts is older than src — run pnpm --filter @afenda/appshell build",
    });
  }

  const distIndex = join(appshellRoot, "dist/index.d.ts");
  if (existsSync(distIndex) && existsSync(indexSource)) {
    for (const symbol of REQUIRED_INDEX_EXPORTS) {
      const distSource = readFileSync(distIndex, "utf8");
      if (!distSource.includes(symbol)) {
        violations.push({
          rule: "dist-export-missing",
          file: distIndex,
          message: `Built dist missing ${symbol} — run pnpm --filter @afenda/appshell build`,
        });
      }
    }

    if (!isNewerOrEqual(indexSource, distIndex)) {
      violations.push({
        rule: "stale-dist",
        file: distIndex,
        message:
          "dist/index.d.ts is older than src/index.ts — run pnpm --filter @afenda/appshell build",
      });
    }
  }

  return violations;
}

export function formatAppshellContextSurfaceViolations(
  violations: readonly AppshellContextSurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkAppshellContextSurface();
  if (violations.length > 0) {
    console.error(formatAppshellContextSurfaceViolations(violations));
    process.exit(1);
  }

  console.log("AppShell context surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-appshell-context-surface.mts")
    );
  } catch {
    return entry.endsWith("check-appshell-context-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
