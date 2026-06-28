import { describe, expect, it } from "vitest";
import {
  isPlatformIdentityKnowledgeAtomId,
  PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS,
  resolvePlatformIdentityKnowledgeBusinessTitle,
  resolvePlatformIdentityKnowledgeCanonicalDefinition,
  resolvePlatformIdentityKnowledgeLabel,
} from "../knowledge/platform-identity-vocabulary.js";

describe("platform-identity-vocabulary (PAS-004C B47 metadata consumer projection)", () => {
  it("resolves at least three platform identity labels from atoms", () => {
    expect(PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS.length).toBeGreaterThanOrEqual(
      3
    );

    for (const atomId of [
      "tenant",
      "legal_entity",
      "organization_unit",
    ] as const) {
      expect(
        resolvePlatformIdentityKnowledgeLabel(atomId).length
      ).toBeGreaterThan(0);
      expect(
        resolvePlatformIdentityKnowledgeCanonicalDefinition(atomId).length
      ).toBeGreaterThan(0);
      expect(
        resolvePlatformIdentityKnowledgeBusinessTitle(atomId).length
      ).toBeGreaterThan(0);
    }
  });

  it("recognizes platform identity atom ids", () => {
    expect(isPlatformIdentityKnowledgeAtomId("tenant")).toBe(true);
    expect(isPlatformIdentityKnowledgeAtomId("workspace")).toBe(true);
    expect(isPlatformIdentityKnowledgeAtomId("unknown")).toBe(false);
  });

  it("returns tenant SaaS boundary wording from atoms", () => {
    const label = resolvePlatformIdentityKnowledgeLabel("tenant");
    expect(label.toLowerCase()).toContain("tenant");
  });
});
