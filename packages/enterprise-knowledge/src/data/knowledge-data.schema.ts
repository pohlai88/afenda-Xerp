/**
 * PAS-004A §4.1 — B25: pure-TypeScript JSON corpus validation.
 *
 * No external runtime dependencies. Validates atoms.json and edges.json at load
 * time through structural type assertions. For use in check:knowledge-json-authority.
 */
import {
  AUTHORITY_TYPES,
  BINDING_LEVELS,
  EPISTEMIC_STATUSES,
  KNOWLEDGE_ATOM_KINDS,
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_INTEGRITY_DIMENSIONS,
  KNOWLEDGE_LIFECYCLE_STATUSES,
  type KnowledgeAtom,
  type KnowledgeDomain,
  SEMANTIC_STABILITY_LEVELS,
} from "../contracts/knowledge-atom.contract.js";
import { KNOWLEDGE_CONCEPT_OWNED_BY_PAS } from "../contracts/knowledge-concept.contract.js";
import {
  isSemanticEdgeType,
  KNOWLEDGE_EDGE_TYPES,
  type KnowledgeEdge,
  type KnowledgeEdgeType,
} from "../contracts/knowledge-edge.contract.js";
import {
  KNOWLEDGE_EVIDENCE_TYPES,
  type KnowledgeEvidenceType,
} from "../contracts/knowledge-evidence.contract.js";
import {
  KNOWLEDGE_DOMAIN_CLASSES,
  KNOWLEDGE_PERSPECTIVE_OWNED_BY_PAS,
  type KnowledgeDomainClass,
} from "../contracts/knowledge-perspective.contract.js";
import {
  REALIZATION_KINDS,
  type RealizationKind,
} from "../contracts/knowledge-realization.contract.js";

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
  const conceptId = get(raw, "conceptId");
  if (
    conceptId !== undefined &&
    (!isString(conceptId) || conceptId.length === 0)
  ) {
    errors.push({
      path: `${base}.conceptId`,
      message: "must be a non-empty string when present",
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

function validateRealizationMapping(
  raw: unknown,
  base: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (raw === undefined) {
    return errors;
  }
  if (!isArray(raw)) {
    errors.push({
      path: `${base}.realizationMapping`,
      message: "must be an array when present",
    });
    return errors;
  }
  raw.forEach((entry, index) => {
    const path = `${base}.realizationMapping[${index}]`;
    if (!isRecord(entry)) {
      errors.push({ path, message: "must be an object" });
      return;
    }
    const realizationKind = get(entry, "realizationKind");
    if (!REALIZATION_KINDS.includes(realizationKind as RealizationKind)) {
      errors.push({
        path: `${path}.realizationKind`,
        message: `must be one of ${REALIZATION_KINDS.join(", ")}`,
      });
    }
    const reference = get(entry, "reference");
    if (!isString(reference) || reference.length === 0) {
      errors.push({
        path: `${path}.reference`,
        message: "must be a non-empty string",
      });
    }
    const contractPath = get(entry, "contractPath");
    if (contractPath !== undefined && !isString(contractPath)) {
      errors.push({
        path: `${path}.contractPath`,
        message: "must be a string when present",
      });
    }
    const brandedId = get(entry, "brandedId");
    if (brandedId !== undefined && !isString(brandedId)) {
      errors.push({
        path: `${path}.brandedId`,
        message: "must be a string when present",
      });
    }
    const notes = get(entry, "notes");
    if (notes !== undefined && !isString(notes)) {
      errors.push({
        path: `${path}.notes`,
        message: "must be a string when present",
      });
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

function validateContextualValidityJson(
  raw: unknown,
  base: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (raw === undefined) {
    return errors;
  }
  if (!isRecord(raw)) {
    errors.push({
      path: `${base}.contextualValidity`,
      message: "must be an object when present",
    });
    return errors;
  }
  if (get(raw, "accepted") !== true) {
    errors.push({
      path: `${base}.contextualValidity.accepted`,
      message: "must be true when contextualValidity is present",
    });
  }
  for (const field of ["applicableIn", "notApplicableIn"] as const) {
    const value = get(raw, field);
    if (!isArray(value)) {
      errors.push({
        path: `${base}.contextualValidity.${field}`,
        message: "must be an array",
      });
      continue;
    }
    value.forEach((entry, index) => {
      if (!isString(entry) || entry.length === 0) {
        errors.push({
          path: `${base}.contextualValidity.${field}[${index}]`,
          message: "must be a non-empty string",
        });
      }
    });
  }
  const conflictingWith = get(raw, "conflictingWith");
  if (conflictingWith !== undefined) {
    if (isArray(conflictingWith)) {
      conflictingWith.forEach((entry, index) => {
        if (!isString(entry) || entry.length === 0) {
          errors.push({
            path: `${base}.contextualValidity.conflictingWith[${index}]`,
            message: "must be a non-empty string",
          });
        }
      });
    } else {
      errors.push({
        path: `${base}.contextualValidity.conflictingWith`,
        message: "must be an array when present",
      });
    }
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
  errors.push(
    ...validateRealizationMapping(get(raw, "realizationMapping"), base)
  );
  errors.push(
    ...validateContextualValidityJson(get(raw, "contextualValidity"), base)
  );
  const lifecycle = get(raw, "lifecycle");
  if (
    !KNOWLEDGE_LIFECYCLE_STATUSES.includes(
      lifecycle as KnowledgeAtom["lifecycle"]
    )
  ) {
    errors.push({ path: `${base}.lifecycle`, message: "invalid lifecycle" });
  }
  const epistemicStatus = get(raw, "epistemicStatus");
  if (
    !EPISTEMIC_STATUSES.includes(
      epistemicStatus as KnowledgeAtom["epistemicStatus"]
    )
  ) {
    errors.push({
      path: `${base}.epistemicStatus`,
      message: `must be one of ${EPISTEMIC_STATUSES.join(", ")}`,
    });
  }
  const semanticStability = get(raw, "semanticStability");
  if (
    !SEMANTIC_STABILITY_LEVELS.includes(
      semanticStability as KnowledgeAtom["semanticStability"]
    )
  ) {
    errors.push({
      path: `${base}.semanticStability`,
      message: `must be one of ${SEMANTIC_STABILITY_LEVELS.join(", ")}`,
    });
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
  const fromTermId = get(raw, "fromTermId");
  if (
    fromTermId !== undefined &&
    (!isString(fromTermId) || fromTermId.length === 0)
  ) {
    errors.push({
      path: `${base}.fromTermId`,
      message: "must be a non-empty string when present",
    });
  }
  const toConceptId = get(raw, "toConceptId");
  if (
    toConceptId !== undefined &&
    (!isString(toConceptId) || toConceptId.length === 0)
  ) {
    errors.push({
      path: `${base}.toConceptId`,
      message: "must be a non-empty string when present",
    });
  }
  if (
    isString(type) &&
    isSemanticEdgeType(type as KnowledgeEdgeType) &&
    type === "equivalent"
  ) {
    if (!isString(fromTermId) || fromTermId.length === 0) {
      errors.push({
        path: `${base}.fromTermId`,
        message: 'required for type "equivalent"',
      });
    }
    if (!isString(toConceptId) || toConceptId.length === 0) {
      errors.push({
        path: `${base}.toConceptId`,
        message: 'required for type "equivalent"',
      });
    }
  }
  return errors;
}

function validateConceptJson(
  raw: unknown,
  index: number
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const base = `concepts[${index}]`;

  if (!isRecord(raw)) {
    return [{ path: base, message: "must be an object" }];
  }

  const conceptId = get(raw, "conceptId");
  if (!isString(conceptId) || conceptId.length === 0) {
    errors.push({
      path: `${base}.conceptId`,
      message: "must be a non-empty string",
    });
  }
  const fqn = get(raw, "fqn");
  if (!(isString(fqn) && fqn.startsWith("afenda.enterprise.concept."))) {
    errors.push({
      path: `${base}.fqn`,
      message: 'must start with "afenda.enterprise.concept."',
    });
  }
  const label = get(raw, "label");
  if (!isString(label) || label.length === 0) {
    errors.push({
      path: `${base}.label`,
      message: "must be a non-empty string",
    });
  }
  const description = get(raw, "description");
  if (!isString(description) || description.length === 0) {
    errors.push({
      path: `${base}.description`,
      message: "must be a non-empty string",
    });
  }
  if (get(raw, "ownedByPas") !== KNOWLEDGE_CONCEPT_OWNED_BY_PAS) {
    errors.push({
      path: `${base}.ownedByPas`,
      message: `must be "${KNOWLEDGE_CONCEPT_OWNED_BY_PAS}"`,
    });
  }
  return errors;
}

function validateTermJson(
  raw: unknown,
  index: number
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const base = `terms[${index}]`;

  if (!isRecord(raw)) {
    return [{ path: base, message: "must be an object" }];
  }

  const termId = get(raw, "termId");
  if (!isString(termId) || termId.length === 0) {
    errors.push({
      path: `${base}.termId`,
      message: "must be a non-empty string",
    });
  }
  const conceptId = get(raw, "conceptId");
  if (!isString(conceptId) || conceptId.length === 0) {
    errors.push({
      path: `${base}.conceptId`,
      message: "must be a non-empty string",
    });
  }
  const label = get(raw, "label");
  if (!isString(label) || label.length === 0) {
    errors.push({
      path: `${base}.label`,
      message: "must be a non-empty string",
    });
  }
  const preferred = get(raw, "preferred");
  if (typeof preferred !== "boolean") {
    errors.push({
      path: `${base}.preferred`,
      message: "must be a boolean",
    });
  }
  const locale = get(raw, "locale");
  if (locale !== undefined && !isString(locale)) {
    errors.push({
      path: `${base}.locale`,
      message: "must be a string when present",
    });
  }
  if (get(raw, "ownedByPas") !== KNOWLEDGE_CONCEPT_OWNED_BY_PAS) {
    errors.push({
      path: `${base}.ownedByPas`,
      message: `must be "${KNOWLEDGE_CONCEPT_OWNED_BY_PAS}"`,
    });
  }
  return errors;
}

export function validateConceptCorpus(
  concepts: unknown[]
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const seenFqns = new Set<string>();

  for (let i = 0; i < concepts.length; i++) {
    errors.push(...validateConceptJson(concepts[i], i));
    const concept = concepts[i];
    if (isRecord(concept)) {
      const conceptId = get(concept, "conceptId");
      const fqn = get(concept, "fqn");
      if (isString(conceptId)) {
        if (seenIds.has(conceptId)) {
          errors.push({
            path: `concepts[${i}].conceptId`,
            message: `duplicate conceptId: ${conceptId}`,
          });
        }
        seenIds.add(conceptId);
      }
      if (isString(fqn)) {
        if (seenFqns.has(fqn)) {
          errors.push({
            path: `concepts[${i}].fqn`,
            message: `duplicate fqn: ${fqn}`,
          });
        }
        seenFqns.add(fqn);
      }
    }
  }
  return errors;
}

export function validateTermCorpus(
  terms: unknown[],
  conceptIds: ReadonlySet<string>
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const seenTermIds = new Set<string>();

  for (let i = 0; i < terms.length; i++) {
    errors.push(...validateTermJson(terms[i], i));
    const term = terms[i];
    if (isRecord(term)) {
      const termId = get(term, "termId");
      const conceptId = get(term, "conceptId");
      if (isString(termId)) {
        if (seenTermIds.has(termId)) {
          errors.push({
            path: `terms[${i}].termId`,
            message: `duplicate termId: ${termId}`,
          });
        }
        seenTermIds.add(termId);
      }
      if (isString(conceptId) && !conceptIds.has(conceptId)) {
        errors.push({
          path: `terms[${i}].conceptId`,
          message: `unknown conceptId: ${conceptId}`,
        });
      }
    }
  }
  return errors;
}

function validatePerspectiveJson(
  raw: unknown,
  index: number
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const base = `perspectives[${index}]`;

  if (!isRecord(raw)) {
    return [{ path: base, message: "must be an object" }];
  }

  const perspectiveId = get(raw, "perspectiveId");
  if (!isString(perspectiveId) || perspectiveId.length === 0) {
    errors.push({
      path: `${base}.perspectiveId`,
      message: "must be a non-empty string",
    });
  }
  const conceptId = get(raw, "conceptId");
  if (!isString(conceptId) || conceptId.length === 0) {
    errors.push({
      path: `${base}.conceptId`,
      message: "must be a non-empty string",
    });
  }
  const domain = get(raw, "domain");
  if (!KNOWLEDGE_DOMAINS.includes(domain as KnowledgeDomain)) {
    errors.push({
      path: `${base}.domain`,
      message: `must be one of ${KNOWLEDGE_DOMAINS.join(", ")}`,
    });
  }
  const domainClass = get(raw, "domainClass");
  if (!KNOWLEDGE_DOMAIN_CLASSES.includes(domainClass as KnowledgeDomainClass)) {
    errors.push({
      path: `${base}.domainClass`,
      message: `must be one of ${KNOWLEDGE_DOMAIN_CLASSES.join(", ")}`,
    });
  }
  const atomId = get(raw, "atomId");
  if (!isString(atomId) || atomId.length === 0) {
    errors.push({
      path: `${base}.atomId`,
      message: "must be a non-empty string",
    });
  }
  const contextualLabel = get(raw, "contextualLabel");
  if (!isString(contextualLabel) || contextualLabel.length === 0) {
    errors.push({
      path: `${base}.contextualLabel`,
      message: "must be a non-empty string",
    });
  }
  if (get(raw, "ownedByPas") !== KNOWLEDGE_PERSPECTIVE_OWNED_BY_PAS) {
    errors.push({
      path: `${base}.ownedByPas`,
      message: `must be "${KNOWLEDGE_PERSPECTIVE_OWNED_BY_PAS}"`,
    });
  }
  return errors;
}

export function validatePerspectiveCorpus(
  perspectives: unknown[],
  conceptIds: ReadonlySet<string>,
  atomIds: ReadonlySet<string>
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  const seenPerspectiveIds = new Set<string>();

  for (let i = 0; i < perspectives.length; i++) {
    errors.push(...validatePerspectiveJson(perspectives[i], i));
    const perspective = perspectives[i];
    if (!isRecord(perspective)) {
      continue;
    }
    const perspectiveId = get(perspective, "perspectiveId");
    const conceptId = get(perspective, "conceptId");
    const atomId = get(perspective, "atomId");
    if (isString(perspectiveId)) {
      if (seenPerspectiveIds.has(perspectiveId)) {
        errors.push({
          path: `perspectives[${i}].perspectiveId`,
          message: `duplicate perspectiveId: ${perspectiveId}`,
        });
      }
      seenPerspectiveIds.add(perspectiveId);
    }
    if (isString(conceptId) && !conceptIds.has(conceptId)) {
      errors.push({
        path: `perspectives[${i}].conceptId`,
        message: `unknown conceptId: ${conceptId}`,
      });
    }
    if (isString(atomId) && !atomIds.has(atomId)) {
      errors.push({
        path: `perspectives[${i}].atomId`,
        message: `unknown atomId: ${atomId}`,
      });
    }
  }
  return errors;
}

export function validateAtomCorpusWithConcepts(
  atoms: unknown[],
  conceptIds: ReadonlySet<string>
): readonly ValidationError[] {
  const errors = [...validateAtomCorpus(atoms)];
  for (let i = 0; i < atoms.length; i++) {
    const atom = atoms[i];
    if (!isRecord(atom)) {
      continue;
    }
    const conceptId = get(atom, "conceptId");
    if (!isString(conceptId) || conceptId.length === 0) {
      errors.push({
        path: `atoms[${i}].conceptId`,
        message: "required after B38 — must reference concepts.json",
      });
      continue;
    }
    if (!conceptIds.has(conceptId)) {
      errors.push({
        path: `atoms[${i}].conceptId`,
        message: `unknown conceptId: ${conceptId}`,
      });
    }
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

export interface SemanticEdgeValidationContext {
  readonly atomConceptById: ReadonlyMap<string, string>;
  readonly conceptIds: ReadonlySet<string>;
  readonly termConceptById: ReadonlyMap<string, string>;
}

/** PAS-004C §4.7 — B42 semantic edge endpoint validation for edges.json. */
export function validateSemanticEdgeCorpus(
  edges: unknown[],
  context: SemanticEdgeValidationContext
): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  let semanticEdgeCount = 0;

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    if (!isRecord(edge)) {
      continue;
    }
    const type = get(edge, "type");
    if (!(isString(type) && isSemanticEdgeType(type as KnowledgeEdgeType))) {
      continue;
    }
    semanticEdgeCount += 1;
    const base = `edges[${i}]`;
    const fromTermId = get(edge, "fromTermId");
    const toConceptId = get(edge, "toConceptId");
    const fromAtomId = get(edge, "fromAtomId");
    const toAtomId = get(edge, "toAtomId");

    if (type === "equivalent") {
      if (isString(fromTermId)) {
        const termConceptId = context.termConceptById.get(fromTermId);
        if (termConceptId === undefined) {
          errors.push({
            path: `${base}.fromTermId`,
            message: `unknown termId: ${fromTermId}`,
          });
        } else if (isString(toConceptId) && termConceptId !== toConceptId) {
          errors.push({
            path: `${base}.fromTermId`,
            message: `term "${fromTermId}" resolves to concept "${termConceptId}", not "${toConceptId}"`,
          });
        }
      }
      if (isString(toConceptId) && !context.conceptIds.has(toConceptId)) {
        errors.push({
          path: `${base}.toConceptId`,
          message: `unknown conceptId: ${toConceptId}`,
        });
      }
      if (isString(fromAtomId)) {
        const atomConcept = context.atomConceptById.get(fromAtomId);
        if (
          isString(toConceptId) &&
          atomConcept !== undefined &&
          atomConcept !== toConceptId
        ) {
          errors.push({
            path: `${base}.fromAtomId`,
            message: `atom "${fromAtomId}" conceptId "${atomConcept}" must match toConceptId "${toConceptId}"`,
          });
        }
      }
      if (isString(toAtomId)) {
        const atomConcept = context.atomConceptById.get(toAtomId);
        if (
          isString(toConceptId) &&
          atomConcept !== undefined &&
          atomConcept !== toConceptId
        ) {
          errors.push({
            path: `${base}.toAtomId`,
            message: `atom "${toAtomId}" conceptId "${atomConcept}" must match toConceptId "${toConceptId}"`,
          });
        }
      }
    }
  }

  if (semanticEdgeCount < 2) {
    errors.push({
      path: "edges",
      message: "expected at least 2 semantic edges (PAS-004C §4.7 B42)",
    });
  }

  const equivalentCount = edges.filter(
    (edge) => isRecord(edge) && get(edge, "type") === "equivalent"
  ).length;
  if (equivalentCount < 1) {
    errors.push({
      path: "edges",
      message:
        'expected at least 1 "equivalent" edge linking terms to concepts (B38)',
    });
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
