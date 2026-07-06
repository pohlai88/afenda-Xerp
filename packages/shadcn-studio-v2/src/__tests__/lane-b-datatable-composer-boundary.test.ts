import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const ADR_0043_PATH = path.join(
  REPO_ROOT,
  "docs",
  "adr",
  "ADR-0043-erp-datatable-headless-composer.md"
);

const FORBIDDEN_TANSTACK_MARKERS = [
  "@tanstack/react-table",
  "useReactTable",
  "getCoreRowModel",
  "flexRender",
] as const;

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }

      files.push(...listSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/u.test(entry.name)) {
      if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.tsx")) {
        continue;
      }

      files.push(absolutePath);
    }
  }

  return files;
}

describe("Lane B-05 datatable composer boundary", () => {
  it("records Accepted ADR-0043 with TanStack ownership in apps/erp", () => {
    const adr = readFileSync(ADR_0043_PATH, "utf8");

    expect(adr).toContain("| **Status** | Accepted |");
    expect(adr).toContain("@tanstack/react-table");
    expect(adr).toContain("erp-datatable-composer.client.tsx");
    expect(adr).toContain("DataTableSurface");
    expect(adr).toContain("PAS-006D");
  });

  it("authorizes B-07 against ADR-0043", () => {
    const b07 = readFileSync(
      path.join(DOCS_SLICES_ROOT, "LANE-B-07-ERP-SURFACE-WAVE-SYSTEM-ADMIN.md"),
      "utf8"
    );

    expect(b07).toContain("ADR-0043");
  });

  it("keeps v2 package source free of TanStack table imports", () => {
    const sourceFiles = listSourceFiles(SRC_ROOT);

    expect(sourceFiles.length).toBeGreaterThan(0);

    for (const file of sourceFiles) {
      const source = readFileSync(file, "utf8");
      const relativePath = path
        .relative(PACKAGE_ROOT, file)
        .replace(/\\/gu, "/");

      for (const marker of FORBIDDEN_TANSTACK_MARKERS) {
        expect(
          source,
          `${relativePath} must not contain ${marker}`
        ).not.toContain(marker);
      }
    }
  });
});
