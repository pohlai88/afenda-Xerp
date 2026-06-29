/**
 * PAS-004D — Domain NS §3.3 epistemic status + §3.5 semantic stability conformance.
 */
import type {
  EpistemicStatus,
  KnowledgeAtom,
  KnowledgeLifecycleStatus,
} from "../contracts/knowledge-atom.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";

const RATIFIED_OR_LATER_LIFECYCLES = [
  "ratified",
  "implemented",
  "superseded",
  "historical",
] as const satisfies readonly KnowledgeLifecycleStatus[];

const ACCEPTED_OR_LATER_LIFECYCLES = [
  "accepted",
  "ratified",
  "implemented",
  "superseded",
  "historical",
] as const satisfies readonly KnowledgeLifecycleStatus[];

function isRatifiedOrLaterLifecycle(
  lifecycle: KnowledgeLifecycleStatus
): boolean {
  return (RATIFIED_OR_LATER_LIFECYCLES as readonly string[]).includes(
    lifecycle
  );
}

function isAcceptedOrLaterLifecycle(
  lifecycle: KnowledgeLifecycleStatus
): boolean {
  return (ACCEPTED_OR_LATER_LIFECYCLES as readonly string[]).includes(
    lifecycle
  );
}

const LIFECYCLE_EPISTEMIC_EXPECTATIONS: Readonly<
  Record<KnowledgeLifecycleStatus, readonly EpistemicStatus[]>
> = {
  observed: ["hypothesis"],
  proposed: ["hypothesis", "candidate"],
  under_review: ["candidate"],
  accepted: ["accepted"],
  ratified: ["accepted"],
  implemented: ["accepted", "superseded"],
  superseded: ["superseded"],
  historical: ["superseded", "rejected"],
};

export function validateAtomEpistemicFacets(
  atom: KnowledgeAtom
): readonly string[] {
  const errors: string[] = [];
  const allowed = LIFECYCLE_EPISTEMIC_EXPECTATIONS[atom.lifecycle];

  if (!allowed.includes(atom.epistemicStatus)) {
    errors.push(
      `${atom.atomId}: epistemicStatus "${atom.epistemicStatus}" incompatible with lifecycle "${atom.lifecycle}"`
    );
  }

  if (
    isRatifiedOrLaterLifecycle(atom.lifecycle) &&
    atom.epistemicStatus !== "accepted"
  ) {
    errors.push(
      `${atom.atomId}: ratified+ lifecycle requires epistemicStatus "accepted"`
    );
  }

  if (
    atom.semanticStability === "experimental" &&
    atom.exposure.audience === "business"
  ) {
    errors.push(
      `${atom.atomId}: experimental semanticStability cannot use business-only exposure audience`
    );
  }

  if (
    atom.semanticStability === "historical" &&
    isAcceptedOrLaterLifecycle(atom.lifecycle) &&
    atom.lifecycle !== "superseded" &&
    atom.lifecycle !== "historical"
  ) {
    errors.push(
      `${atom.atomId}: historical semanticStability requires superseded or historical lifecycle`
    );
  }

  return errors;
}

export function validateKnowledgeEpistemicFacets(): readonly string[] {
  const errors: string[] = [];

  for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
    errors.push(...validateAtomEpistemicFacets(atom));
  }

  return errors;
}
