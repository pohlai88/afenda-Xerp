import { describe, expect, it } from "vitest";
import {
  isKnowledgeConsumerProfile,
  KNOWLEDGE_CONSUMER_PROFILES,
  type KnowledgeConsumerProfile,
} from "../contracts/knowledge-consumer-profile.contract.js";
import {
  isJsonSerializableProjection,
  KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS,
  projectKnowledgeAtom,
  validateKnowledgeConsumerProfiles,
} from "../projection/knowledge-consumer.projection.js";

describe("PAS-004C §4.3 — consumer profiles (B43)", () => {
  it("defines five consumer profiles", () => {
    expect(KNOWLEDGE_CONSUMER_PROFILES).toEqual([
      "erp",
      "metadata",
      "docs",
      "ai",
      "report",
    ]);
    expect(isKnowledgeConsumerProfile("erp")).toBe(true);
    expect(isKnowledgeConsumerProfile("unknown")).toBe(false);
  });

  it("projectKnowledgeAtom returns JSON-serializable output for platform identity atoms", () => {
    for (const atomId of KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS) {
      for (const profile of KNOWLEDGE_CONSUMER_PROFILES) {
        const projected = projectKnowledgeAtom(atomId, profile);
        expect(isJsonSerializableProjection(projected)).toBe(true);
        expect(JSON.parse(JSON.stringify(projected))).toEqual(projected);
      }
    }
  });

  it("erp profile projects canonical label, short description, and binding", () => {
    const projected = projectKnowledgeAtom("tenant", "erp");
    expect(projected).toMatchObject({
      atomId: "tenant",
      canonicalLabel: expect.any(String),
      shortDescription: expect.any(String),
      binding: "mandatory",
    });
  });

  it("metadata profile projects short label and preferred wording", () => {
    const projected = projectKnowledgeAtom("legal_entity", "metadata");
    expect(projected).toMatchObject({
      atomId: "legal_entity",
      shortLabel: expect.any(String),
      preferredWording: expect.any(String),
    });
  });

  it("docs profile projects long explanation and lineage summary", () => {
    const projected = projectKnowledgeAtom("workspace", "docs");
    expect(projected["longExplanation"]).toEqual(expect.any(String));
    expect(projected["lineageSummary"]).toEqual(expect.any(String));
    expect(String(projected["lineageSummary"]).length).toBeGreaterThan(0);
  });

  it("ai profile includes misconceptions and structuredReasoning", () => {
    const projected = projectKnowledgeAtom("tenant", "ai");
    expect(Array.isArray(projected["misconceptions"])).toBe(true);
    expect(projected["structuredReasoning"]).toMatchObject({
      premises: expect.any(Array),
      inference: expect.any(String),
      rules: expect.any(Array),
      conclusion: expect.any(String),
    });
    expect(Array.isArray(projected["examples"])).toBe(true);
    expect(Array.isArray(projected["evidenceCitations"])).toBe(true);
  });

  it("report profile projects canonical label, domain, and binding", () => {
    const projected = projectKnowledgeAtom("legal_entity", "report");
    expect(projected).toMatchObject({
      atomId: "legal_entity",
      canonicalLabel: expect.any(String),
      domain: expect.any(Array),
      binding: "mandatory",
    });
  });

  it("validateKnowledgeConsumerProfiles returns empty for corpus", () => {
    expect(validateKnowledgeConsumerProfiles()).toEqual([]);
  });

  it("exhaustively covers profile union in projection switch", () => {
    const profiles: KnowledgeConsumerProfile[] = [
      ...KNOWLEDGE_CONSUMER_PROFILES,
    ];
    expect(profiles).toHaveLength(5);
    for (const profile of profiles) {
      expect(projectKnowledgeAtom("tenant", profile)["atomId"]).toBe("tenant");
    }
  });
});
