import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { KnowledgePerspective } from "../contracts/knowledge-perspective.contract.js";
import {
  ENTERPRISE_KNOWLEDGE_ATOMS,
  KNOWLEDGE_ATOM_IDS,
} from "../data/knowledge.registry.js";
import { validatePerspectiveCorpus } from "../data/knowledge-data.schema.js";
import { parsePerspectiveCorpus } from "../data/knowledge-perspective.loader.js";
import {
  ENTERPRISE_KNOWLEDGE_CONCEPTS,
  PLATFORM_IDENTITY_CONCEPT_IDS,
} from "../policy/knowledge-concept-vocabulary.policy.js";
import {
  ENTERPRISE_KNOWLEDGE_PERSPECTIVES,
  getKnowledgePerspective,
  getPerspectivesForConcept,
  PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS,
  validateKnowledgePerspective,
} from "../policy/knowledge-perspective.policy.js";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(pkgRoot, "src/data");

function dirname(p: string): string {
  return p.slice(0, Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\")) + 1);
}

describe("PAS-004C §4.2 — contextual meaning perspectives (B39)", () => {
  it("perspectives.json validates with resolving atomIds", () => {
    const conceptIds = new Set(
      ENTERPRISE_KNOWLEDGE_CONCEPTS.map((c) => c.conceptId)
    );
    const atomIds = new Set([...KNOWLEDGE_ATOM_IDS]);
    const raw = JSON.parse(
      readFileSync(join(dataDir, "perspectives.json"), "utf8")
    ) as unknown[];
    expect(validatePerspectiveCorpus(raw, conceptIds, atomIds)).toEqual([]);
    expect(raw.length).toBeGreaterThanOrEqual(
      PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS.length
    );
  });

  it("includes ≥3 platform identity perspectives for legal_entity domains", () => {
    const legalEntityPerspectives = getPerspectivesForConcept("legal_entity");
    expect(legalEntityPerspectives.length).toBeGreaterThanOrEqual(3);
    for (const required of PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS) {
      const match = legalEntityPerspectives.find(
        (perspective) => perspective.domain === required.domain
      );
      expect(match?.conceptId).toBe("legal_entity");
      expect(match?.atomId).toBe("legal_entity");
      expect(match?.contextualLabel.length).toBeGreaterThan(0);
    }
  });

  it("getPerspectivesForConcept returns only matching conceptId", () => {
    const legalEntityPerspectives = getPerspectivesForConcept("legal_entity");
    expect(
      legalEntityPerspectives.every(
        (perspective) => perspective.conceptId === "legal_entity"
      )
    ).toBe(true);
    expect(getPerspectivesForConcept("nonexistent_concept")).toEqual([]);
  });

  it("getPerspectivesForConcept is a pure export with stable ordering", () => {
    const first = getPerspectivesForConcept("legal_entity");
    const second = getPerspectivesForConcept("legal_entity");
    expect(first).toEqual(second);
    expect(first.map((p) => p.perspectiveId)).toEqual(
      ENTERPRISE_KNOWLEDGE_PERSPECTIVES.filter(
        (p) => p.conceptId === "legal_entity"
      ).map((p) => p.perspectiveId)
    );
  });

  it("validateKnowledgePerspective returns no errors", () => {
    expect(validateKnowledgePerspective()).toEqual([]);
  });

  it("parsePerspectiveCorpus rejects unknown conceptId", () => {
    const atomIds = new Set([...KNOWLEDGE_ATOM_IDS]);
    const invalid = [
      {
        perspectiveId: "bad_perspective",
        conceptId: "missing_concept",
        domain: "accounting",
        domainClass: "business",
        atomId: "legal_entity",
        contextualLabel: "Test",
        ownedByPas: "PAS-004C",
      },
    ] satisfies KnowledgePerspective[];
    expect(() =>
      parsePerspectiveCorpus(invalid, new Set(["legal_entity"]), atomIds)
    ).toThrow(/unknown conceptId/);
  });

  it("platform identity concept legal_entity is present in concepts corpus", () => {
    expect(PLATFORM_IDENTITY_CONCEPT_IDS).toContain("legal_entity");
    expect(
      ENTERPRISE_KNOWLEDGE_ATOMS.find((atom) => atom.atomId === "legal_entity")
        ?.conceptId
    ).toBe("legal_entity");
  });

  it("getKnowledgePerspective resolves by perspectiveId", () => {
    const perspective = getKnowledgePerspective("legal_entity_accounting");
    expect(perspective?.domain).toBe("accounting");
    expect(perspective?.contextualLabel.length).toBeGreaterThan(0);
  });
});
