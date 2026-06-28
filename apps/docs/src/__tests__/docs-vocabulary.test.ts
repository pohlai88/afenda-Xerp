import { describe, expect, it } from "vitest";
import {
  DOCS_PLATFORM_IDENTITY_ATOM_IDS,
  formatDocsKnowledgeAtomCitation,
  isDocsPlatformIdentityAtomId,
  resolveDocsKnowledgeAtomDefinition,
  resolveDocsKnowledgeAtomTitle,
} from "../lib/knowledge/docs-vocabulary";

describe("docs-vocabulary (PAS-004C B48 docs consumer projection)", () => {
  it("resolves at least three platform identity atom definitions", () => {
    expect(DOCS_PLATFORM_IDENTITY_ATOM_IDS.length).toBeGreaterThanOrEqual(3);

    for (const atomId of ["tenant", "legal_entity", "organization_unit"] as const) {
      expect(resolveDocsKnowledgeAtomTitle(atomId).length).toBeGreaterThan(0);
      expect(resolveDocsKnowledgeAtomDefinition(atomId).length).toBeGreaterThan(
        0
      );
      expect(formatDocsKnowledgeAtomCitation(atomId)).toContain(atomId);
    }
  });

  it("recognizes docs platform identity atom ids", () => {
    expect(isDocsPlatformIdentityAtomId("tenant")).toBe(true);
    expect(isDocsPlatformIdentityAtomId("unknown")).toBe(false);
  });
});
