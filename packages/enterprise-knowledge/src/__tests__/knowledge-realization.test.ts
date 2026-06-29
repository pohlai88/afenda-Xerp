import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { REALIZATION_KINDS } from "../contracts/knowledge-realization.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  normalizeAtomRealization,
  parseAtomCorpus,
  stripLegacyPublicAtomFields,
} from "../data/knowledge-data.loader.js";
import {
  collectRealizationKinds,
  getAtomRealizationMappings,
  getPrimaryKernelRealization,
  REALIZATION_MAPPING_EVIDENCE_ATOM_IDS,
  validateKnowledgeRealizationMapping,
} from "../policy/knowledge-realization.policy.js";

describe("knowledge-realization.contract", () => {
  it("defines realizationKind enum through report", () => {
    expect(REALIZATION_KINDS).toEqual([
      "kernel",
      "schema",
      "contract",
      "sop",
      "policy",
      "regulation",
      "training",
      "api",
      "ui",
      "report",
    ]);
  });
});

describe("normalizeAtomRealization", () => {
  it("derives realizationMapping from legacy implementationMapping", () => {
    const normalized = normalizeAtomRealization({
      atomId: "sample",
      implementationMapping: {
        contractPath: "packages/kernel/src/context/tenant-context.contract.ts",
        brandedId: "TenantId",
        upstreamContract: "TenantContext",
        databaseTable: "tenants",
        persistenceClass: "persisted",
        runtimeStatus: "implemented",
      },
    });

    const mappings = normalized["realizationMapping"] as readonly {
      realizationKind: string;
    }[];
    expect(mappings).toHaveLength(3);
    expect(mappings.map((entry) => entry.realizationKind)).toEqual([
      "kernel",
      "schema",
      "contract",
    ]);
  });

  it("preserves explicit realizationMapping when present", () => {
    const explicit = [
      {
        realizationKind: "ui",
        reference: "packages/metadata-ui/src/surfaces/index.tsx",
      },
    ];
    const normalized = normalizeAtomRealization({
      atomId: "sample",
      realizationMapping: explicit,
      implementationMapping: {
        contractPath: "packages/kernel/src/context/tenant-context.contract.ts",
        persistenceClass: "persisted",
        runtimeStatus: "implemented",
      },
    });
    expect(normalized["realizationMapping"]).toEqual(explicit);
  });
});

describe("stripLegacyPublicAtomFields", () => {
  it("removes implementationMapping while preserving realizationMapping", () => {
    const stripped = stripLegacyPublicAtomFields({
      atomId: "sample",
      implementationMapping: {
        contractPath: "packages/kernel/src/x.contract.ts",
      },
      realizationMapping: [
        {
          realizationKind: "kernel",
          reference: "packages/kernel/src/x.contract.ts",
        },
      ],
    });
    expect(stripped["implementationMapping"]).toBeUndefined();
    expect(stripped["realizationMapping"]).toHaveLength(1);
  });
});

describe("parseAtomCorpus backward compat", () => {
  it("normalizes atoms with implementationMapping only", () => {
    const atoms = parseAtomCorpus([
      {
        atomId: "legacy_only",
        fqn: "afenda.enterprise.legacy_only",
        kind: "concept",
        acceptanceChain: [{ step: "accepted", by: "erp_authority" }],
        authorityType: "engineering",
        binding: "optional",
        confidence: { score: 50, basis: ["afenda_decision"] },
        knowledgeDecision: {
          decision: "test",
          alternativesConsidered: ["a"],
          whyRejected: {},
          impact: [],
        },
        meaning: {
          canonical: "c",
          business: "b",
          engineering: "e",
        },
        knowledgeDomain: ["platform"],
        applicability: {
          applicable: ["platform"],
          notApplicable: [],
          exceptions: [],
        },
        lifecycle: "proposed",
        epistemicStatus: "candidate",
        semanticStability: "evolutionary",
        lineage: {
          origin: "test",
          evolution: [],
          currentAuthority: "test",
          futureDirection: "test",
        },
        misconceptions: [],
        exposure: { audience: "engineering_only", afendaPreferredWording: "x" },
        integrity: {
          correctness: true,
          completeness: true,
          consistency: true,
          authority: true,
          acceptance: true,
          evidence: true,
          reasoning: true,
          applicability: true,
          evolution: true,
          relationship: true,
        },
        implementationMapping: {
          contractPath:
            "packages/kernel/src/context/tenant-context.contract.ts",
          persistenceClass: "authority_only",
          runtimeStatus: "authority_only",
        },
        ownedByPas: "PAS-004",
        typedEvidence: [
          {
            evidenceId: "e0",
            type: "policy",
            source: "packages/kernel/src/context/tenant-context.contract.ts",
          },
        ],
        structuredReasoning: {
          premises: ["p"],
          inference: "i",
          rules: ["r"],
          conclusion: "c",
        },
      },
    ]);

    expect(atoms[0]?.realizationMapping?.[0]?.realizationKind).toBe("kernel");
    expect(atoms[0]?.implementationMapping).toBeUndefined();
  });
});

describe("realization corpus evidence", () => {
  it("includes kernel realization on platform identity atoms", () => {
    for (const atomId of REALIZATION_MAPPING_EVIDENCE_ATOM_IDS) {
      const atom = ENTERPRISE_KNOWLEDGE_ATOMS.find(
        (candidate) => candidate.atomId === atomId
      );
      expect(atom, atomId).toBeDefined();
      expect(getPrimaryKernelRealization(atom!)).toBeDefined();
    }
  });

  it("cites ≥3 realization kinds in loaded corpus", () => {
    expect(
      collectRealizationKinds(ENTERPRISE_KNOWLEDGE_ATOMS).size
    ).toBeGreaterThanOrEqual(3);
  });

  it("passes validateKnowledgeRealizationMapping against repo", () => {
    const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
    const errors = validateKnowledgeRealizationMapping(
      ENTERPRISE_KNOWLEDGE_ATOMS,
      { repoRoot }
    );
    expect(errors).toEqual([]);
  });
});

describe("kernel realization discipline", () => {
  it("requires kernel entries to cite contract paths only", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      for (const entry of getAtomRealizationMappings(atom)) {
        if (entry.realizationKind !== "kernel") {
          continue;
        }
        const contractPath = entry.contractPath ?? entry.reference;
        expect(contractPath.endsWith(".contract.ts")).toBe(true);
        expect(contractPath.includes(".parser.")).toBe(false);
        expect(contractPath.includes(".assert.")).toBe(false);
      }
    }
  });
});
