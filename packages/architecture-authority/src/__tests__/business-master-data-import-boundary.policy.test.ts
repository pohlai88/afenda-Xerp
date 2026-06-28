import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  assertBusinessMasterDataImportBoundary,
  BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES,
} from "../data/business-master-data-import-boundary.policy.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const businessReferenceIdentityRoot = join(
  repoRoot,
  "packages/kernel/src/identity/wire"
);

const importPattern =
  /\bfrom\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/gu;

function listTypeScriptFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTypeScriptFiles(fullPath));
      continue;
    }

    if (entry.name.endsWith(".ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("@afenda/architecture-authority business master data import boundary (Foundation phase 08 Slice 7)", () => {
  it("rejects forbidden persistence and application imports", () => {
    for (const forbidden of BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES) {
      expect(() => assertBusinessMasterDataImportBoundary(forbidden)).toThrow(
        forbidden
      );
    }

    expect(() =>
      assertBusinessMasterDataImportBoundary("@afenda/database/schema")
    ).toThrow("@afenda/database");
  });

  it("keeps kernel business-reference wire contracts free of forbidden imports", () => {
    for (const filePath of listTypeScriptFiles(businessReferenceIdentityRoot)) {
      const source = readFileSync(filePath, "utf8");

      for (const match of source.matchAll(importPattern)) {
        const specifier = match[1] ?? match[2];
        if (!specifier) {
          continue;
        }

        expect(
          () => assertBusinessMasterDataImportBoundary(specifier),
          `${filePath} imports ${specifier}`
        ).not.toThrow();
      }
    }
  });
});
