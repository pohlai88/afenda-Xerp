import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS } from "../runtime/runtime.contract.js";

const packageRoot = join(import.meta.dirname, "../..");
const srcRoot = join(packageRoot, "src");

const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  exports?: Record<string, unknown>;
};

const declaredRuntimeDependencies = new Set(
  Object.keys(packageJson.dependencies ?? {})
);

const declaredDevDependencies = new Set(
  Object.keys(packageJson.devDependencies ?? {})
);

const workspaceImportPattern = /from ["'](@afenda\/[^"']+)["']/g;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "_storybook") {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/\.stories\.tsx$/.test(entry.name)
    ) {
      files.push(absolutePath);
    }
  }

  return files;
}

function resolveWorkspacePackageName(importPath: string): string {
  const segments = importPath.split("/");
  if (segments[0] === "@afenda" && segments[1] !== undefined) {
    return `@afenda/${segments[1]}`;
  }

  return importPath;
}

function collectWorkspaceImports(content: string): string[] {
  const imports: string[] = [];

  for (const match of content.matchAll(workspaceImportPattern)) {
    const packageName = match[1];
    if (packageName !== undefined) {
      imports.push(packageName);
    }
  }

  return imports;
}

describe("metadata-ui monorepo discipline", () => {
  it("pins internal runtime dependencies with workspace:*", () => {
    for (const [name, version] of Object.entries(
      packageJson.dependencies ?? {}
    )) {
      if (name.startsWith("@afenda/")) {
        expect(version, `${name} version`).toBe("workspace:*");
      }
    }
  });

  it("declares every @afenda runtime import from production source", () => {
    const missingDeclarations: string[] = [];

    for (const filePath of collectSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const packageName of collectWorkspaceImports(content)) {
        if (
          !declaredRuntimeDependencies.has(
            resolveWorkspacePackageName(packageName)
          )
        ) {
          missingDeclarations.push(`${filePath} -> ${packageName}`);
        }
      }
    }

    expect(missingDeclarations).toEqual([]);
  });

  it("does not import forbidden higher-layer packages from production source", () => {
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const packageName of collectWorkspaceImports(content)) {
        if (
          METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS.some((forbidden) =>
            packageName.startsWith(forbidden)
          )
        ) {
          violations.push(`${filePath} -> ${packageName}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("exposes only governed public entry points", () => {
    expect(Object.keys(packageJson.exports ?? {}).sort()).toEqual([
      ".",
      "./client",
      "./fixtures.css",
      "./server",
      "./styles.css",
    ]);
  });

  it("lists @afenda/testing only as a devDependency", () => {
    expect(declaredDevDependencies.has("@afenda/testing")).toBe(true);
    expect(declaredRuntimeDependencies.has("@afenda/testing")).toBe(false);
  });

  it("consumes metadata and UI governance as runtime workspace dependencies", () => {
    expect([...declaredRuntimeDependencies].sort()).toEqual([
      "@afenda/metadata",
      "@afenda/ui",
    ]);
  });
});
