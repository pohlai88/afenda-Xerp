import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  METADATA_PLATFORM_IDENTITY_DIMENSION_ATOM_IDS,
  resolveMetadataPlatformIdentityDimensionLabel,
} from "../knowledge/platform-identity-dimensions.js";

const srcRoot = join(import.meta.dirname, "..");

function collectProductionSourceFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "_storybook") {
        continue;
      }
      files.push(...collectProductionSourceFiles(absolutePath));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name) && !/\.stories\.tsx$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }
  return files;
}

describe("metadata-ui platform identity vocabulary (PAS-004B consumer chain)", () => {
  it("resolves dimension labels for tenant, legal entity, and organization unit", () => {
    for (const atomId of [
      "tenant",
      "legal_entity",
      "organization_unit",
    ] as const) {
      expect(
        resolveMetadataPlatformIdentityDimensionLabel(atomId).length
      ).toBeGreaterThan(0);
    }
  });

  it("declares four workspace scope dimensions", () => {
    expect(METADATA_PLATFORM_IDENTITY_DIMENSION_ATOM_IDS).toEqual([
      "tenant",
      "legal_entity",
      "organization_unit",
      "workspace",
    ]);
  });

  it("does not import @afenda/enterprise-knowledge directly from production source", () => {
    const violations: string[] = [];
    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      if (content.includes("@afenda/enterprise-knowledge")) {
        violations.push(filePath);
      }
    }
    expect(violations).toEqual([]);
  });
});
