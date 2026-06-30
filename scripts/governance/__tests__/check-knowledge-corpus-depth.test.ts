import { describe, expect, it } from "vitest";

import type { KnowledgeAtom } from "../../../packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.js";
import type { KnowledgeEdge } from "../../../packages/enterprise-knowledge/src/contracts/knowledge-edge.contract.js";
import type { KnowledgePerspective } from "../../../packages/enterprise-knowledge/src/contracts/knowledge-perspective.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import { KNOWLEDGE_EDGES } from "../../../packages/enterprise-knowledge/src/data/knowledge-edge.registry.ts";
import {
  B51_MIN_CONTEXTUAL_VALIDITY_ATOMS,
  B51_MIN_PERSPECTIVES_PER_CONCEPT,
  B51_MIN_SEMANTIC_EDGES,
  B51_PERSPECTIVE_CONCEPT_IDS,
  formatKnowledgeCorpusDepthErrors,
  KNOWLEDGE_CORPUS_DEPTH_RULE,
  validateKnowledgeCorpusDepth,
} from "../../../packages/enterprise-knowledge/src/policy/knowledge-corpus-depth.policy.ts";
import { ENTERPRISE_KNOWLEDGE_PERSPECTIVES } from "../../../packages/enterprise-knowledge/src/policy/knowledge-perspective.policy.ts";
import { checkKnowledgeCorpusDepth } from "../check-knowledge-corpus-depth.mts";

describe("check-knowledge-corpus-depth", () => {
  it("passes on the current repository state", () => {
    const errors = checkKnowledgeCorpusDepth();
    expect(errors, formatKnowledgeCorpusDepthErrors(errors)).toEqual([]);
  });

  it("exports the corpus depth rule identifier", () => {
    expect(KNOWLEDGE_CORPUS_DEPTH_RULE).toBe(
      "knowledge-corpus-depth-perspectives-contextual-validity-edges-realization"
    );
  });

  it("requires minimum perspective counts for platform identity concepts", () => {
    for (const conceptId of B51_PERSPECTIVE_CONCEPT_IDS) {
      const count = ENTERPRISE_KNOWLEDGE_PERSPECTIVES.filter(
        (perspective) => perspective.conceptId === conceptId
      ).length;
      expect(count).toBeGreaterThanOrEqual(B51_MIN_PERSPECTIVES_PER_CONCEPT);
    }
  });

  it("requires minimum contextualValidity atoms and semantic edges", () => {
    const contextualValidityCount = ENTERPRISE_KNOWLEDGE_ATOMS.filter(
      (atom) => atom.contextualValidity !== undefined
    ).length;
    expect(contextualValidityCount).toBeGreaterThanOrEqual(
      B51_MIN_CONTEXTUAL_VALIDITY_ATOMS
    );
    expect(KNOWLEDGE_EDGES.length).toBeGreaterThanOrEqual(
      B51_MIN_SEMANTIC_EDGES
    );
  });

  it("fails when a required concept has insufficient perspectives", () => {
    const sparsePerspectives: KnowledgePerspective[] =
      ENTERPRISE_KNOWLEDGE_PERSPECTIVES.filter(
        (perspective) => perspective.conceptId !== "tenant"
      );

    const errors = validateKnowledgeCorpusDepth(
      ENTERPRISE_KNOWLEDGE_ATOMS,
      sparsePerspectives,
      KNOWLEDGE_EDGES
    );

    expect(errors.some((error) => error.includes('"tenant"'))).toBe(true);
  });

  it("fails when parsed atom retains implementationMapping at public boundary", () => {
    const tenantAtom = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "tenant"
    );
    expect(tenantAtom).toBeDefined();
    if (!tenantAtom) {
      throw new Error("expected tenant atom");
    }

    const withLegacyField: KnowledgeAtom = {
      ...tenantAtom,
      implementationMapping: {
        upstreamContract: "TenantContext",
        contractPath: "packages/kernel/src/context/tenant-context.contract.ts",
        brandedId: "TenantId",
        databaseTable: "tenants",
        operatingContextField: "tenant",
        runtimeStatus: "implemented",
        persistenceClass: "persisted",
      },
    };

    const errors = validateKnowledgeCorpusDepth(
      ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) =>
        atom.atomId === "tenant" ? withLegacyField : atom
      ),
      ENTERPRISE_KNOWLEDGE_PERSPECTIVES,
      KNOWLEDGE_EDGES
    );

    expect(
      errors.some((error) => error.includes("implementationMapping"))
    ).toBe(true);
  });

  it("fails when semantic edge count is below threshold", () => {
    const sparseEdges: KnowledgeEdge[] = KNOWLEDGE_EDGES.slice(0, 2);

    const errors = validateKnowledgeCorpusDepth(
      ENTERPRISE_KNOWLEDGE_ATOMS,
      ENTERPRISE_KNOWLEDGE_PERSPECTIVES,
      sparseEdges
    );

    expect(errors.some((error) => error.includes("edges.json"))).toBe(true);
  });
});
