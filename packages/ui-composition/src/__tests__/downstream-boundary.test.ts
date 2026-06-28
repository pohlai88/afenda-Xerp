import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  crossPackageAuthority,
  METADATA_DENSITY_MODES,
  metadataContract,
  presentationContract,
} from "../index.js";

function getMetadataImportPolicy() {
  const entry = crossPackageAuthority.packages.find(
    (candidate) => candidate.package === "@afenda/ui-composition"
  );
  if (!entry) {
    throw new Error("Missing authority entry for @afenda/ui-composition");
  }
  return entry.importPolicy;
}

const PROHIBITED_IMPORTS = [
  "react",
  "react-dom",
  "next",
  "@afenda/design-system",
  "@afenda/metadata-ui",
  "@afenda/appshell",
  "@afenda/ui",
  "@afenda/permissions",
  "@afenda/database",
  "drizzle-orm",
] as const;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("@afenda/ui-composition downstream boundary", () => {
  it("declares only @afenda/enterprise-knowledge as runtime dependency (PAS-004B B34)", () => {
    const packageJson = JSON.parse(
      readFileSync(join(import.meta.dirname, "../../package.json"), "utf8")
    ) as { dependencies?: Record<string, string> };

    expect(Object.keys(packageJson.dependencies ?? {})).toEqual([
      "@afenda/enterprise-knowledge",
    ]);
  });

  it("does not import downstream UI packages or React", () => {
    const srcRoot = join(import.meta.dirname, "..");
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const prohibited of PROHIBITED_IMPORTS) {
        if (
          content.includes(`from "${prohibited}"`) ||
          content.includes(`from '${prohibited}'`)
        ) {
          violations.push(`${filePath} -> ${prohibited}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not ship React, CSS, or TSX implementation files", () => {
    const srcRoot = join(import.meta.dirname, "..");
    const forbiddenExtensions = [".tsx", ".css", ".module.css"];

    for (const filePath of collectSourceFiles(srcRoot)) {
      expect(
        forbiddenExtensions.some((extension) => filePath.endsWith(extension))
      ).toBe(false);
    }
  });

  it("matches crossPackageAuthority import policy", () => {
    const metadataPolicy = getMetadataImportPolicy();

    expect(metadataPolicy.mayImportFrom).toEqual([
      "@afenda/enterprise-knowledge",
    ]);
    expect(metadataPolicy.mayNotImportFrom).toEqual(
      expect.arrayContaining([
        "@afenda/design-system",
        "@afenda/metadata-ui",
        "@afenda/appshell",
        "@afenda/ui",
      ])
    );
  });

  it("keeps metadata density contract-only with default as the middle mode", () => {
    expect(METADATA_DENSITY_MODES).toEqual([
      "compact",
      "default",
      "comfortable",
    ]);
    expect(presentationContract.densityModes).toEqual(METADATA_DENSITY_MODES);
  });

  it("requires downstream packages to consume metadata contracts", () => {
    expect(metadataContract.governance).toEqual(
      expect.arrayContaining([
        "downstream-packages-must-consume-metadata-contracts",
        "metadata-ui-must-not-redefine-governed-arrays",
      ])
    );
  });
});
