import { describe, expect, it } from "vitest";
import {
  extractSurfaceStrings,
  validateModuleKnowledgeTerms,
  validateSurfaceStrings,
} from "../vocabulary/knowledge-vocabulary-coverage.js";
import {
  buildCspellEnterpriseDictionary,
  buildVocabularyAllowlist,
  tokenizeVocabularyText,
} from "../vocabulary/knowledge-vocabulary-export.js";

describe("knowledge-vocabulary-export", () => {
  it("tokenizes camelCase and snake_case labels", () => {
    expect(tokenizeVocabularyText("legal_entity")).toContain("legal");
    expect(tokenizeVocabularyText("legalEntity")).toContain("entity");
  });

  it("builds deterministic allowlist with accepted platform terms", () => {
    const allowlist = buildVocabularyAllowlist();
    const legalEntity = allowlist.entries.find(
      (entry) => entry.conceptId === "legal_entity"
    );

    expect(legalEntity).toBeDefined();
    expect(legalEntity?.state).toBe("accepted");
    expect(allowlist.tokens).toContain("legal");
    expect(allowlist.tokens).toContain("entity");
    expect(
      allowlist.entries.some((entry) => entry.conceptId === "double_entry")
    ).toBe(true);
  });

  it("writes read-only cspell dictionary header", () => {
    const allowlist = buildVocabularyAllowlist();
    const dictionary = buildCspellEnterpriseDictionary(allowlist);

    expect(dictionary).toContain("# AUTO-GENERATED FILE — DO NOT EDIT");
    expect(dictionary).toContain("legal_entity");
    expect(dictionary).toContain("double_entry");
  });
});

describe("knowledge-vocabulary-coverage", () => {
  it("passes accepted procurement terms linked to corpus", () => {
    const allowlist = buildVocabularyAllowlist();
    const violations = validateModuleKnowledgeTerms(allowlist, {
      module: "procurement",
      terms: [
        {
          term: "purchase_order",
          conceptId: "purchase_order",
          atomId: "purchase_order",
          status: "accepted",
          appliesTo: ["procurement"],
        },
      ],
    });

    expect(violations).toEqual([]);
  });

  it("flags terms used outside applicable module", () => {
    const allowlist = buildVocabularyAllowlist();
    const violations = validateModuleKnowledgeTerms(allowlist, {
      module: "inventory",
      terms: [
        {
          term: "purchase_order",
          conceptId: "purchase_order",
          atomId: "purchase_order",
          status: "accepted",
          appliesTo: ["procurement"],
        },
      ],
    });

    expect(
      violations.some(
        (violation) => violation.code === "TERM_USED_OUTSIDE_APPLICABLE_MODULE"
      )
    ).toBe(true);
  });

  it("extracts surface strings with source line numbers", () => {
    const source = [
      "export const NAV = {",
      '  label: "Purchase Orders",',
      "};",
    ].join("\n");

    expect(extractSurfaceStrings(source)).toEqual([
      { line: 2, value: "Purchase Orders" },
    ]);
  });

  it("accepts registered operator nav labels in surface scan", () => {
    const allowlist = buildVocabularyAllowlist();
    const source = [
      'label: "Metadata Workspace",',
      'label: "Foundation Readiness",',
      'label: "Purchase Orders",',
      'label: "System Admin",',
      'label: "Requisitions",',
      'label: "Platform",',
      'label: "Procurement",',
      'label: "Account",',
      'label: "Profile",',
      'label: "Users",',
      'label: "Memberships",',
      'label: "Roles",',
      'label: "Permissions",',
      'label: "Audit",',
      'label: "Settings",',
      'label: "Diagnostics",',
    ].join("\n");

    expect(validateSurfaceStrings(allowlist, "nav.tsx", source)).toEqual([]);
  });

  it("flags unregistered single-word nav labels", () => {
    const allowlist = buildVocabularyAllowlist();
    const violations = validateSurfaceStrings(
      allowlist,
      "nav.tsx",
      'label: "Unregistered",'
    );

    expect(violations).toHaveLength(1);
    expect(violations[0]?.severity).toBe("error");
  });
});
