/**
 * PAS-004C §4.3 — B43: pure consumer profile projections.
 *
 * `projectKnowledgeAtom` is JSON-serializable at boundaries — no runtime I/O.
 */
import type {
  BindingLevel,
  KnowledgeAtom,
  KnowledgeDomain,
  KnowledgeLineage,
  KnowledgeMisconception,
} from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeConsumerProfile } from "../contracts/knowledge-consumer-profile.contract.js";
import { KNOWLEDGE_CONSUMER_PROFILES } from "../contracts/knowledge-consumer-profile.contract.js";
import type { KnowledgeEvidenceType } from "../contracts/knowledge-evidence.contract.js";
import type { KnowledgeReasoning } from "../contracts/knowledge-reasoning.contract.js";
import { getKnowledgeAtom } from "../policy/knowledge.policy.js";
import { getPreferredTermForConcept } from "../policy/knowledge-concept-vocabulary.policy.js";
import {
  PLATFORM_IDENTITY_ATOM_IDS,
  type PlatformIdentityAtomId,
} from "../policy/knowledge-kernel-identity-mapping.policy.js";

/** Minimum platform identity atoms required by B43 governance gate. */
export const KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS = [
  "tenant",
  "legal_entity",
  "workspace",
] as const satisfies readonly PlatformIdentityAtomId[];

export interface ErpKnowledgeProjection {
  readonly atomId: string;
  readonly binding: BindingLevel;
  readonly canonicalLabel: string;
  readonly shortDescription: string;
}

export interface MetadataKnowledgeProjection {
  readonly atomId: string;
  readonly preferredWording: string | undefined;
  readonly shortLabel: string;
}

export interface DocsKnowledgeProjection {
  readonly atomId: string;
  readonly lineageSummary: string;
  readonly longExplanation: string;
}

export interface AiKnowledgeEvidenceCitationProjection {
  readonly citation?: string;
  readonly evidenceId: string;
  readonly source: string;
  readonly type: KnowledgeEvidenceType;
}

export interface AiKnowledgeProjection {
  readonly atomId: string;
  readonly evidenceCitations: readonly AiKnowledgeEvidenceCitationProjection[];
  readonly examples: readonly string[];
  readonly misconceptions: readonly KnowledgeMisconception[];
  readonly structuredReasoning: KnowledgeReasoning;
}

export interface ReportKnowledgeProjection {
  readonly atomId: string;
  readonly binding: BindingLevel;
  readonly canonicalLabel: string;
  readonly domain: readonly KnowledgeDomain[];
}

export type KnowledgeConsumerProjection =
  | ErpKnowledgeProjection
  | MetadataKnowledgeProjection
  | DocsKnowledgeProjection
  | AiKnowledgeProjection
  | ReportKnowledgeProjection;

function buildLineageSummary(lineage: KnowledgeLineage): string {
  const segments = [lineage.origin];
  if (lineage.evolution.length > 0) {
    segments.push(`Evolution: ${lineage.evolution.join("; ")}`);
  }
  segments.push(`Current authority: ${lineage.currentAuthority}`);
  if (lineage.futureDirection.length > 0) {
    segments.push(`Future: ${lineage.futureDirection}`);
  }
  return segments.join(" · ");
}

function projectErpProfile(atom: KnowledgeAtom): ErpKnowledgeProjection {
  return {
    atomId: atom.atomId,
    canonicalLabel: atom.meaning.canonical,
    shortDescription: atom.meaning.business,
    binding: atom.binding,
  };
}

function projectMetadataProfile(
  atom: KnowledgeAtom
): MetadataKnowledgeProjection {
  const preferredTerm =
    atom.conceptId === undefined
      ? undefined
      : getPreferredTermForConcept(atom.conceptId);

  return {
    atomId: atom.atomId,
    shortLabel: preferredTerm?.label ?? atom.meaning.business,
    preferredWording: atom.exposure.afendaPreferredWording,
  };
}

function projectDocsProfile(atom: KnowledgeAtom): DocsKnowledgeProjection {
  return {
    atomId: atom.atomId,
    longExplanation: atom.meaning.canonical,
    lineageSummary: buildLineageSummary(atom.lineage),
  };
}

function projectAiProfile(atom: KnowledgeAtom): AiKnowledgeProjection {
  return {
    atomId: atom.atomId,
    examples: atom.structuredReasoning.premises,
    misconceptions: atom.misconceptions,
    structuredReasoning: atom.structuredReasoning,
    evidenceCitations: atom.typedEvidence.map((entry) => ({
      evidenceId: entry.evidenceId,
      type: entry.type,
      source: entry.source,
      ...(entry.citation === undefined ? {} : { citation: entry.citation }),
    })),
  };
}

function projectReportProfile(atom: KnowledgeAtom): ReportKnowledgeProjection {
  return {
    atomId: atom.atomId,
    canonicalLabel: atom.meaning.canonical,
    domain: atom.knowledgeDomain,
    binding: atom.binding,
  };
}

const PROFILE_PROJECTORS = {
  erp: projectErpProfile,
  metadata: projectMetadataProfile,
  docs: projectDocsProfile,
  ai: projectAiProfile,
  report: projectReportProfile,
} as const satisfies Record<
  KnowledgeConsumerProfile,
  (atom: KnowledgeAtom) => KnowledgeConsumerProjection
>;

/**
 * Pure projection of a Knowledge Atom for a consumer profile.
 * Returns JSON-serializable facets only — no functions, Dates, or class instances.
 */
export function projectKnowledgeAtom(
  atomId: string,
  profile: "erp"
): ErpKnowledgeProjection;
export function projectKnowledgeAtom(
  atomId: string,
  profile: "metadata"
): MetadataKnowledgeProjection;
export function projectKnowledgeAtom(
  atomId: string,
  profile: "docs"
): DocsKnowledgeProjection;
export function projectKnowledgeAtom(
  atomId: string,
  profile: "ai"
): AiKnowledgeProjection;
export function projectKnowledgeAtom(
  atomId: string,
  profile: "report"
): ReportKnowledgeProjection;
export function projectKnowledgeAtom(
  atomId: string,
  profile: KnowledgeConsumerProfile
): KnowledgeConsumerProjection;
export function projectKnowledgeAtom(
  atomId: string,
  profile: KnowledgeConsumerProfile
): KnowledgeConsumerProjection {
  const atom = getKnowledgeAtom(atomId);
  return PROFILE_PROJECTORS[profile](atom);
}

export function isJsonSerializableProjection(
  value: KnowledgeConsumerProjection
): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function validateKnowledgeConsumerProfiles(): readonly string[] {
  const errors: string[] = [];

  if (KNOWLEDGE_CONSUMER_PROFILES.length !== 5) {
    errors.push(
      `expected 5 consumer profiles, found ${KNOWLEDGE_CONSUMER_PROFILES.length}`
    );
  }

  for (const atomId of KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS) {
    if (!(PLATFORM_IDENTITY_ATOM_IDS as readonly string[]).includes(atomId)) {
      errors.push(`evidence atom "${atomId}" is not a platform identity atom`);
    }
  }

  for (const atomId of KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS) {
    for (const profile of KNOWLEDGE_CONSUMER_PROFILES) {
      let projected: KnowledgeConsumerProjection;
      try {
        projected = projectKnowledgeAtom(atomId, profile);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(
          `projectKnowledgeAtom("${atomId}", "${profile}") threw: ${message}`
        );
        continue;
      }

      if (!isJsonSerializableProjection(projected)) {
        errors.push(
          `projectKnowledgeAtom("${atomId}", "${profile}") is not JSON-serializable`
        );
      }

      if (profile === "ai") {
        if (!("misconceptions" in projected)) {
          errors.push(
            `ai profile for "${atomId}": missing misconceptions facet`
          );
        }
        if (!("structuredReasoning" in projected)) {
          errors.push(
            `ai profile for "${atomId}": missing structuredReasoning facet`
          );
        }
      }
    }
  }

  return errors;
}
