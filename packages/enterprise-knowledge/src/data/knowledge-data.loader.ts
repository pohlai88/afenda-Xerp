/**
 * PAS-004A §4.1 — B25: validated JSON corpus loaders.
 * PAS-004C §4.4 — B44: normalize implementationMapping → realizationMapping.
 *
 * JSON imports widen literals to string. Runtime validation runs first; a single
 * documented trust-boundary assertion narrows to contract types after validation.
 */
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeEdge } from "../contracts/knowledge-edge.contract.js";
import type { KnowledgeRealizationMapping } from "../contracts/knowledge-realization.contract.js";
import {
  validateAtomCorpus,
  validateEdgeCorpus,
} from "./knowledge-data.schema.js";

type JsonRecord = Record<string, unknown>;

function isRecord(v: unknown): v is JsonRecord {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function deriveRealizationFromLegacyRecord(
  legacy: JsonRecord
): readonly KnowledgeRealizationMapping[] {
  const derived: KnowledgeRealizationMapping[] = [];
  const contractPath = legacy["contractPath"];
  const brandedId = legacy["brandedId"];
  if (typeof contractPath === "string" && contractPath.length > 0) {
    derived.push({
      realizationKind: "kernel",
      reference: contractPath,
      contractPath,
      ...(typeof brandedId === "string" ? { brandedId } : {}),
      notes: "normalized from implementationMapping.contractPath",
    });
  }
  const databaseTable = legacy["databaseTable"];
  if (typeof databaseTable === "string" && databaseTable.length > 0) {
    derived.push({
      realizationKind: "schema",
      reference: databaseTable,
      notes: "normalized from implementationMapping.databaseTable",
    });
  }
  const upstreamContract = legacy["upstreamContract"];
  if (typeof upstreamContract === "string" && upstreamContract.length > 0) {
    derived.push({
      realizationKind: "contract",
      reference: upstreamContract,
      notes: "normalized from implementationMapping.upstreamContract",
    });
  }
  return derived;
}

/** B44 — merge explicit realizationMapping with legacy implementationMapping alias. */
export function normalizeAtomRealization(raw: JsonRecord): JsonRecord {
  const explicit = raw["realizationMapping"];
  if (isArray(explicit) && explicit.length > 0) {
    return raw;
  }

  const legacy = raw["implementationMapping"];
  if (!isRecord(legacy)) {
    return raw;
  }

  const derived = deriveRealizationFromLegacyRecord(legacy);
  if (derived.length === 0) {
    return raw;
  }

  return {
    ...raw,
    realizationMapping: derived,
  };
}

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

  const normalized = raw.map((entry) =>
    isRecord(entry) ? normalizeAtomRealization(entry) : entry
  );

  const errors = validateAtomCorpus(normalized);
  if (errors.length > 0) {
    throw new Error(
      `atoms.json validation failed — ${formatFirstError(errors)}`
    );
  }
  return normalized as readonly KnowledgeAtom[];
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
