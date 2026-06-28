import { describe, expect, it } from "vitest";
import { getKnowledgeAtom } from "../policy/knowledge.policy.js";
import {
  CONFLICTING_FRAMEWORK_BASES,
  CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS,
  hasConflictingFrameworkBasis,
  requiresContextualValidity,
  validateAtomContextualValidity,
  validateContextualValidity,
} from "../policy/knowledge-contextual-validity.policy.js";

describe("PAS-004C §4.6 — accepted vs applicable (B41)", () => {
  it("detects IFRS + GAAP as conflicting framework basis", () => {
    expect(
      hasConflictingFrameworkBasis({
        score: 100,
        basis: ["IFRS", "GAAP"],
      })
    ).toBe(true);
    expect(
      hasConflictingFrameworkBasis({
        score: 100,
        basis: ["IFRS", "afenda_decision"],
      })
    ).toBe(false);
    expect(CONFLICTING_FRAMEWORK_BASES).toEqual(["IFRS", "GAAP"]);
  });

  it("requires contextualValidity on multi-framework atoms", () => {
    const doubleEntry = getKnowledgeAtom("double_entry");
    const accountingEquation = getKnowledgeAtom("accounting_equation");
    if (!(doubleEntry && accountingEquation)) {
      throw new Error("expected double_entry and accounting_equation atoms");
    }
    expect(requiresContextualValidity(doubleEntry)).toBe(true);
    expect(requiresContextualValidity(accountingEquation)).toBe(true);
    expect(validateAtomContextualValidity(doubleEntry)).toEqual([]);
    expect(validateAtomContextualValidity(accountingEquation)).toEqual([]);
  });

  it("ifrs_10 documents applicableIn and notApplicableIn", () => {
    const ifrs10 = getKnowledgeAtom("ifrs_10");
    if (!ifrs10) {
      throw new Error("expected ifrs_10 atom");
    }
    expect(ifrs10.contextualValidity?.applicableIn.length).toBeGreaterThan(0);
    expect(ifrs10.contextualValidity?.notApplicableIn.length).toBeGreaterThan(
      0
    );
    expect(ifrs10.contextualValidity?.accepted).toBe(true);
    expect(CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS).toContain("ifrs_10");
    expect(validateAtomContextualValidity(ifrs10)).toEqual([]);
  });

  it("validateContextualValidity returns empty for corpus", () => {
    expect(validateContextualValidity()).toEqual([]);
  });
});
