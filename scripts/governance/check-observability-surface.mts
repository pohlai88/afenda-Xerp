#!/usr/bin/env tsx
/**
 * Observability surface gate (multi-tenancy.md §417–420).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  OBSERVABILITY_APPROVED_RUNTIME_DEPENDENCIES,
  OBSERVABILITY_CONSUMER_SCAN_ROOTS,
  OBSERVABILITY_CONTRACT_BARREL_DIRECTORY,
  OBSERVABILITY_ERP_AUDIT_BOOTSTRAP_SYMBOLS,
  OBSERVABILITY_ERP_INSTRUMENTATION_MODULE,
  OBSERVABILITY_FORBIDDEN_AUTHORITY_SYMBOLS,
  OBSERVABILITY_FORBIDDEN_DEPENDENCIES,
  OBSERVABILITY_REQUIRED_MODULES,
  OBSERVABILITY_SENSITIVE_AUDIT_POLICY_MODULES,
} from "../../packages/observability/src/surface/observability-surface-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const observabilityRoot = join(repoRoot, "packages/observability");
const observabilitySrcRoot = join(observabilityRoot, "src");
const observabilityPackageJson = join(observabilityRoot, "package.json");
const indexSource = join(observabilitySrcRoot, "index.ts");
const registrySource = join(
  observabilitySrcRoot,
  "surface/observability-surface-registry.ts"
);
const surfaceIndexSource = join(observabilitySrcRoot, "surface/index.ts");
const contractsIndexSource = join(observabilitySrcRoot, "contracts/index.ts");

const REQUIRED_PACKAGE_EXPORTS = ["./contracts", "./surface"] as const;

const REQUIRED_INDEX_EXPORTS = [
  "OBSERVABILITY_SURFACE_RULE",
  "OBSERVABILITY_REQUIRED_MODULES",
  "createCorrelationId",
  "writeAuditEvent",
  "createLogger",
] as const;

const CONSUMER_SCAN_ROOTS = OBSERVABILITY_CONSUMER_SCAN_ROOTS.map((relativePath) =>
  join(repoRoot, relativePath)
);

/** Root package import only — barrels `./contracts` and `./surface` are allowed. */
const FORBIDDEN_DEEP_IMPORT_PATTERN =
  /@afenda\/observability\/(?!contracts["']|surface["'])[^"']+/;

export interface ObservabilitySurfaceViolation {
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

    if (/\.(ts|tsx|mts)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
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

export function checkObservabilitySurface(): ObservabilitySurfaceViolation[] {
  const violations: ObservabilitySurfaceViolation[] = [];

  for (const module of OBSERVABILITY_REQUIRED_MODULES) {
    const modulePath = join(observabilitySrcRoot, module.path);
    if (!existsSync(modulePath)) {
      violations.push({
        rule: "required-module-missing",
        file: modulePath,
        message: `Missing observability module ${module.path}`,
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

  for (const policyModule of OBSERVABILITY_SENSITIVE_AUDIT_POLICY_MODULES) {
    const policyPath = join(observabilitySrcRoot, policyModule.path);
    if (!existsSync(policyPath)) {
      violations.push({
        rule: "audit-policy-module-missing",
        file: policyPath,
        message: `Missing sensitive audit policy module ${policyModule.path}`,
      });
      continue;
    }

    const policySource = readFileSync(policyPath, "utf8");
    for (const symbol of policyModule.requiredSymbols) {
      if (!policySource.includes(symbol)) {
        violations.push({
          rule: "audit-policy-wiring",
          file: policyPath,
          message: `${policyModule.path} must reference ${symbol} for sensitive metadata enforcement`,
        });
      }
    }
  }

  const erpInstrumentationPath = join(repoRoot, OBSERVABILITY_ERP_INSTRUMENTATION_MODULE);
  if (!existsSync(erpInstrumentationPath)) {
    violations.push({
      rule: "erp-instrumentation-missing",
      file: erpInstrumentationPath,
      message: `${OBSERVABILITY_ERP_INSTRUMENTATION_MODULE} is required for audit bootstrap`,
    });
  } else {
    const instrumentationSource = readFileSync(erpInstrumentationPath, "utf8");

    if (!instrumentationSource.includes('process.env["NEXT_RUNTIME"] === "nodejs"')) {
      violations.push({
        rule: "erp-audit-bootstrap-runtime",
        file: erpInstrumentationPath,
        message: "Audit adapter must be configured only in the Node.js runtime",
      });
    }

    for (const symbol of OBSERVABILITY_ERP_AUDIT_BOOTSTRAP_SYMBOLS) {
      if (!instrumentationSource.includes(symbol)) {
        violations.push({
          rule: "erp-audit-bootstrap",
          file: erpInstrumentationPath,
          message: `${OBSERVABILITY_ERP_INSTRUMENTATION_MODULE} must call ${symbol} at server startup`,
        });
      }
    }
  }

  const contractsBarrel = join(
    observabilitySrcRoot,
    OBSERVABILITY_CONTRACT_BARREL_DIRECTORY,
    "index.ts"
  );
  if (!existsSync(contractsBarrel)) {
    violations.push({
      rule: "contracts-barrel-missing",
      file: contractsBarrel,
      message: "packages/observability/src/contracts/index.ts is required",
    });
  }

  if (!existsSync(surfaceIndexSource)) {
    violations.push({
      rule: "surface-barrel-missing",
      file: surfaceIndexSource,
      message: "packages/observability/src/surface/index.ts is required",
    });
  }

  if (existsSync(observabilityPackageJson)) {
    const packageJson = JSON.parse(
      readFileSync(observabilityPackageJson, "utf8")
    ) as {
      dependencies?: Record<string, string>;
      exports?: Record<string, unknown>;
    };

    for (const dependency of OBSERVABILITY_FORBIDDEN_DEPENDENCIES) {
      if (dependency in (packageJson.dependencies ?? {})) {
        violations.push({
          rule: "forbidden-dependency",
          file: observabilityPackageJson,
          message: `Remove forbidden dependency ${dependency} from @afenda/observability`,
        });
      }
    }

    const approved = new Set<string>(OBSERVABILITY_APPROVED_RUNTIME_DEPENDENCIES);
    for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
      if (dependency.startsWith("@afenda/") && !approved.has(dependency)) {
        violations.push({
          rule: "unapproved-afenda-dependency",
          file: observabilityPackageJson,
          message: `${dependency} is not an approved @afenda/observability runtime dependency`,
        });
      }
    }

    for (const exportKey of REQUIRED_PACKAGE_EXPORTS) {
      if (!(exportKey in (packageJson.exports ?? {}))) {
        violations.push({
          rule: "package-export-missing",
          file: observabilityPackageJson,
          message: `Missing package.json export "${exportKey}" for observability barrel`,
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

  if (existsSync(registrySource)) {
    const registryText = readFileSync(registrySource, "utf8");
    if (!registryText.includes("OBSERVABILITY_SURFACE_RULE")) {
      violations.push({
        rule: "registry-missing",
        file: registrySource,
        message:
          "observability-surface-registry.ts must declare OBSERVABILITY_SURFACE_RULE",
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registrySource,
      message: "observability-surface-registry.ts is required",
    });
  }

  for (const file of listProductionSourceFiles(observabilitySrcRoot)) {
    const source = readFileSync(file, "utf8");

    for (const dependency of OBSERVABILITY_FORBIDDEN_DEPENDENCIES) {
      const importPattern = new RegExp(
        `from ["']${dependency.replace("/", "\\/")}(?:/[^"']+)?["']`
      );
      if (importPattern.test(source)) {
        violations.push({
          rule: "forbidden-import",
          file,
          message: `Observability must not import ${dependency} — inject adapters at the host boundary`,
        });
      }
    }

    if (file === registrySource) {
      continue;
    }

    for (const symbol of OBSERVABILITY_FORBIDDEN_AUTHORITY_SYMBOLS) {
      if (referencesAuthoritySymbol(source, symbol)) {
        violations.push({
          rule: "forbidden-authority-symbol",
          file,
          message: `Observability must not reference authority resolver ${symbol}`,
        });
      }
    }

    if (/\bconsole\.(?:log|debug|info|warn|error)\s*\(/.test(source)) {
      violations.push({
        rule: "forbidden-console",
        file,
        message:
          "Observability production source must use structured logging — not console.*",
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
            "Import @afenda/observability or @afenda/observability/{contracts|surface} — not dist/src/deep paths",
        });
      }
    }
  }

  const contractsDist = join(observabilityRoot, "dist/contracts/index.d.ts");
  if (!existsSync(contractsDist)) {
    violations.push({
      rule: "contracts-dist-missing",
      file: contractsDist,
      message:
        "Missing dist/contracts/index.d.ts — run pnpm --filter @afenda/observability build",
    });
  } else if (
    existsSync(contractsIndexSource) &&
    !isNewerOrEqual(contractsIndexSource, contractsDist)
  ) {
    violations.push({
      rule: "stale-contracts-dist",
      file: contractsDist,
      message:
        "dist/contracts/index.d.ts is older than src — run pnpm --filter @afenda/observability build",
    });
  }

  const distIndex = join(observabilityRoot, "dist/index.d.ts");
  if (!existsSync(distIndex)) {
    violations.push({
      rule: "dist-missing",
      file: distIndex,
      message:
        "Missing dist/index.d.ts — run pnpm --filter @afenda/observability build",
    });
  } else if (existsSync(indexSource)) {
    for (const symbol of REQUIRED_INDEX_EXPORTS) {
      const distSource = readFileSync(distIndex, "utf8");
      if (!distSource.includes(symbol)) {
        violations.push({
          rule: "dist-export-missing",
          file: distIndex,
          message: `Built dist missing ${symbol} — run pnpm --filter @afenda/observability build`,
        });
      }
    }

    if (!isNewerOrEqual(indexSource, distIndex)) {
      violations.push({
        rule: "stale-dist",
        file: distIndex,
        message:
          "dist/index.d.ts is older than src/index.ts — run pnpm --filter @afenda/observability build",
      });
    }
  }

  return violations;
}

export function formatObservabilitySurfaceViolations(
  violations: readonly ObservabilitySurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkObservabilitySurface();
  if (violations.length > 0) {
    console.error(formatObservabilitySurfaceViolations(violations));
    process.exit(1);
  }

  console.log("Observability surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-observability-surface.mts")
    );
  } catch {
    return entry.endsWith("check-observability-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
