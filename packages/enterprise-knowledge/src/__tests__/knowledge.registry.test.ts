import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  B24_KNOWLEDGE_ATOM_IDS,
  ENTERPRISE_KNOWLEDGE_ATOMS,
  getKnowledgeAtom,
  isKnowledgeAtomId,
  isRatifiedOrLaterLifecycle,
  KNOWLEDGE_ATOM_IDS,
  KNOWLEDGE_EDGES,
  KNOWLEDGE_RELATIONSHIPS,
  validateKnowledgeRegistry,
} from "../index.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

describe("@afenda/enterprise-knowledge registry", () => {
  it("registers twenty-four atoms with stable ids (B24 + B29 + B31)", () => {
    expect(KNOWLEDGE_ATOM_IDS).toHaveLength(24);
    expect(ENTERPRISE_KNOWLEDGE_ATOMS).toHaveLength(24);
    expect(new Set(KNOWLEDGE_ATOM_IDS).size).toBe(24);
    expect(
      [...KNOWLEDGE_ATOM_IDS].slice(0, B24_KNOWLEDGE_ATOM_IDS.length)
    ).toEqual([...B24_KNOWLEDGE_ATOM_IDS]);
  });

  it("keeps KNOWLEDGE_ATOM_IDS in sync with atoms.json corpus order", () => {
    const jsonIds = ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId);
    expect([...KNOWLEDGE_ATOM_IDS]).toEqual(jsonIds);
  });

  it("maps atom ids to registry entries", () => {
    for (const atomId of KNOWLEDGE_ATOM_IDS) {
      expect(isKnowledgeAtomId(atomId)).toBe(true);
      expect(getKnowledgeAtom(atomId).atomId).toBe(atomId);
    }

    expect(isKnowledgeAtomId("not-an-atom")).toBe(false);
  });

  it("passes constitutional registry validation", () => {
    expect(validateKnowledgeRegistry()).toEqual([]);
  });

  it("points evidence paths at on-disk artifacts when repo-relative", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      for (const entry of atom.typedEvidence) {
        const evidencePath = entry.source;
        if (
          !(
            evidencePath.startsWith("packages/") ||
            evidencePath.startsWith("docs/")
          )
        ) {
          continue;
        }

        expect(
          existsSync(join(repoRoot, evidencePath)),
          `missing evidence ${evidencePath}`
        ).toBe(true);
      }
    }
  });

  it("documents workspace and surface as derived without overstating lifecycle", () => {
    const workspace = getKnowledgeAtom("workspace");
    const surface = getKnowledgeAtom("surface");

    expect(workspace.implementationMapping?.persistenceClass).toBe("derived");
    expect(surface.implementationMapping?.persistenceClass).toBe("derived");
    expect(isRatifiedOrLaterLifecycle(workspace.lifecycle)).toBe(true);
  });

  it("records organization split evolution honestly", () => {
    const split = getKnowledgeAtom("organization_split");

    expect(split.lineage.evolution.some((entry) => entry.includes("v1"))).toBe(
      true
    );
    expect(split.lineage.evolution.some((entry) => entry.includes("v2"))).toBe(
      true
    );
  });

  it("resolves every relationship edge", () => {
    for (const edge of KNOWLEDGE_RELATIONSHIPS) {
      expect(isKnowledgeAtomId(edge.fromAtomId)).toBe(true);
      expect(isKnowledgeAtomId(edge.toAtomId)).toBe(true);
    }
  });

  it("loads authoritative KnowledgeEdge rows from edges.json", () => {
    expect(KNOWLEDGE_EDGES).toHaveLength(13);
    for (const edge of KNOWLEDGE_EDGES) {
      expect(edge.edgeId.length).toBeGreaterThan(0);
      expect(isKnowledgeAtomId(edge.fromAtomId)).toBe(true);
      expect(isKnowledgeAtomId(edge.toAtomId)).toBe(true);
    }
  });
});

type AssertSerializable<T> = T extends string | number | boolean | null
  ? true
  : T extends readonly (infer U)[]
    ? AssertSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _KnowledgeAtomSerializable = AssertSerializable<
  (typeof ENTERPRISE_KNOWLEDGE_ATOMS)[number]
>;
