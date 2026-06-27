import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isOwnershipInterestEffectiveAt,
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES,
  OPERATING_CONTEXT_ERROR_CODES,
} from "../context/index.js";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "../context");

describe("@afenda/kernel context registry", () => {
  it("includes every required module from multi-tenancy.md", () => {
    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      expect(
        existsSync(join(contextRoot, module.file)),
        `missing ${module.file}`
      ).toBe(true);
    }

    expect(existsSync(join(contextRoot, "index.ts"))).toBe(true);
  });

  it("includes every supporting module on disk", () => {
    for (const file of KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES) {
      expect(existsSync(join(contextRoot, file)), `missing ${file}`).toBe(true);
    }
  });

  it("re-exports primary types from context/index.ts", () => {
    const indexSource = readFileSync(join(contextRoot, "index.ts"), "utf8");

    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      const exportPattern = new RegExp(
        `(export\\s+type\\s+\\{[^}]*\\b${module.primaryType}\\b|export\\s+type\\s+${module.primaryType}\\b|export\\s+\\{[^}]*\\btype\\s+${module.primaryType}\\b)`
      );

      expect(
        exportPattern.test(indexSource),
        `${module.primaryType} not exported from index`
      ).toBe(true);
    }
  });
});

describe("operating context contract surface", () => {
  it("exports stable lifecycle and scope vocabularies", () => {
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("MEMBERSHIP_DENIED");
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain(
      "MISSING_LEGAL_ENTITY_SELECTION"
    );
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("ENTITY_GROUP_NOT_FOUND");
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("PROJECT_SCOPE_MISMATCH");
  });

  it("evaluates ownership interest effective dates from the domain contract", () => {
    expect(
      isOwnershipInterestEffectiveAt(
        {
          status: "active",
          effectiveFrom: "2026-01-01",
          effectiveTo: null,
        },
        "2026-06-01"
      )
    ).toBe(true);
  });

  it("keeps permission elevation flags serializable", () => {
    expect(DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS).toEqual({
      consolidationView: false,
      crossCompany: false,
      minorityInterestCompany: false,
      platformAdmin: false,
    });
  });
});
