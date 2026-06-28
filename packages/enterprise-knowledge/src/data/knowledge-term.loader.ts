/**
 * PAS-004C §4.1 — B38: validated terms.json loader.
 */
import type { KnowledgeTerm } from "../contracts/knowledge-term.contract.js";
import { validateTermCorpus } from "./knowledge-data.schema.js";

function formatFirstError(
  errors: readonly { path: string; message: string }[]
): string {
  const first = errors[0];
  if (!first) {
    return "unknown validation error";
  }
  return `${first.path}: ${first.message}`;
}

/** Parse terms.json after structural validation and conceptId cross-reference. */
export function parseTermCorpus(
  raw: unknown,
  conceptIds: ReadonlySet<string>
): readonly KnowledgeTerm[] {
  if (!Array.isArray(raw)) {
    throw new Error("terms.json must be a JSON array");
  }
  const errors = validateTermCorpus(raw, conceptIds);
  if (errors.length > 0) {
    throw new Error(
      `terms.json validation failed — ${formatFirstError(errors)}`
    );
  }
  return raw as readonly KnowledgeTerm[];
}
