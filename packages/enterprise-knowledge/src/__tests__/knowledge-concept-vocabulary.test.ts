import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { KnowledgeConcept } from "../contracts/knowledge-concept.contract.js";
import {
  ENTERPRISE_KNOWLEDGE_ATOMS,
  KNOWLEDGE_ATOM_IDS,
} from "../data/knowledge.registry.js";
import {
  validateAtomCorpusWithConcepts,
  validateConceptCorpus,
  validateTermCorpus,
} from "../data/knowledge-data.schema.js";
import {
  ENTERPRISE_KNOWLEDGE_CONCEPTS,
  ENTERPRISE_KNOWLEDGE_TERMS,
  getKnowledgeConcept,
  getPreferredTermForConcept,
  PLATFORM_IDENTITY_CONCEPT_IDS,
  validateKnowledgeConceptVocabulary,
} from "../policy/knowledge-concept-vocabulary.policy.js";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(pkgRoot, "src/data");

function dirname(p: string): string {
  return p.slice(0, Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\")) + 1);
}

describe("PAS-004C §4.1 — concept + vocabulary layer (B38)", () => {
  it("concepts.json validates with platform identity concepts", () => {
    const raw = JSON.parse(
      readFileSync(join(dataDir, "concepts.json"), "utf8")
    ) as unknown[];
    expect(validateConceptCorpus(raw)).toEqual([]);
    expect(raw.length).toBeGreaterThanOrEqual(
      PLATFORM_IDENTITY_CONCEPT_IDS.length
    );
    for (const id of PLATFORM_IDENTITY_CONCEPT_IDS) {
      expect(getKnowledgeConcept(id)?.conceptId).toBe(id);
    }
  });

  it("terms.json validates with one preferred term per concept", () => {
    const conceptsRaw = JSON.parse(
      readFileSync(join(dataDir, "concepts.json"), "utf8")
    ) as KnowledgeConcept[];
    const conceptIds = new Set(conceptsRaw.map((c) => c.conceptId));
    const raw = JSON.parse(
      readFileSync(join(dataDir, "terms.json"), "utf8")
    ) as unknown[];
    expect(validateTermCorpus(raw, conceptIds)).toEqual([]);
    for (const concept of ENTERPRISE_KNOWLEDGE_CONCEPTS) {
      const preferred = getPreferredTermForConcept(concept.conceptId);
      expect(preferred?.preferred).toBe(true);
      expect(preferred?.conceptId).toBe(concept.conceptId);
    }
  });

  it("all 47 atoms carry conceptId resolving to concepts.json", () => {
    const conceptsRaw = JSON.parse(
      readFileSync(join(dataDir, "concepts.json"), "utf8")
    ) as unknown[];
    const conceptIds = new Set(
      (conceptsRaw as KnowledgeConcept[]).map((c) => c.conceptId)
    );
    const atomsRaw = JSON.parse(
      readFileSync(join(dataDir, "atoms.json"), "utf8")
    ) as unknown[];
    expect(atomsRaw).toHaveLength(47);
    expect(validateAtomCorpusWithConcepts(atomsRaw, conceptIds)).toEqual([]);
    expect(
      ENTERPRISE_KNOWLEDGE_ATOMS.every(
        (atom) => atom.conceptId !== undefined && conceptIds.has(atom.conceptId)
      )
    ).toBe(true);
  });

  it("concept-kind atoms use conceptId matching atomId", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      if (atom.kind !== "concept") {
        continue;
      }
      expect(atom.conceptId).toBe(atom.atomId);
    }
  });

  it("validateKnowledgeConceptVocabulary returns no errors", () => {
    expect(validateKnowledgeConceptVocabulary()).toEqual([]);
  });

  it("public exports include concept and term corpora", () => {
    expect(ENTERPRISE_KNOWLEDGE_CONCEPTS.length).toBe(48);
    expect(ENTERPRISE_KNOWLEDGE_TERMS.length).toBe(69);
    expect([...KNOWLEDGE_ATOM_IDS]).toHaveLength(47);
    for (const term of ENTERPRISE_KNOWLEDGE_TERMS) {
      expect(term.ownedByPas).toBe("PAS-004C");
    }
  });
});
