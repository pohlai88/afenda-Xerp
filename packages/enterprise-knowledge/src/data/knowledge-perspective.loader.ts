/**
 * PAS-004C §4.2 — B39: validated perspectives.json loader.
 */
import type { KnowledgePerspective } from "../contracts/knowledge-perspective.contract.js";
import { validatePerspectiveCorpus } from "./knowledge-data.schema.js";

function formatFirstError(
  errors: readonly { path: string; message: string }[]
): string {
  const first = errors[0];
  if (!first) {
    return "unknown validation error";
  }
  return `${first.path}: ${first.message}`;
}

/** Parse perspectives.json after structural and cross-reference validation. */
export function parsePerspectiveCorpus(
  raw: unknown,
  conceptIds: ReadonlySet<string>,
  atomIds: ReadonlySet<string>
): readonly KnowledgePerspective[] {
  if (!Array.isArray(raw)) {
    throw new Error("perspectives.json must be a JSON array");
  }
  const errors = validatePerspectiveCorpus(raw, conceptIds, atomIds);
  if (errors.length > 0) {
    throw new Error(
      `perspectives.json validation failed — ${formatFirstError(errors)}`
    );
  }
  return raw as readonly KnowledgePerspective[];
}
