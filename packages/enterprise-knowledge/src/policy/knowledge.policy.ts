import type {
  KnowledgeAtom,
  KnowledgeIntegrityProfile,
  KnowledgeLifecycleStatus,
  KnowledgeRelationship,
  KnowledgeRelationshipType,
} from "../contracts/knowledge-atom.contract.js";
import { KNOWLEDGE_RELATIONSHIP_TYPES } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeEdge } from "../contracts/knowledge-edge.contract.js";
import { isResolvableAcceptingAuthorityRef } from "../data/accepting-authority.registry.js";
import {
  ENTERPRISE_KNOWLEDGE_ATOMS,
  KNOWLEDGE_ATOM_IDS,
} from "../data/knowledge.registry.js";
import { KNOWLEDGE_EDGES } from "../data/knowledge-edge.registry.js";
import { validateAtomEpistemicFacets } from "./knowledge-epistemic.policy.js";

const ACCEPTED_OR_LATER: readonly KnowledgeLifecycleStatus[] = [
  "accepted",
  "ratified",
  "implemented",
];

const RATIFIED_OR_LATER: readonly KnowledgeLifecycleStatus[] = [
  "ratified",
  "implemented",
];

function isKnowledgeRelationshipType(
  value: string
): value is KnowledgeRelationshipType {
  return (KNOWLEDGE_RELATIONSHIP_TYPES as readonly string[]).includes(value);
}

function edgeToLegacyRelationship(
  edge: KnowledgeEdge
): KnowledgeRelationship | null {
  if (!isKnowledgeRelationshipType(edge.type)) {
    return null;
  }
  return {
    relationshipId: edge.edgeId,
    type: edge.type,
    fromAtomId: edge.fromAtomId,
    toAtomId: edge.toAtomId,
    ...(edge.note === undefined ? {} : { note: edge.note }),
  };
}

/**
 * @deprecated B50 — derived from KNOWLEDGE_EDGES. Use getKnowledgeEdgesForAtom for new code.
 */
export const KNOWLEDGE_RELATIONSHIPS: readonly KnowledgeRelationship[] =
  KNOWLEDGE_EDGES.flatMap((edge) => {
    const relationship = edgeToLegacyRelationship(edge);
    return relationship ? [relationship] : [];
  });

export function isKnowledgeAtomId(
  value: string
): value is KnowledgeAtom["atomId"] {
  return (KNOWLEDGE_ATOM_IDS as readonly string[]).includes(value);
}

export function getKnowledgeAtom(
  atomId: KnowledgeAtom["atomId"]
): KnowledgeAtom {
  const atom = ENTERPRISE_KNOWLEDGE_ATOMS.find(
    (candidate) => candidate.atomId === atomId
  );
  if (!atom) {
    throw new Error(`Unknown knowledge atom: ${atomId}`);
  }
  return atom;
}

/** Returns edges (new vocabulary) connected to an atom. */
export function getKnowledgeEdgesForAtom(
  atomId: string
): readonly KnowledgeEdge[] {
  return KNOWLEDGE_EDGES.filter(
    (edge) => edge.fromAtomId === atomId || edge.toAtomId === atomId
  );
}

/**
 * @deprecated Use getKnowledgeEdgesForAtom for new code.
 * Retained for B24 consumer backward compatibility.
 */
export function getKnowledgeRelationshipsForAtom(
  atomId: string
): readonly KnowledgeRelationship[] {
  return getKnowledgeEdgesForAtom(atomId).flatMap((edge) => {
    const relationship = edgeToLegacyRelationship(edge);
    return relationship ? [relationship] : [];
  });
}

export function isAcceptedOrLaterLifecycle(
  lifecycle: KnowledgeLifecycleStatus
): boolean {
  return ACCEPTED_OR_LATER.includes(lifecycle);
}

export function isRatifiedOrLaterLifecycle(
  lifecycle: KnowledgeLifecycleStatus
): boolean {
  return RATIFIED_OR_LATER.includes(lifecycle);
}

export function validateKnowledgeAtom(atom: KnowledgeAtom): readonly string[] {
  const errors: string[] = [];

  if (atom.acceptanceChain.length === 0) {
    errors.push(`${atom.atomId}: acceptanceChain must not be empty`);
  }

  if (
    isAcceptedOrLaterLifecycle(atom.lifecycle) &&
    atom.acceptanceChain.length < 2
  ) {
    errors.push(
      `${atom.atomId}: accepted+ lifecycle requires a multi-step acceptance chain`
    );
  }

  if (atom.knowledgeDecision.alternativesConsidered.length === 0) {
    errors.push(
      `${atom.atomId}: knowledgeDecision.alternativesConsidered must not be empty`
    );
  }

  if (atom.confidence.score < 0 || atom.confidence.score > 100) {
    errors.push(`${atom.atomId}: confidence.score must be 0–100`);
  }

  if (atom.knowledgeDomain.length === 0) {
    errors.push(`${atom.atomId}: knowledgeDomain must not be empty`);
  }

  if (
    atom.kind === "vocabulary" &&
    atom.exposure.audience === "business" &&
    atom.exposure.afendaPreferredWording.length === 0
  ) {
    errors.push(
      `${atom.atomId}: vocabulary atoms exposed to business require preferred wording`
    );
  }

  for (const dimension of Object.keys(atom.integrity)) {
    if (atom.integrity[dimension as keyof KnowledgeIntegrityProfile] !== true) {
      errors.push(
        `${atom.atomId}: integrity.${dimension} must be true in MVP registry`
      );
    }
  }

  if (atom.typedEvidence.length === 0) {
    errors.push(`${atom.atomId}: typedEvidence must not be empty`);
  }

  if (atom.structuredReasoning.conclusion.length === 0) {
    errors.push(
      `${atom.atomId}: structuredReasoning.conclusion must not be empty`
    );
  }

  if (atom.structuredReasoning.premises.length === 0) {
    errors.push(
      `${atom.atomId}: structuredReasoning.premises must not be empty`
    );
  }

  for (const entry of atom.acceptanceChain) {
    if (!isResolvableAcceptingAuthorityRef(entry.by)) {
      errors.push(
        `${atom.atomId}: acceptanceChain references unknown authority "${entry.by}"`
      );
    }
  }

  errors.push(...validateAtomEpistemicFacets(atom));

  return errors;
}

export function validateKnowledgeRegistry(): readonly string[] {
  const errors: string[] = [];
  const atomIds = new Set<string>();
  const fqns = new Set<string>();

  for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
    if (atomIds.has(atom.atomId)) {
      errors.push(`duplicate atomId: ${atom.atomId}`);
    }
    atomIds.add(atom.atomId);

    if (fqns.has(atom.fqn)) {
      errors.push(`duplicate fqn: ${atom.fqn}`);
    }
    fqns.add(atom.fqn);

    errors.push(...validateKnowledgeAtom(atom));
  }

  for (const edge of KNOWLEDGE_EDGES) {
    if (!atomIds.has(edge.fromAtomId)) {
      errors.push(
        `edge ${edge.edgeId}: unknown fromAtomId "${edge.fromAtomId}"`
      );
    }
    if (!atomIds.has(edge.toAtomId)) {
      errors.push(`edge ${edge.edgeId}: unknown toAtomId "${edge.toAtomId}"`);
    }
  }

  return errors;
}
