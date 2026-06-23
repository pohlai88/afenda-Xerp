import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { executionService } from "../index.js";

const workspaceRoot = join(
  fileURLToPath(new URL("../../../../", import.meta.url))
);
const sourceRoots = ["apps", "packages"];
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const ignoredDirectories = new Set([
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
  "test-results",
]);
const triggerImportPattern = /@trigger\.dev\//u;
const allowedTriggerProviderSuffixes = [
  "packages/execution/src/providers/trigger.provider.ts",
  "packages/execution/trigger.config.ts",
] as const;

function listSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listSourceFiles(entryPath));
      continue;
    }

    if (entry.isFile() && sourceExtensions.has(extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function collectTriggerImportViolations(): string[] {
  const violations: string[] = [];

  for (const sourceRoot of sourceRoots) {
    const absoluteSourceRoot = join(workspaceRoot, sourceRoot);

    if (!existsSync(absoluteSourceRoot)) {
      continue;
    }

    for (const filePath of listSourceFiles(absoluteSourceRoot)) {
      const normalizedPath = relative(workspaceRoot, filePath).replaceAll(
        "\\",
        "/"
      );

      if (
        allowedTriggerProviderSuffixes.includes(
          normalizedPath as (typeof allowedTriggerProviderSuffixes)[number]
        )
      ) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");

      if (triggerImportPattern.test(source)) {
        violations.push(normalizedPath);
      }
    }
  }

  return violations;
}

describe("Trigger.dev isolation governance", () => {
  it("allows Trigger.dev SDK imports only in the execution provider", () => {
    expect(collectTriggerImportViolations()).toEqual([]);
  }, 30_000);
});

describe("execution provider boundary", () => {
  it("exports executionService as the only execution authority", () => {
    expect(typeof executionService.execute).toBe("function");
    expect(typeof executionService.schedule).toBe("function");
    expect(typeof executionService.retry).toBe("function");
    expect(typeof executionService.cancel).toBe("function");
    expect(typeof executionService.getStatus).toBe("function");
    expect(typeof executionService.registerWorkflow).toBe("function");
  });
});
