/**
 * PAS-004E — derived vocabulary export (read-only artifacts for IDE + CI).
 * SSOT remains concepts.json / terms.json / atoms.json.
 */
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeConcept } from "../contracts/knowledge-concept.contract.js";
import type { KnowledgeTerm } from "../contracts/knowledge-term.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  ENTERPRISE_KNOWLEDGE_CONCEPTS,
  ENTERPRISE_KNOWLEDGE_TERMS,
} from "../policy/knowledge-concept-vocabulary.policy.js";

export const VOCABULARY_ALLOWLIST_VERSION = 1 as const;

export type VocabularyAdmissionState = "registered" | "accepted";
/** Module-map `wire_only` is enforced in erp-module-foundation — not corpus export state. */

export interface VocabularyAllowlistEntry {
  readonly atomId: string | null;
  readonly conceptId: string;
  readonly labels: readonly string[];
  readonly state: VocabularyAdmissionState;
  readonly termId: string;
}

export interface VocabularyAllowlist {
  readonly entries: readonly VocabularyAllowlistEntry[];
  readonly fingerprint: string;
  readonly generatedAt: string;
  readonly tokens: readonly string[];
  readonly version: typeof VOCABULARY_ALLOWLIST_VERSION;
}

export interface VocabularyCoverageSchema {
  readonly failCodes: readonly VocabularyCoverageFailCode[];
  readonly scanPaths: readonly string[];
  readonly surfaceKeys: readonly string[];
  readonly version: 1;
}

export type VocabularyCoverageFailCode =
  | "UNREGISTERED_TERM_IN_USER_FACING_SURFACE"
  | "REGISTERED_TERM_WITHOUT_ACCEPTED_ATOM"
  | "RETIRED_TERM_USED"
  | "TERM_USED_OUTSIDE_APPLICABLE_MODULE";

const ENGLISH_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "it",
  "not",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export function splitIdentifierTokens(value: string): readonly string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 1);
}

export function tokenizeVocabularyText(value: string): readonly string[] {
  const parts = value
    .split(/[^A-Za-z0-9]+/)
    .flatMap((part) => splitIdentifierTokens(part))
    .filter((part) => part.length > 1 && !ENGLISH_STOPWORDS.has(part));

  return [...new Set(parts)].sort();
}

function acceptedAtomIdsByConcept(
  atoms: readonly KnowledgeAtom[]
): ReadonlyMap<string, string> {
  const map = new Map<string, string>();
  for (const atom of atoms) {
    if (!atom.conceptId) {
      continue;
    }
    map.set(atom.conceptId, atom.atomId);
  }
  return map;
}

function buildEntry(
  term: KnowledgeTerm,
  concept: KnowledgeConcept | undefined,
  acceptedByConcept: ReadonlyMap<string, string>
): VocabularyAllowlistEntry {
  const atomId = acceptedByConcept.get(term.conceptId) ?? null;
  const labels = [
    term.label,
    concept?.label ?? "",
    concept?.conceptId ?? "",
    term.termId,
  ].filter((label) => label.length > 0);

  return {
    termId: term.termId,
    conceptId: term.conceptId,
    atomId,
    labels,
    state: atomId ? "accepted" : "registered",
  };
}

export function buildVocabularyAllowlist(input?: {
  readonly concepts?: readonly KnowledgeConcept[];
  readonly terms?: readonly KnowledgeTerm[];
  readonly atoms?: readonly KnowledgeAtom[];
  readonly generatedAt?: string;
}): VocabularyAllowlist {
  const concepts = input?.concepts ?? ENTERPRISE_KNOWLEDGE_CONCEPTS;
  const terms = input?.terms ?? ENTERPRISE_KNOWLEDGE_TERMS;
  const atoms = input?.atoms ?? ENTERPRISE_KNOWLEDGE_ATOMS;
  const conceptById = new Map(
    concepts.map((concept) => [concept.conceptId, concept] as const)
  );
  const acceptedByConcept = acceptedAtomIdsByConcept(atoms);

  const entries = terms
    .map((term) =>
      buildEntry(term, conceptById.get(term.conceptId), acceptedByConcept)
    )
    .sort((left, right) => left.termId.localeCompare(right.termId));

  const tokens = [
    ...new Set(
      entries.flatMap((entry) => [
        ...tokenizeVocabularyText(entry.termId),
        ...tokenizeVocabularyText(entry.conceptId),
        ...(entry.atomId ? tokenizeVocabularyText(entry.atomId) : []),
        ...entry.labels.flatMap((label) => tokenizeVocabularyText(label)),
      ])
    ),
  ].sort();

  const fingerprint = `vocabulary-${entries.length}-${tokens.length}-${entries.filter((entry) => entry.state === "accepted").length}`;

  return {
    version: VOCABULARY_ALLOWLIST_VERSION,
    generatedAt: input?.generatedAt ?? new Date().toISOString(),
    fingerprint,
    entries,
    tokens,
  };
}

export function buildCspellEnterpriseDictionary(
  allowlist: VocabularyAllowlist
): string {
  const header = [
    "# AUTO-GENERATED FILE — DO NOT EDIT",
    "# Source: packages/enterprise-knowledge/src/data/terms.json",
    "# Source: packages/enterprise-knowledge/src/data/concepts.json",
    "# Generated by: pnpm export:knowledge-vocabulary",
    "",
  ].join("\n");

  const words = [
    ...new Set([
      ...allowlist.entries.flatMap((entry) => [
        entry.termId,
        entry.conceptId,
        ...(entry.atomId ? [entry.atomId] : []),
      ]),
      ...allowlist.tokens,
    ]),
  ].sort();

  return `${header}${words.join("\n")}\n`;
}

export function buildVocabularyCoverageSchema(): VocabularyCoverageSchema {
  return {
    version: 1,
    scanPaths: [
      "apps/erp/src/**",
      "packages/features/**",
      "packages/shadcn-studio/src/components/**",
    ],
    surfaceKeys: [
      "label",
      "title",
      "description",
      "aria-label",
      "placeholder",
      "emptyState",
    ],
    failCodes: [
      "UNREGISTERED_TERM_IN_USER_FACING_SURFACE",
      "REGISTERED_TERM_WITHOUT_ACCEPTED_ATOM",
      "RETIRED_TERM_USED",
      "TERM_USED_OUTSIDE_APPLICABLE_MODULE",
    ],
  };
}

export function findAllowlistEntryByConceptId(
  allowlist: VocabularyAllowlist,
  conceptId: string
): VocabularyAllowlistEntry | undefined {
  return allowlist.entries.find((entry) => entry.conceptId === conceptId);
}

export function findAllowlistEntryByTermId(
  allowlist: VocabularyAllowlist,
  termId: string
): VocabularyAllowlistEntry | undefined {
  return allowlist.entries.find((entry) => entry.termId === termId);
}
