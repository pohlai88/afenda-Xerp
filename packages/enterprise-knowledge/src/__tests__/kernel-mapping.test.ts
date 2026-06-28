import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  getKernelEvidencePaths,
  isKernelEvidencePath,
  isProhibitedKernelEvidencePath,
  validateKnowledgeKernelMapping,
} from "../policy/knowledge-kernel-mapping.policy.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

describe("Knowledge kernel mapping (PAS-004A §4.2 · B26)", () => {
  it("detects kernel evidence paths by prefix", () => {
    expect(
      isKernelEvidencePath(
        "packages/kernel/src/context/legal-entity-context.contract.ts"
      )
    ).toBe(true);
    expect(
      isKernelEvidencePath(
        "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md"
      )
    ).toBe(false);
  });

  it("flags parser paths as prohibited", () => {
    expect(
      isProhibitedKernelEvidencePath(
        "packages/kernel/src/context/legal-entity-context.parser.ts"
      )
    ).toBe(true);
    expect(
      isProhibitedKernelEvidencePath(
        "packages/kernel/src/context/legal-entity-context.contract.ts"
      )
    ).toBe(false);
  });

  it("mapped atoms in the live registry cite kernel contract evidence", () => {
    const mapped = ENTERPRISE_KNOWLEDGE_ATOMS.filter(
      (atom) => atom.implementationMapping !== undefined
    );
    expect(mapped.length).toBeGreaterThan(0);

    for (const atom of mapped) {
      const kernelPaths = getKernelEvidencePaths(atom);
      expect(kernelPaths.length).toBeGreaterThan(0);
      expect(kernelPaths.some((path) => path.endsWith(".contract.ts"))).toBe(
        true
      );
    }
  });

  it("validateKnowledgeKernelMapping passes for the live corpus", () => {
    const errors = validateKnowledgeKernelMapping(ENTERPRISE_KNOWLEDGE_ATOMS, {
      repoRoot,
    });
    expect(errors).toEqual([]);
  });

  it("rejects missing kernel evidence for mapped atoms", () => {
    const baseAtom = ENTERPRISE_KNOWLEDGE_ATOMS[0];
    if (!baseAtom) {
      throw new Error("expected at least one knowledge atom in registry");
    }
    const atom: KnowledgeAtom = {
      ...baseAtom,
      atomId: "test_atom",
      typedEvidence: [
        {
          evidenceId: "test_evidence_1",
          type: "policy",
          source: "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
        },
      ],
      implementationMapping: {
        persistenceClass: "persisted",
        runtimeStatus: "implemented",
        upstreamContract: "TestContract",
      },
    };

    const errors = validateKnowledgeKernelMapping([atom], {
      repoRoot: process.cwd(),
      fileExists: () => true,
    });

    expect(
      errors.some((e) => e.includes("requires at least one kernel evidence"))
    ).toBe(true);
  });

  it("rejects parser evidence paths", () => {
    const baseAtom = ENTERPRISE_KNOWLEDGE_ATOMS[0];
    if (!baseAtom) {
      throw new Error("expected at least one knowledge atom in registry");
    }
    const atom: KnowledgeAtom = {
      ...baseAtom,
      atomId: "test_atom",
      typedEvidence: [
        {
          evidenceId: "test_evidence_parser",
          type: "policy",
          source: "packages/kernel/src/context/legal-entity-context.parser.ts",
        },
      ],
    };

    const errors = validateKnowledgeKernelMapping([atom], {
      repoRoot: process.cwd(),
      fileExists: () => true,
    });

    expect(
      errors.some((e) => e.includes("must not reference kernel parser"))
    ).toBe(true);
  });
});
