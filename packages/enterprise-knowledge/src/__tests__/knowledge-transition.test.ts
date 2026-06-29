import { describe, expect, it } from "vitest";

import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import { KNOWLEDGE_TRANSITION_RULES } from "../data/transition-rules.registry.js";
import {
  canTransitionLifecycle,
  hasArchitectureAuthorityInChain,
  validateAtomLifecycleCompliance,
  validateKnowledgeLifecycleTransitions,
} from "../policy/knowledge-transition.policy.js";

function buildAtom(overrides: Partial<KnowledgeAtom>): KnowledgeAtom {
  const base = ENTERPRISE_KNOWLEDGE_ATOMS[0];
  if (!base) {
    throw new Error("expected seed atoms");
  }
  return { ...base, ...overrides };
}

describe("KNOWLEDGE_TRANSITION_RULES", () => {
  it("defines proposed→accepted, accepted→ratified, ratified→implemented", () => {
    expect(
      KNOWLEDGE_TRANSITION_RULES.map((rule) => `${rule.from}->${rule.to}`)
    ).toEqual([
      "proposed->accepted",
      "accepted->ratified",
      "ratified->implemented",
    ]);
  });
});

describe("canTransitionLifecycle", () => {
  it("rejects ratified without architecture_authority chain step", () => {
    const atom = buildAtom({
      atomId: "transition_test_accepted",
      lifecycle: "accepted",
      acceptanceChain: [
        { step: "origin", by: "external_source", on: "2026-06" },
        { step: "accepted", by: "afenda_erp_authority", on: "2026-06" },
      ],
    });

    expect(hasArchitectureAuthorityInChain(atom)).toBe(false);

    const result = canTransitionLifecycle(atom, "ratified");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toContain("architecture_authority");
  });

  it("allows ratified when architecture authority is present in chain", () => {
    const atom = buildAtom({
      atomId: "transition_test_ratified",
      lifecycle: "accepted",
      acceptanceChain: [
        { step: "origin", by: "external_source", on: "2026-06" },
        { step: "accepted", by: "afenda_accounting_authority", on: "2026-06" },
        {
          step: "ratified",
          by: "afenda_architecture_authority",
          on: "2026-06",
        },
      ],
    });

    const result = canTransitionLifecycle(atom, "ratified");
    expect(result.allowed).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it("rejects backward lifecycle transitions", () => {
    const atom = buildAtom({
      lifecycle: "ratified",
    });

    const result = canTransitionLifecycle(atom, "accepted");
    expect(result.allowed).toBe(false);
    expect(result.reasons[0]).toContain("backward");
  });
});

describe("validateKnowledgeLifecycleTransitions", () => {
  it("returns empty for all 26 registry atoms at current lifecycle", () => {
    expect(ENTERPRISE_KNOWLEDGE_ATOMS).toHaveLength(26);
    expect(
      validateKnowledgeLifecycleTransitions(ENTERPRISE_KNOWLEDGE_ATOMS)
    ).toEqual([]);
  });

  it("validateAtomLifecycleCompliance passes for ratified legal_entity", () => {
    const legalEntity = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "legal_entity"
    );
    expect(legalEntity).toBeDefined();
    expect(
      validateAtomLifecycleCompliance(legalEntity as KnowledgeAtom)
    ).toEqual([]);
  });
});
