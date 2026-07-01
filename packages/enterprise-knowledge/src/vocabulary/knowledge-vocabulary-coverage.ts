/**
 * PAS-004E — module + surface vocabulary coverage validation (package-pure).
 */
import type {
  VocabularyAllowlist,
  VocabularyCoverageFailCode,
} from "./knowledge-vocabulary-export.js";
import {
  findAllowlistEntryByConceptId,
  findAllowlistEntryByTermId,
  tokenizeVocabularyText,
} from "./knowledge-vocabulary-export.js";

export type ModuleKnowledgeTermCoverageStatus =
  | "accepted"
  | "ambiguous"
  | "deferred"
  | "missing"
  | "proposed"
  | "wire_only";

export interface ModuleKnowledgeTermCoverageInput {
  readonly appliesTo?: readonly string[];
  readonly atomId?: string;
  readonly conceptId?: string;
  readonly status: ModuleKnowledgeTermCoverageStatus;
  readonly term: string;
  readonly termId?: string;
  readonly wireArtifact?: string;
}

export interface ModuleKnowledgeMapCoverageInput {
  readonly module: string;
  readonly terms: readonly ModuleKnowledgeTermCoverageInput[];
}

export interface VocabularyCoverageViolation {
  readonly code: VocabularyCoverageFailCode;
  readonly file: string;
  readonly line?: number;
  readonly message: string;
  readonly severity: "error" | "warning";
}

function resolveAllowlistEntry(
  allowlist: VocabularyAllowlist,
  term: ModuleKnowledgeTermCoverageInput
) {
  if (term.conceptId) {
    return findAllowlistEntryByConceptId(allowlist, term.conceptId);
  }
  if (term.termId) {
    return findAllowlistEntryByTermId(allowlist, term.termId);
  }
  return findAllowlistEntryByConceptId(allowlist, term.term);
}

function validateAcceptedTerm(
  knowledgeMap: ModuleKnowledgeMapCoverageInput,
  term: ModuleKnowledgeTermCoverageInput,
  entry: ReturnType<typeof resolveAllowlistEntry>
): readonly VocabularyCoverageViolation[] {
  const violations: VocabularyCoverageViolation[] = [];

  if (!term.atomId) {
    violations.push({
      code: "REGISTERED_TERM_WITHOUT_ACCEPTED_ATOM",
      file: knowledgeMap.module,
      message: `accepted term "${term.term}" is missing atomId`,
      severity: "error",
    });
    return violations;
  }

  if (entry && entry.state !== "accepted") {
    violations.push({
      code: "REGISTERED_TERM_WITHOUT_ACCEPTED_ATOM",
      file: knowledgeMap.module,
      message: `term "${term.term}" is accepted in module map but corpus state is "${entry.state}"`,
      severity: "error",
    });
  }

  return violations;
}

export function validateModuleKnowledgeTerms(
  allowlist: VocabularyAllowlist,
  knowledgeMap: ModuleKnowledgeMapCoverageInput
): readonly VocabularyCoverageViolation[] {
  const violations: VocabularyCoverageViolation[] = [];

  for (const term of knowledgeMap.terms) {
    const entry = resolveAllowlistEntry(allowlist, term);

    if (
      term.appliesTo &&
      term.appliesTo.length > 0 &&
      !term.appliesTo.includes(knowledgeMap.module)
    ) {
      violations.push({
        code: "TERM_USED_OUTSIDE_APPLICABLE_MODULE",
        file: knowledgeMap.module,
        message: `term "${term.term}" appliesTo [${term.appliesTo.join(", ")}] but declared in module "${knowledgeMap.module}"`,
        severity: "error",
      });
    }

    switch (term.status) {
      case "accepted": {
        violations.push(...validateAcceptedTerm(knowledgeMap, term, entry));
        break;
      }
      case "wire_only": {
        if (!term.wireArtifact) {
          violations.push({
            code: "REGISTERED_TERM_WITHOUT_ACCEPTED_ATOM",
            file: knowledgeMap.module,
            message: `wire_only term "${term.term}" is missing wireArtifact`,
            severity: "warning",
          });
        }
        break;
      }
      case "missing": {
        if (!entry) {
          violations.push({
            code: "UNREGISTERED_TERM_IN_USER_FACING_SURFACE",
            file: knowledgeMap.module,
            message: `missing term "${term.term}" has no registry entry — add to terms.json or promote status`,
            severity: "warning",
          });
        }
        break;
      }
      case "proposed":
      case "ambiguous":
      case "deferred": {
        break;
      }
      default: {
        const unreachable: never = term.status;
        throw new Error(`unsupported knowledge status: ${unreachable}`);
      }
    }
  }

  return violations;
}

const SURFACE_PROP_PATTERN =
  /\b(label|title|description|placeholder|aria-label|emptyState)\s*[:=]\s*["']([^"']{3,})["']/;

function isRegisteredSurfaceLabel(
  allowlist: VocabularyAllowlist,
  value: string
): boolean {
  const normalized = value.toLowerCase();
  const normalizedTokens = tokenizeVocabularyText(value);

  for (const entry of allowlist.entries) {
    if (entry.labels.some((label) => label.toLowerCase() === normalized)) {
      return true;
    }

    if (
      normalizedTokens.length > 0 &&
      normalizedTokens.every((token) =>
        entry.labels.some((label) =>
          tokenizeVocabularyText(label).includes(token)
        )
      )
    ) {
      return true;
    }
  }

  return false;
}

export function extractSurfaceStrings(
  source: string
): readonly { readonly line: number; readonly value: string }[] {
  const matches: { line: number; value: string }[] = [];
  const lines = source.split("\n");

  for (const [lineIndex, line] of lines.entries()) {
    const pattern = new RegExp(SURFACE_PROP_PATTERN.source, "g");
    for (const match of line.matchAll(pattern)) {
      const value = match[2]?.trim();
      if (value) {
        matches.push({ line: lineIndex + 1, value });
      }
    }
  }

  return matches;
}

function isGovernedSurfaceLabelCandidate(value: string): boolean {
  if (/^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/.test(value)) {
    return true;
  }

  return /^[A-Z][a-z]{2,}$/.test(value);
}

export function validateSurfaceStrings(
  allowlist: VocabularyAllowlist,
  file: string,
  source: string
): readonly VocabularyCoverageViolation[] {
  const violations: VocabularyCoverageViolation[] = [];

  for (const { line, value } of extractSurfaceStrings(source)) {
    if (isRegisteredSurfaceLabel(allowlist, value)) {
      continue;
    }

    if (isGovernedSurfaceLabelCandidate(value)) {
      violations.push({
        code: "UNREGISTERED_TERM_IN_USER_FACING_SURFACE",
        file,
        line,
        message: `unregistered user-facing label "${value}"`,
        severity: "error",
      });
    }
  }

  return violations;
}

export function formatVocabularyCoverageViolations(
  violations: readonly VocabularyCoverageViolation[]
): string {
  if (violations.length === 0) {
    return "✓ check:code-vocabulary-coverage passed";
  }

  return violations
    .map(
      (violation) =>
        `[${violation.severity.toUpperCase()}] ${violation.code}: ${violation.message} (${violation.file}${violation.line ? `:${violation.line}` : ""})`
    )
    .join("\n");
}

export function hasVocabularyCoverageErrors(
  violations: readonly VocabularyCoverageViolation[]
): boolean {
  return violations.some((violation) => violation.severity === "error");
}
