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
  "atom.tenant.help": "tenant",
  "atom.legal-entity.label": "legal_entity",
  "atom.legal-entity.help": "legal_entity",
  "atom.organization-unit.label": "organization_unit",
  "atom.workspace.label": "workspace",
  "atom.surface.label": "surface",
  "atom.entity-group.label": "entity_group",
  "atom.ownership-interest.label": "ownership_interest",
  "atom.operating-context.label": "operating_context",
} as const satisfies Readonly<Record<string, string>>;

/**
 * Studio presentation atom refs — slot labels mirrored from block-slot.registry.
 * Presentation vocabulary only; business meaning remains in PAS-004 atoms.
 */
const PRESENTATION_ATOM_REF_TO_LABEL = {
  "atom.auth.email": "Email field",
  "atom.auth.password": "Password field",
  "atom.auth.sign-in": "Submit action",
  "atom.marketing.hero-title": "Hero title",
  "atom.marketing.hero-subtitle": "Hero subtitle",
  "atom.marketing.hero-cta": "Primary CTA",
  "atom.analytics.metric-label": "Metric label",
  "atom.analytics.metric-value": "Metric value",
  "atom.analytics.metric-change": "Metric change",
  "atom.user.display-name": "Display name",
  "atom.user.email": "Email",
  "atom.actions.save": "Save profile",
  "atom.invoice.number": "Table header",
  "atom.invoice.amount": "Table rows",
  "atom.actions.view": "Row actions",
  "atom.activity.title": "Dialog header",
  "atom.activity.summary": "Dialog body",
  "atom.actions.close": "Dialog footer",
} as const satisfies Readonly<Record<string, string>>;

/** Presentation help copy — studio vocabulary; not PAS-004 business authority. */
const PRESENTATION_ATOM_REF_TO_HELP_TEXT = {
  "atom.auth.password.help":
    "Use the password for your Afenda account. Never share it with anyone.",
  "atom.user.display-name.help":
    "Your name as shown to other workspace members.",
  "atom.user.email.help": "Used for sign-in and account notifications.",
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

function resolveKnowledgeAtomIdFromAtomRef(
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

/** Resolves studio presentation slot labels (non-knowledge atom refs). */
export function resolveMetadataPresentationLabelFromAtomRef(
  atomRef: string | undefined
): string | undefined {
  if (atomRef === undefined || atomRef.trim().length === 0) {
    return;
  }

  const trimmed = atomRef.trim();

  return PRESENTATION_ATOM_REF_TO_LABEL[
    trimmed as keyof typeof PRESENTATION_ATOM_REF_TO_LABEL
  ];
}

/** Resolves accepted Knowledge Atom labels for metadata slot hydration (PAS-004 / PAS-006D). */
export function resolveMetadataKnowledgeLabelFromAtomRef(
  atomRef: string | undefined
): string | undefined {
  if (atomRef === undefined || atomRef.trim().length === 0) {
    return;
  }

  const atomId = resolveKnowledgeAtomIdFromAtomRef(atomRef);

  if (atomId === undefined) {
    return;
  }

  const projection = projectKnowledgeAtom(atomId, "metadata");
  return projection.shortLabel.length > 0 ? projection.shortLabel : undefined;
}

/** Resolves help text from Knowledge Atom exposure (preferredWording → shortLabel). */
export function resolveMetadataKnowledgeHelpTextFromAtomRef(
  atomRef: string | undefined
): string | undefined {
  if (atomRef === undefined || atomRef.trim().length === 0) {
    return;
  }

  const atomId = resolveKnowledgeAtomIdFromAtomRef(atomRef);

  if (atomId !== undefined) {
    const projection = projectKnowledgeAtom(atomId, "metadata");
    const preferredWording = projection.preferredWording?.trim();

    if (preferredWording !== undefined && preferredWording.length > 0) {
      return preferredWording;
    }

    if (projection.shortLabel.length > 0) {
      return projection.shortLabel;
    }
  }

  const trimmed = atomRef.trim();

  return PRESENTATION_ATOM_REF_TO_HELP_TEXT[
    trimmed as keyof typeof PRESENTATION_ATOM_REF_TO_HELP_TEXT
  ];
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
