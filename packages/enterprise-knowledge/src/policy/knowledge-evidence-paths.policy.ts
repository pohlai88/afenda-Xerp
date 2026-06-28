import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeEvidence } from "../contracts/knowledge-evidence.contract.js";

/** Repo-relative implementation paths cited in typed evidence `source` fields. */
export function isImplementationEvidenceSource(source: string): boolean {
  return source.startsWith("packages/");
}

export function getKnowledgeEvidenceSources(
  atom: KnowledgeAtom
): readonly string[] {
  return atom.typedEvidence.map((entry) => entry.source);
}

export function getKernelEvidencePaths(atom: KnowledgeAtom): readonly string[] {
  return atom.typedEvidence
    .map((entry) => entry.source)
    .filter((source) => source.startsWith("packages/kernel/src/"));
}

export function inferEvidenceTypeForPath(
  path: string
): KnowledgeEvidence["type"] {
  if (path.includes("/schema/")) {
    return "sop";
  }
  if (path.startsWith("docs/adr/")) {
    return "adr";
  }
  if (path.startsWith("packages/kernel/")) {
    return "policy";
  }
  return "decision";
}

export function buildTypedEvidenceFromLegacyPaths(
  atomId: string,
  paths: readonly string[]
): readonly KnowledgeEvidence[] {
  return paths.map((source, index) => ({
    evidenceId: `${atomId}_evidence_${index + 1}`,
    type: inferEvidenceTypeForPath(source),
    source,
  }));
}
