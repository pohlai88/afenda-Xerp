/**
 * PAS-004C §4.6 — B41: accepted vs applicable contextual validity policy.
 */
import type {
  Confidence,
  ContextualValidity,
  KnowledgeAtom,
} from "../contracts/knowledge-atom.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";

/** Framework bases that can coexist yet disagree — both present ⇒ contextualValidity required. */
export const CONFLICTING_FRAMEWORK_BASES = ["IFRS", "GAAP"] as const;

export type ConflictingFrameworkBasis =
  (typeof CONFLICTING_FRAMEWORK_BASES)[number];

/** Atom IDs that must document applicableIn / notApplicableIn (B41 gate evidence). */
export const CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS = ["ifrs_10"] as const;

export function hasConflictingFrameworkBasis(confidence: Confidence): boolean {
  const basis = new Set(confidence.basis);
  return CONFLICTING_FRAMEWORK_BASES.every((framework) => basis.has(framework));
}

export function requiresContextualValidity(atom: KnowledgeAtom): boolean {
  return hasConflictingFrameworkBasis(atom.confidence);
}

export function validateAtomContextualValidity(
  atom: KnowledgeAtom
): readonly string[] {
  const errors: string[] = [];
  const { contextualValidity } = atom;

  if (requiresContextualValidity(atom) && !contextualValidity) {
    errors.push(
      `atom "${atom.atomId}": contextualValidity required when confidence.basis includes IFRS and GAAP`
    );
    return errors;
  }

  if (!contextualValidity) {
    return errors;
  }

  errors.push(
    ...validateContextualValidityShape(atom.atomId, contextualValidity)
  );

  if (
    CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS.includes(
      atom.atomId as (typeof CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS)[number]
    )
  ) {
    if (contextualValidity.applicableIn.length === 0) {
      errors.push(
        `atom "${atom.atomId}": contextualValidity.applicableIn must be non-empty`
      );
    }
    if (contextualValidity.notApplicableIn.length === 0) {
      errors.push(
        `atom "${atom.atomId}": contextualValidity.notApplicableIn must be non-empty`
      );
    }
  }

  return errors;
}

function validateContextualValidityShape(
  atomId: string,
  contextualValidity: ContextualValidity
): string[] {
  const errors: string[] = [];

  if (contextualValidity.accepted !== true) {
    errors.push(
      `atom "${atomId}": contextualValidity.accepted must be true when present`
    );
  }

  if (!Array.isArray(contextualValidity.applicableIn)) {
    errors.push(
      `atom "${atomId}": contextualValidity.applicableIn must be an array`
    );
  } else if (
    contextualValidity.applicableIn.some(
      (scope) => typeof scope !== "string" || scope.trim().length === 0
    )
  ) {
    errors.push(
      `atom "${atomId}": contextualValidity.applicableIn entries must be non-empty strings`
    );
  }

  if (!Array.isArray(contextualValidity.notApplicableIn)) {
    errors.push(
      `atom "${atomId}": contextualValidity.notApplicableIn must be an array`
    );
  } else if (
    contextualValidity.notApplicableIn.some(
      (scope) => typeof scope !== "string" || scope.trim().length === 0
    )
  ) {
    errors.push(
      `atom "${atomId}": contextualValidity.notApplicableIn entries must be non-empty strings`
    );
  }

  if (contextualValidity.conflictingWith !== undefined) {
    if (!Array.isArray(contextualValidity.conflictingWith)) {
      errors.push(
        `atom "${atomId}": contextualValidity.conflictingWith must be an array when present`
      );
    } else if (
      contextualValidity.conflictingWith.some(
        (ref) => typeof ref !== "string" || ref.trim().length === 0
      )
    ) {
      errors.push(
        `atom "${atomId}": contextualValidity.conflictingWith entries must be non-empty strings`
      );
    }
  }

  return errors;
}

/** Validates contextual validity across the full atom corpus. */
export function validateContextualValidity(): readonly string[] {
  const errors: string[] = [];

  for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
    errors.push(...validateAtomContextualValidity(atom));
  }

  for (const atomId of CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS) {
    const atom = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (entry) => entry.atomId === atomId
    );
    if (!atom) {
      errors.push(
        `registry: evidence atom "${atomId}" not found in atoms.json`
      );
      continue;
    }
    if (!atom.contextualValidity) {
      errors.push(
        `atom "${atomId}": contextualValidity required for B41 evidence atom`
      );
    }
  }

  return errors;
}
