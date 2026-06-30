/**
 * PAS-004D §4.3 — B51: semantic corpus depth validation policy.
 */
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeEdge } from "../contracts/knowledge-edge.contract.js";
import type { KnowledgePerspective } from "../contracts/knowledge-perspective.contract.js";
import { PLATFORM_IDENTITY_ATOM_IDS } from "./knowledge-kernel-identity-mapping.policy.js";
import { getAtomRealizationMappings } from "./knowledge-realization.policy.js";

/** Platform identity concepts requiring ≥3 perspectives each (PAS-004D §4.3). */
export const B51_PERSPECTIVE_CONCEPT_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
] as const;

export type B51PerspectiveConceptId =
  (typeof B51_PERSPECTIVE_CONCEPT_IDS)[number];

export const B51_MIN_PERSPECTIVES_PER_CONCEPT = 3 as const;
export const B51_MIN_CONTEXTUAL_VALIDITY_ATOMS = 6 as const;
export const B51_MIN_SEMANTIC_EDGES = 8 as const;

/** Accounting invariant atoms that must expose realizationMapping at public boundary. */
export const B51_ACCOUNTING_INVARIANT_ATOM_IDS = [
  "double_entry",
  "accounting_equation",
] as const;

export type B51AccountingInvariantAtomId =
  (typeof B51_ACCOUNTING_INVARIANT_ATOM_IDS)[number];

export const B51_REALIZATION_REQUIRED_ATOM_IDS = [
  ...PLATFORM_IDENTITY_ATOM_IDS,
  ...B51_ACCOUNTING_INVARIANT_ATOM_IDS,
] as const;

export const KNOWLEDGE_CORPUS_DEPTH_RULE =
  "knowledge-corpus-depth-perspectives-contextual-validity-edges-realization" as const;

function countPerspectivesForConcept(
  perspectives: readonly KnowledgePerspective[],
  conceptId: string
): number {
  return perspectives.filter(
    (perspective) => perspective.conceptId === conceptId
  ).length;
}

function countAtomsWithContextualValidity(
  atoms: readonly KnowledgeAtom[]
): number {
  return atoms.filter((atom) => atom.contextualValidity !== undefined).length;
}

function atomHasImplementationMapping(atom: KnowledgeAtom): boolean {
  return "implementationMapping" in atom;
}

/**
 * PAS-004D B51 — validate corpus depth thresholds.
 */
export function validateKnowledgeCorpusDepth(
  atoms: readonly KnowledgeAtom[],
  perspectives: readonly KnowledgePerspective[],
  edges: readonly KnowledgeEdge[]
): readonly string[] {
  const errors: string[] = [];
  const atomById = new Map(atoms.map((atom) => [atom.atomId, atom]));

  for (const conceptId of B51_PERSPECTIVE_CONCEPT_IDS) {
    const count = countPerspectivesForConcept(perspectives, conceptId);
    if (count < B51_MIN_PERSPECTIVES_PER_CONCEPT) {
      errors.push(
        `perspectives.json: concept "${conceptId}" requires ≥${B51_MIN_PERSPECTIVES_PER_CONCEPT} perspectives (found ${count})`
      );
    }
  }

  const contextualValidityCount = countAtomsWithContextualValidity(atoms);
  if (contextualValidityCount < B51_MIN_CONTEXTUAL_VALIDITY_ATOMS) {
    errors.push(
      `atoms.json: requires ≥${B51_MIN_CONTEXTUAL_VALIDITY_ATOMS} atoms with contextualValidity (found ${contextualValidityCount})`
    );
  }

  if (edges.length < B51_MIN_SEMANTIC_EDGES) {
    errors.push(
      `edges.json: requires ≥${B51_MIN_SEMANTIC_EDGES} semantic edges (found ${edges.length})`
    );
  }

  for (const atomId of B51_REALIZATION_REQUIRED_ATOM_IDS) {
    const atom = atomById.get(atomId);
    if (!atom) {
      errors.push(
        `B51 required atom "${atomId}" is missing from parsed corpus`
      );
      continue;
    }

    if (getAtomRealizationMappings(atom).length === 0) {
      errors.push(
        `${atomId}: platform identity / accounting invariant atom requires realizationMapping in parsed public atoms`
      );
    }

    if (atomHasImplementationMapping(atom)) {
      errors.push(
        `${atomId}: implementationMapping must be stripped at loader boundary (B50 public boundary)`
      );
    }
  }

  return errors;
}

export function formatKnowledgeCorpusDepthErrors(
  errors: readonly string[]
): string {
  if (errors.length === 0) {
    return "knowledge-corpus-depth: PASS";
  }

  const lines = ["knowledge-corpus-depth: FAIL"];
  for (const error of errors) {
    lines.push(`  - ${error}`);
  }
  return lines.join("\n");
}
