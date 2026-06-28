/**
 * PAS-004C §4.1 — B38: validated concepts.json loader.
 */
import type { KnowledgeConcept } from "../contracts/knowledge-concept.contract.js";
import { validateConceptCorpus } from "./knowledge-data.schema.js";

function formatFirstError(
  errors: readonly { path: string; message: string }[]
): string {
  const first = errors[0];
  if (!first) {
    return "unknown validation error";
  }
  return `${first.path}: ${first.message}`;
}

/** Parse concepts.json after structural validation. */
export function parseConceptCorpus(raw: unknown): readonly KnowledgeConcept[] {
  if (!Array.isArray(raw)) {
    throw new Error("concepts.json must be a JSON array");
  }
  const errors = validateConceptCorpus(raw);
  if (errors.length > 0) {
    throw new Error(
      `concepts.json validation failed — ${formatFirstError(errors)}`
    );
  }
  return raw as readonly KnowledgeConcept[];
}
