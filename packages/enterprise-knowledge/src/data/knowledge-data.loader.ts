/**
 * PAS-004A §4.1 — B25: validated JSON corpus loaders.
 *
 * JSON imports widen literals to string. Runtime validation runs first; a single
 * documented trust-boundary assertion narrows to contract types after validation.
 */
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeEdge } from "../contracts/knowledge-edge.contract.js";
import {
  validateAtomCorpus,
  validateEdgeCorpus,
} from "./knowledge-data.schema.js";

function formatFirstError(
  errors: readonly { path: string; message: string }[]
): string {
  const first = errors[0];
  if (!first) {
    return "unknown validation error";
  }
  return `${first.path}: ${first.message}`;
}

/** Parse atoms.json after structural + constitutional validation. */
export function parseAtomCorpus(raw: unknown): readonly KnowledgeAtom[] {
  if (!Array.isArray(raw)) {
    throw new Error("atoms.json must be a JSON array");
  }
  const errors = validateAtomCorpus(raw);
  if (errors.length > 0) {
    throw new Error(
      `atoms.json validation failed — ${formatFirstError(errors)}`
    );
  }
  return raw as readonly KnowledgeAtom[];
}

/** Parse edges.json after structural validation and atomId cross-reference. */
export function parseEdgeCorpus(
  raw: unknown,
  atomIds: ReadonlySet<string>
): readonly KnowledgeEdge[] {
  if (!Array.isArray(raw)) {
    throw new Error("edges.json must be a JSON array");
  }
  const errors = validateEdgeCorpus(raw, atomIds);
  if (errors.length > 0) {
    throw new Error(
      `edges.json validation failed — ${formatFirstError(errors)}`
    );
  }
  return raw as readonly KnowledgeEdge[];
}
