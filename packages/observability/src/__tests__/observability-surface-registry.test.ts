import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  OBSERVABILITY_CONSUMER_SCAN_ROOTS,
  OBSERVABILITY_ERP_AUDIT_BOOTSTRAP_SYMBOLS,
  OBSERVABILITY_ERP_INSTRUMENTATION_MODULE,
  OBSERVABILITY_FORBIDDEN_DEPENDENCIES,
  OBSERVABILITY_REQUIRED_MODULES,
  OBSERVABILITY_SENSITIVE_AUDIT_POLICY_MODULES,
  OBSERVABILITY_SURFACE_RULE,
} from "../surface/observability-surface-registry.js";

const packageRoot = fileURLToPath(new URL("../..", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../../..", import.meta.url));

function listProductionSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "dist") {
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

describe("observability-surface-registry", () => {
  it("declares logging and audit evidence authority rule", () => {
    expect(OBSERVABILITY_SURFACE_RULE).toBe(
      "logging-and-audit-evidence-authority; persistence-via-injected-adapters-only"
    );
  });

  it("forbids authority packages", () => {
    expect(OBSERVABILITY_FORBIDDEN_DEPENDENCIES).toContain("@afenda/database");
    expect(OBSERVABILITY_FORBIDDEN_DEPENDENCIES).toContain(
      "@afenda/permissions"
    );
  });

  it("lists required modules that exist on disk with declared exports", () => {
    for (const module of OBSERVABILITY_REQUIRED_MODULES) {
      const modulePath = join(packageRoot, "src", module.path);
      expect(existsSync(modulePath), module.path).toBe(true);

      const source = readFileSync(modulePath, "utf8");
      for (const exportName of module.primaryExports) {
        expect(source, `${module.path} exports ${exportName}`).toContain(
          exportName
        );
      }
    }
  });

  it("declares consumer scan roots that exist in the workspace", () => {
    for (const relativePath of OBSERVABILITY_CONSUMER_SCAN_ROOTS) {
      expect(existsSync(join(repoRoot, relativePath)), relativePath).toBe(true);
    }
  });

  it("wires sensitive audit policy modules", () => {
    for (const policyModule of OBSERVABILITY_SENSITIVE_AUDIT_POLICY_MODULES) {
      const modulePath = join(packageRoot, "src", policyModule.path);
      const source = readFileSync(modulePath, "utf8");

      for (const symbol of policyModule.requiredSymbols) {
        expect(source, policyModule.path).toContain(symbol);
      }
    }
  });

  it("requires ERP instrumentation audit bootstrap symbols", () => {
    const instrumentationPath = join(
      repoRoot,
      OBSERVABILITY_ERP_INSTRUMENTATION_MODULE
    );
    const source = readFileSync(instrumentationPath, "utf8");

    for (const symbol of OBSERVABILITY_ERP_AUDIT_BOOTSTRAP_SYMBOLS) {
      expect(source).toContain(symbol);
    }
  });
});

describe("observability downstream governance wiring", () => {
  it("does not import forbidden authority packages from production source", () => {
    const srcRoot = join(packageRoot, "src");
    const violations: string[] = [];

    for (const file of listProductionSourceFiles(srcRoot)) {
      const source = readFileSync(file, "utf8");

      for (const dependency of OBSERVABILITY_FORBIDDEN_DEPENDENCIES) {
        const importPattern = new RegExp(
          `from ["']${dependency.replace("/", "\\/")}(?:/[^"']+)?["']`
        );
        if (importPattern.test(source)) {
          violations.push(`${file}: imports ${dependency}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
