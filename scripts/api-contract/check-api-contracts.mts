import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const apiRoot = join(repoRoot, "apps/erp/src/app/api");

const ROUTE_ALLOWLIST = ["auth", "integrations"] as const;

function isGovernedRouteSource(source: string): boolean {
  if (source.includes("createApiHandler")) {
    return true;
  }

  return /export\s*\{[^}]*\}\s*from\s*["'][^"']*internal\/v1\/[^"']*["']/.test(
    source
  );
}

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
    filePath.includes(join("app", "api", segment))
  );
}

function main(): void {
  const violations: string[] = [];

  for (const filePath of collectRouteFiles(apiRoot)) {
    if (isAllowlistedRoute(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    if (!isGovernedRouteSource(source)) {
      violations.push(`${filePath}: missing createApiHandler`);
    }

    if (/Response\.json\s*\(/.test(source)) {
      violations.push(`${filePath}: direct Response.json usage`);
    }
  }

  if (violations.length > 0) {
    console.error("API contract drift detected:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("API contract drift check passed");
}

main();
