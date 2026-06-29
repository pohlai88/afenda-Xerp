import {
  isKnowledgeAtomId,
  projectKnowledgeAtom,
} from "@afenda/enterprise-knowledge";

/**
 * Maps PAS-006 presentation labelAtomRef paths to platform Knowledge Atom ids.
 * Extend when studio bindings adopt additional platform vocabulary refs.
 */
const LABEL_ATOM_REF_TO_KNOWLEDGE_ATOM_ID = {
  "atom.tenant.label": "tenant",
  "atom.legal-entity.label": "legal_entity",
  "atom.organization-unit.label": "organization_unit",
  "atom.workspace.label": "workspace",
  "atom.surface.label": "surface",
  "atom.entity-group.label": "entity_group",
  "atom.ownership-interest.label": "ownership_interest",
  "atom.operating-context.label": "operating_context",
} as const satisfies Readonly<Record<string, string>>;

const FIELD_KEY_TO_KNOWLEDGE_ATOM_ID = {
  tenantId: "tenant",
  tenant: "tenant",
  companyId: "legal_entity",
  legalEntityId: "legal_entity",
  entityGroupId: "entity_group",
  workspaceId: "workspace",
  surfaceId: "surface",
} as const satisfies Readonly<Record<string, string>>;

function resolveKnowledgeAtomIdFromLabelAtomRef(
  atomRef: string
): string | undefined {
  const trimmed = atomRef.trim();

  if (trimmed.length === 0) {
    return;
  }

  const mapped =
    LABEL_ATOM_REF_TO_KNOWLEDGE_ATOM_ID[
      trimmed as keyof typeof LABEL_ATOM_REF_TO_KNOWLEDGE_ATOM_ID
    ];

  if (mapped !== undefined && isKnowledgeAtomId(mapped)) {
    return mapped;
  }

  if (isKnowledgeAtomId(trimmed)) {
    return trimmed;
  }

  const prefixMatch = /^atom\.([a-z0-9-]+)\./i.exec(trimmed);
  const conceptSegment = prefixMatch?.[1];

  if (conceptSegment !== undefined) {
    const candidate = conceptSegment.replace(/-/g, "_");

    if (isKnowledgeAtomId(candidate)) {
      return candidate;
    }
  }

  return;
}

/** Resolves accepted Knowledge Atom labels for metadata slot hydration (PAS-004 / PAS-006D). */
export function resolveMetadataKnowledgeLabelFromAtomRef(
  atomRef: string | undefined
): string | undefined {
  if (atomRef === undefined || atomRef.trim().length === 0) {
    return;
  }

  const atomId = resolveKnowledgeAtomIdFromLabelAtomRef(atomRef);

  if (atomId === undefined) {
    return;
  }

  const projection = projectKnowledgeAtom(atomId, "metadata");
  return projection.shortLabel.length > 0 ? projection.shortLabel : undefined;
}

/** Resolves platform identity labels from binding field keys when atom refs are absent. */
export function resolveMetadataKnowledgeLabelFromFieldKey(
  fieldKey: string
): string | undefined {
  const atomId =
    FIELD_KEY_TO_KNOWLEDGE_ATOM_ID[
      fieldKey as keyof typeof FIELD_KEY_TO_KNOWLEDGE_ATOM_ID
    ];

  if (atomId === undefined) {
    return;
  }

  return resolveMetadataKnowledgeLabelFromAtomRef(atomId);
}
