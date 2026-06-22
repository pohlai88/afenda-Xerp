import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const apiRoot = join(import.meta.dirname, "../../../app/api");

const ROUTE_ALLOWLIST = [
  "auth",
  "integrations",
] as const;

function collectRouteFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "docs") {
        continue;
      }
      files.push(...collectRouteFiles(absolutePath));
      continue;
    }

    if (entry.name === "route.ts") {
      files.push(absolutePath);
    }
  }

  return files;
}

function isAllowlistedRoute(filePath: string): boolean {
  return ROUTE_ALLOWLIST.some((segment) =>
    filePath.includes(`${join("app", "api", segment)}`)
  );
}

function isGovernedRouteSource(source: string): boolean {
  if (source.includes("createApiHandler")) {
    return true;
  }

  return /export\s*\{[^}]*\}\s*from\s*["'][^"']*internal\/v1\/[^"']*["']/.test(
    source
  );
}

describe("API handler boundary", () => {
  it("requires createApiHandler on governed route files", () => {
    const violations: string[] = [];

    for (const filePath of collectRouteFiles(apiRoot)) {
      if (isAllowlistedRoute(filePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      if (!isGovernedRouteSource(source)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("forbids direct Response.json in governed route files", () => {
    const violations: string[] = [];

    for (const filePath of collectRouteFiles(apiRoot)) {
      if (isAllowlistedRoute(filePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      if (/Response\.json\s*\(/.test(source)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("forbids UI and AppShell imports in governed route files", () => {
    const forbiddenPatterns = [
      /@afenda\/appshell/,
      /@afenda\/metadata-ui/,
      /from ["']react["']/,
    ];
    const violations: string[] = [];

    for (const filePath of collectRouteFiles(apiRoot)) {
      if (isAllowlistedRoute(filePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(source)) {
          violations.push(filePath);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
