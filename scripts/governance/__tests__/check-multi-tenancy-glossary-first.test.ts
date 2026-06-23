import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyGlossaryFirst,
  formatMultiTenancyGlossaryFirstViolations,
} from "../check-multi-tenancy-glossary-first.mts";
import {
  MULTI_TENANCY_DOC_GLOSSARY_FIRST_MARKERS,
  MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES,
  MULTI_TENANCY_GLOSSARY_FIRST_REQUIRED_TERMS,
  MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE,
  MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE,
  MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS,
} from "../multi-tenancy-glossary-first-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-glossary-first script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyGlossaryFirst();
    expect(
      violations,
      formatMultiTenancyGlossaryFirstViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 1 markers from multi-tenancy.md §484–500", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_GLOSSARY_FIRST_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("requires exactly eleven Step 1 glossary terms", () => {
    expect(MULTI_TENANCY_GLOSSARY_FIRST_REQUIRED_TERMS).toHaveLength(11);
    expect(MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS).toHaveLength(11);
    expect(MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE).toBe(11);
  });

  it("defines cross-term do-not-confuse phrases", () => {
    expect(
      MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES.length
    ).toBeGreaterThanOrEqual(7);

    const glossary = readFileSync(
      join(repoRoot, "docs/architecture/glossary.md"),
      "utf8"
    );

    for (const phrase of MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES) {
      expect(glossary).toContain(phrase);
    }
  });

  it("exports the glossary-first surface rule", () => {
    expect(MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE).toBe(
      "multi-tenancy-glossary-first-is-canonical-vocabulary-before-implementation"
    );
  });
});
