import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  assertBusinessMasterDataImportBoundary,
  BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES,
} from "../contracts/business-master-data/index.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const businessMasterDataRoot = join(
  repoRoot,
  "packages/kernel/src/contracts/business-master-data"
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

describe("@afenda/kernel business master data import boundary (TIP-008B Slice 7)", () => {
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

  it("keeps business-master-data contracts free of forbidden imports", () => {
    for (const filePath of listTypeScriptFiles(businessMasterDataRoot)) {
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
