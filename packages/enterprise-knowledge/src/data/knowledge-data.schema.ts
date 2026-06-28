/**
 * PAS-004A §4.1 — B25: pure-TypeScript JSON corpus validation.
 *
 * No external runtime dependencies. Validates atoms.json and edges.json at load
 * time through structural type assertions. For use in check:knowledge-json-authority.
 */
import {
  AUTHORITY_TYPES,
  BINDING_LEVELS,
  KNOWLEDGE_ATOM_KINDS,
  KNOWLEDGE_INTEGRITY_DIMENSIONS,
  KNOWLEDGE_LIFECYCLE_STATUSES,
  type KnowledgeAtom,
} from "../contracts/knowledge-atom.contract.js";
import {
  KNOWLEDGE_EDGE_TYPES,
  type KnowledgeEdge,
} from "../contracts/knowledge-edge.contract.js";
import {
  KNOWLEDGE_EVIDENCE_TYPES,
  type KnowledgeEvidenceType,
} from "../contracts/knowledge-evidence.contract.js";

export interface ValidationError {
  message: string;
  path: string;
}

type JsonRecord = Record<string, unknown>;

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number";
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function isRecord(v: unknown): v is JsonRecord {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function get(obj: JsonRecord, key: string): unknown {
  return obj[key];
}

function validateAtomIdentity(
  raw: JsonRecord,
  base: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  const atomId = get(raw, "atomId");
  if (!isString(atomId) || atomId.length === 0) {
    errors.push({
      path: `${base}.atomId`,
      message: "must be a non-empty string",
    });
  }
  const fqn = get(raw, "fqn");
  if (!(isString(fqn) && fqn.startsWith("afenda."))) {
    errors.push({ path: `${base}.fqn`, message: 'must start with "afenda."' });
  }
  const kind = get(raw, "kind");
  if (!KNOWLEDGE_ATOM_KINDS.includes(kind as KnowledgeAtom["kind"])) {
    errors.push({
      path: `${base}.kind`,
      message: `must be one of ${KNOWLEDGE_ATOM_KINDS.join(", ")}`,
    });
  }
  return errors;
}

function validateAtomAuthority(
  raw: JsonRecord,
  base: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  const chain = get(raw, "acceptanceChain");
  if (!isArray(chain) || chain.length === 0) {
    errors.push({
      path: `${base}.acceptanceChain`,
      message: "must be a non-empty array",
    });
  }
  const authorityType = get(raw, "authorityType");
  if (
    !AUTHORITY_TYPES.includes(authorityType as KnowledgeAtom["authorityType"])
  ) {
    errors.push({
      path: `${base}.authorityType`,
      message: "invalid authorityType",
    });
  }
  const binding = get(raw, "binding");
  if (!BINDING_LEVELS.includes(binding as KnowledgeAtom["binding"])) {
    errors.push({ path: `${base}.binding`, message: "invalid binding" });
  }
  const confidence = get(raw, "confidence");
  if (isRecord(confidence)) {
    const score = get(confidence, "score");
    if (!isNumber(score) || score < 0 || score > 100) {
      errors.push({
        path: `${base}.confidence.score`,
        message: "must be 0–100",
      });
    }
  } else {
    errors.push({
      path: `${base}.confidence`,
      message: "must be an object with score",
    });
  }
  return errors;
}

function validateStructuredReasoning(
  raw: unknown,
  base: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!isRecord(raw)) {
    errors.push({
      path: `${base}.structuredReasoning`,
      message: "must be an object",
    });
    return errors;
  }
  for (const field of ["conclusion", "inference"] as const) {
    const value = get(raw, field);
    if (!isString(value) || value.length === 0) {
      errors.push({
        path: `${base}.structuredReasoning.${field}`,
        message: "must be a non-empty string",
      });
    }
  }
  for (const field of ["premises", "rules"] as const) {
    const value = get(raw, field);
    if (!isArray(value) || value.length === 0) {
      errors.push({
        path: `${base}.structuredReasoning.${field}`,
        message: "must be a non-empty array",
      });
    }
  }
  return errors;
}

function validateTypedEvidence(raw: unknown, base: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!isArray(raw) || raw.length === 0) {
    errors.push({
      path: `${base}.typedEvidence`,
      message: "must be a non-empty array",
    });
    return errors;
  }
  raw.forEach((entry, index) => {
    const path = `${base}.typedEvidence[${index}]`;
    if (!isRecord(entry)) {
      errors.push({ path, message: "must be an object" });
      return;
    }
    const evidenceId = get(entry, "evidenceId");
    if (!isString(evidenceId) || evidenceId.length === 0) {
      errors.push({ path: `${path}.evidenceId`, message: "required" });
    }
    const source = get(entry, "source");
    if (!isString(source) || source.length === 0) {
      errors.push({ path: `${path}.source`, message: "required" });
    }
    const type = get(entry, "type");
    if (!KNOWLEDGE_EVIDENCE_TYPES.includes(type as KnowledgeEvidenceType)) {
      errors.push({ path: `${path}.type`, message: "invalid evidence type" });
    }
  });
  return errors;
}

function validateImplementationMapping(
  raw: unknown,
  base: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (raw === undefined) {
    return errors;
  }
  if (!isRecord(raw)) {
    errors.push({
      path: `${base}.implementationMapping`,
      message: "must be an object when present",
    });
    return errors;
  }
  const contractPath = get(raw, "contractPath");
  if (contractPath !== undefined && !isString(contractPath)) {
    errors.push({
      path: `${base}.implementationMapping.contractPath`,
      message: "must be a string when present",
    });
  }
  const brandedId = get(raw, "brandedId");
  if (brandedId !== undefined && !isString(brandedId)) {
    errors.push({
      path: `${base}.implementationMapping.brandedId`,
      message: "must be a string when present",
    });
  }
  return errors;
}

function validateAtomContent(raw: JsonRecord, base: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if ("reasoning" in raw) {
    errors.push({
      path: `${base}.reasoning`,
      message: "legacy field removed in B29 — use structuredReasoning",
    });
  }
  if ("evidence" in raw) {
    errors.push({
      path: `${base}.evidence`,
      message: "legacy field removed in B29 — use typedEvidence",
    });
  }
  errors.push(
    ...validateStructuredReasoning(get(raw, "structuredReasoning"), base)
  );
  errors.push(...validateTypedEvidence(get(raw, "typedEvidence"), base));
  errors.push(
    ...validateImplementationMapping(get(raw, "implementationMapping"), base)
  );
  const lifecycle = get(raw, "lifecycle");
  if (
    !KNOWLEDGE_LIFECYCLE_STATUSES.includes(
      lifecycle as KnowledgeAtom["lifecycle"]
    )
  ) {
    errors.push({ path: `${base}.lifecycle`, message: "invalid lifecycle" });
  }
  const integrity = get(raw, "integrity");
  if (isRecord(integrity)) {
    for (const dim of KNOWLEDGE_INTEGRITY_DIMENSIONS) {
      if (get(integrity, dim) !== true) {
        errors.push({
          path: `${base}.integrity.${dim}`,
          message: "must be true",
        });
      }
    }
  } else {
    errors.push({ path: `${base}.integrity`, message: "must be an object" });
  }
  if (get(raw, "ownedByPas") !== "PAS-004") {
    errors.push({ path: `${base}.ownedByPas`, message: 'must be "PAS-004"' });
  }
  const decision = get(raw, "knowledgeDecision");
  if (isRecord(decision)) {
    const alts = get(decision, "alternativesConsidered");
    if (!isArray(alts) || alts.length === 0) {
      errors.push({
        path: `${base}.knowledgeDecision.alternativesConsidered`,
        message: "must be non-empty",
      });
    }
  } else {
    errors.push({
      path: `${base}.knowledgeDecision`,
      message: "must be an object",
    });
  }
  return errors;
}

export function validateAtomJson(
  raw: unknown,
  index: number
): readonly ValidationError[] {
  const base = `atoms[${index}]`;
  if (!isRecord(raw)) {
    return [{ path: base, message: "must be an object" }];
  }
  return [
    ...validateAtomIdentity(raw, base),
    ...validateAtomAuthority(raw, base),
    ...validateAtomContent(raw, base),
  ];
}

export function validateEdgeJson(
  raw: unknown,
  index: number
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const base = `edges[${index}]`;

  if (!isRecord(raw)) {
    return [{ path: base, message: "must be an object" }];
  }

  const edgeId = get(raw, "edgeId");
  if (!isString(edgeId) || edgeId.length === 0) {
    errors.push({
      path: `${base}.edgeId`,
      message: "must be a non-empty string",
    });
  }
  const type = get(raw, "type");
  if (!KNOWLEDGE_EDGE_TYPES.includes(type as KnowledgeEdge["type"])) {
    errors.push({
      path: `${base}.type`,
      message: `must be one of ${KNOWLEDGE_EDGE_TYPES.join(", ")}`,
    });
  }
  const fromAtomId = get(raw, "fromAtomId");
  if (!isString(fromAtomId) || fromAtomId.length === 0) {
    errors.push({
      path: `${base}.fromAtomId`,
      message: "must be a non-empty string",
    });
  }
  const toAtomId = get(raw, "toAtomId");
  if (!isString(toAtomId) || toAtomId.length === 0) {
    errors.push({
      path: `${base}.toAtomId`,
      message: "must be a non-empty string",
    });
  }
  return errors;
}

export function validateAtomCorpus(
  atoms: unknown[]
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const seenFqns = new Set<string>();

  for (let i = 0; i < atoms.length; i++) {
    errors.push(...validateAtomJson(atoms[i], i));
    const atom = atoms[i];
    if (isRecord(atom)) {
      const atomId = get(atom, "atomId");
      const fqn = get(atom, "fqn");
      if (isString(atomId)) {
        if (seenIds.has(atomId)) {
          errors.push({
            path: `atoms[${i}].atomId`,
            message: `duplicate atomId: ${atomId}`,
          });
        }
        seenIds.add(atomId);
      }
      if (isString(fqn)) {
        if (seenFqns.has(fqn)) {
          errors.push({
            path: `atoms[${i}].fqn`,
            message: `duplicate fqn: ${fqn}`,
          });
        }
        seenFqns.add(fqn);
      }
    }
  }
  return errors;
}

export function validateEdgeCorpus(
  edges: unknown[],
  atomIds: ReadonlySet<string>
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const seenEdgeIds = new Set<string>();

  for (let i = 0; i < edges.length; i++) {
    errors.push(...validateEdgeJson(edges[i], i));
    const edge = edges[i];
    if (isRecord(edge)) {
      const edgeId = get(edge, "edgeId");
      const fromAtomId = get(edge, "fromAtomId");
      const toAtomId = get(edge, "toAtomId");
      if (isString(edgeId)) {
        if (seenEdgeIds.has(edgeId)) {
          errors.push({
            path: `edges[${i}].edgeId`,
            message: `duplicate edgeId: ${edgeId}`,
          });
        }
        seenEdgeIds.add(edgeId);
      }
      if (isString(fromAtomId) && !atomIds.has(fromAtomId)) {
        errors.push({
          path: `edges[${i}].fromAtomId`,
          message: `unknown atomId: ${fromAtomId}`,
        });
      }
      if (isString(toAtomId) && !atomIds.has(toAtomId)) {
        errors.push({
          path: `edges[${i}].toAtomId`,
          message: `unknown atomId: ${toAtomId}`,
        });
      }
    }
  }
  return errors;
}
