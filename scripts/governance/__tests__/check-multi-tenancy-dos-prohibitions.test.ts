import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  checkMultiTenancyDosProhibitions,
  formatMultiTenancyDosProhibitionsViolations,
} from "../check-multi-tenancy-dos-prohibitions.mts";
import {
  MULTI_TENANCY_DOC_DOS_MARKERS,
  MULTI_TENANCY_DOC_PROHIBITIONS_MARKERS,
  MULTI_TENANCY_DOS_DELEGATED_GATES,
  MULTI_TENANCY_DOS_PROHIBITIONS_RISK_MITIGATIONS,
  MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE,
  MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS,
  MULTI_TENANCY_PROHIBITION_ENFORCEMENT,
} from "../multi-tenancy-dos-prohibitions-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-dos-prohibitions script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyDosProhibitions();
    expect(
      violations,
      formatMultiTenancyDosProhibitionsViolations(violations)
    ).toEqual([]);
  });

  it("documents all Do's markers from multi-tenancy.md §447–463", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_DOS_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }

    expect(MULTI_TENANCY_DOC_DOS_MARKERS).toHaveLength(15);
  });

  it("documents all Prohibitions markers from multi-tenancy.md §465–480", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_PROHIBITIONS_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }

    expect(MULTI_TENANCY_DOC_PROHIBITIONS_MARKERS).toHaveLength(14);
  });

  it("maps every Do to a delegated governance gate", () => {
    expect(MULTI_TENANCY_DOS_DELEGATED_GATES).toHaveLength(15);

    for (const entry of MULTI_TENANCY_DOS_DELEGATED_GATES) {
      expect(entry.checkScript).toMatch(/^check:/);
    }
  });

  it("maps every Prohibition to enforcement ownership", () => {
    expect(MULTI_TENANCY_PROHIBITION_ENFORCEMENT).toHaveLength(14);

    for (const entry of MULTI_TENANCY_PROHIBITION_ENFORCEMENT) {
      expect(entry.checkScript).toMatch(/^check:/);
      expect(entry.scanRule.length).toBeGreaterThan(0);
    }
  });

  it("requires glossary headings for all 11 domain terms", () => {
    const glossary = readFileSync(
      join(repoRoot, "docs/architecture/glossary.md"),
      "utf8"
    );

    for (const heading of MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS) {
      expect(glossary).toContain(heading);
    }

    expect(MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS).toHaveLength(11);
  });

  it("declares the canonical surface rule constant", () => {
    const registrySource = readFileSync(
      join(
        repoRoot,
        "scripts/governance/multi-tenancy-dos-prohibitions-registry.mts"
      ),
      "utf8"
    );

    expect(registrySource).toContain(
      MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE
    );
  });

  it("documents risk mitigations with low residual ratings", () => {
    expect(
      MULTI_TENANCY_DOS_PROHIBITIONS_RISK_MITIGATIONS.length
    ).toBeGreaterThanOrEqual(5);

    for (const entry of MULTI_TENANCY_DOS_PROHIBITIONS_RISK_MITIGATIONS) {
      expect(entry.residual).toBe("low");
      expect(entry.scanRule.length).toBeGreaterThan(0);
    }
  });
});
