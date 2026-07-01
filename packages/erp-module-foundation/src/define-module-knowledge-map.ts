import type {
  KnowledgeStatus,
  ModuleKnowledgeMapDefinition,
  ModuleKnowledgeTerm,
} from "./erp-module-foundation.types.js";
import { KNOWLEDGE_STATUSES } from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleKnowledgeMapInput {
  readonly kvId: string;
  readonly module: string;
  readonly terms: readonly ModuleKnowledgeTerm[];
}

function assertKnowledgeStatus(status: KnowledgeStatus): void {
  if (!KNOWLEDGE_STATUSES.includes(status)) {
    throw new Error(`invalid knowledge status: "${status}"`);
  }
}

export function defineModuleKnowledgeMap(
  input: DefineModuleKnowledgeMapInput
): ModuleKnowledgeMapDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.terms.length === 0) {
    throw new Error("defineModuleKnowledgeMap: terms must not be empty");
  }

  assertUniqueStrings(
    input.terms.map((term) => term.term),
    "knowledge term"
  );

  const terms = input.terms.map((entry) => {
    assertNonEmptyString(entry.term, "term");
    assertKnowledgeStatus(entry.status);
    assertNonEmptyString(entry.requiredAction, "requiredAction");
    return {
      term: entry.term,
      status: entry.status,
      requiredAction: entry.requiredAction,
      ...(entry.atomId ? { atomId: entry.atomId } : {}),
      ...(entry.wireArtifact ? { wireArtifact: entry.wireArtifact } : {}),
      ...(entry.conceptId ? { conceptId: entry.conceptId } : {}),
      ...(entry.termId ? { termId: entry.termId } : {}),
      ...(entry.appliesTo && entry.appliesTo.length > 0
        ? { appliesTo: entry.appliesTo }
        : {}),
    } satisfies ModuleKnowledgeTerm;
  });

  return {
    module: input.module,
    kvId: input.kvId,
    terms,
  } as const;
}
