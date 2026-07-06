/** ERP-local metadata binding registry (B-08 v2 bridge). */

import type {
  MetadataBindingContractWire,
  MetadataBindingFieldWire,
  SurfaceTemplateContractWire,
} from "./metadata-studio.contract";
import { resolveMetadataBindingModuleAssignment } from "./metadata-binding-module-assignment";
import { SURFACE_TEMPLATE_REGISTRY } from "./metadata-surface-template.registry";

const PRESENTATION_LABEL_ATOM_REFS: Readonly<Record<string, string>> = {
  title: "atom.marketing.hero-title",
  subtitle: "atom.marketing.hero-subtitle",
  "login.branding.title": "atom.auth.branding-title",
  "login.branding.lead": "atom.auth.branding-lead",
  "login.form.title": "atom.auth.form-title",
  "login.form.subtitle": "atom.auth.form-subtitle",
  "login.email": "atom.auth.email",
  "login.password": "atom.auth.password",
  "login.submit": "atom.auth.sign-in",
  "profile.displayName": "atom.user.display-name",
  "profile.email": "atom.user.email",
  "metric.label": "atom.analytics.metric-label",
  "metric.value": "atom.analytics.metric-value",
  "table.header": "atom.table.header",
  "table.rows": "atom.table.rows",
};

function resolveLabelAtomRef(slotId: string, fieldKey: string): string {
  return (
    PRESENTATION_LABEL_ATOM_REFS[slotId] ??
    PRESENTATION_LABEL_ATOM_REFS[fieldKey] ??
    `atom.preview.${fieldKey}`
  );
}

function buildBindingFromSurfaceTemplate(
  template: SurfaceTemplateContractWire
): MetadataBindingContractWire | undefined {
  const primaryBinding = template.blockBindings[0];

  if (primaryBinding === undefined) {
    return;
  }

  const fields: MetadataBindingFieldWire[] = Object.entries(
    primaryBinding.slotFills
  ).map(([slotId, fieldKey]) => ({
    fieldKey,
    slotId,
    presentationKind: fieldKey.includes("password")
      ? "text"
      : fieldKey.includes("email")
        ? "text"
        : "readonly",
    labelAtomRef: resolveLabelAtomRef(slotId, fieldKey),
  }));

  if (fields.length === 0) {
    return;
  }

  return {
    blockId: primaryBinding.blockId,
    metadataBindingId: template.metadataBindingId,
    fields,
    surfaceTemplateClass: template.templateClass,
    ...resolveMetadataBindingModuleAssignment(primaryBinding.blockId),
  };
}

const METADATA_BINDING_OVERRIDE_BY_BLOCK_ID: Readonly<
  Record<string, Partial<MetadataBindingContractWire>>
> = {
  "hero-section-01": {
    fields: [
      {
        fieldKey: "title",
        slotId: "hero.title",
        presentationKind: "text",
        labelAtomRef: "atom.marketing.hero-title",
      },
      {
        fieldKey: "subtitle",
        slotId: "hero.subtitle",
        presentationKind: "text",
        labelAtomRef: "atom.marketing.hero-subtitle",
      },
    ],
  },
  "account-settings-01": {
    fields: [
      {
        fieldKey: "displayName",
        slotId: "profile.displayName",
        presentationKind: "text",
        labelAtomRef: "atom.user.display-name",
        helpTextAtomRef: "atom.user.display-name.help",
        requiredDisplay: true,
      },
      {
        fieldKey: "email",
        slotId: "profile.email",
        presentationKind: "text",
        labelAtomRef: "atom.user.email",
        helpTextAtomRef: "atom.user.email.help",
        requiredDisplay: true,
      },
    ],
  },
  "login-page-04": {
    fields: [
      {
        fieldKey: "brandingTitle",
        slotId: "login.branding.title",
        presentationKind: "readonly",
        labelAtomRef: "atom.auth.branding-title",
      },
      {
        fieldKey: "brandingLead",
        slotId: "login.branding.lead",
        presentationKind: "readonly",
        labelAtomRef: "atom.auth.branding-lead",
      },
      {
        fieldKey: "formTitle",
        slotId: "login.form.title",
        presentationKind: "readonly",
        labelAtomRef: "atom.auth.form-title",
      },
      {
        fieldKey: "formSubtitle",
        slotId: "login.form.subtitle",
        presentationKind: "readonly",
        labelAtomRef: "atom.auth.form-subtitle",
      },
      {
        fieldKey: "email",
        slotId: "login.email",
        presentationKind: "text",
        labelAtomRef: "atom.auth.email",
        requiredDisplay: true,
      },
      {
        fieldKey: "password",
        slotId: "login.password",
        presentationKind: "text",
        labelAtomRef: "atom.auth.password",
        helpTextAtomRef: "atom.auth.password.help",
        requiredDisplay: true,
      },
      {
        fieldKey: "submit",
        slotId: "login.submit",
        presentationKind: "readonly",
        labelAtomRef: "atom.auth.sign-in",
      },
    ],
  },
};

function applyBindingOverrides(
  bindings: readonly MetadataBindingContractWire[]
): readonly MetadataBindingContractWire[] {
  return bindings.map((binding) => {
    const override = METADATA_BINDING_OVERRIDE_BY_BLOCK_ID[binding.blockId];

    if (override === undefined) {
      return binding;
    }

    return {
      ...binding,
      ...override,
      ...(override.fields === undefined ? {} : { fields: override.fields }),
    } satisfies MetadataBindingContractWire;
  });
}

function buildMetadataBindingsFromSurfaceTemplates(): readonly MetadataBindingContractWire[] {
  const bindings: MetadataBindingContractWire[] = [];

  for (const template of SURFACE_TEMPLATE_REGISTRY) {
    const binding = buildBindingFromSurfaceTemplate(template);

    if (binding !== undefined) {
      bindings.push(binding);
    }
  }

  return applyBindingOverrides(bindings);
}

export const METADATA_BINDING_REGISTRY =
  buildMetadataBindingsFromSurfaceTemplates();

export function getMetadataBindingById(
  metadataBindingId: string,
  registry: readonly MetadataBindingContractWire[] = METADATA_BINDING_REGISTRY
): MetadataBindingContractWire | undefined {
  return registry.find(
    (binding) => binding.metadataBindingId === metadataBindingId
  );
}

export function getMetadataBindingByBlockId(
  blockId: string,
  registry: readonly MetadataBindingContractWire[] = METADATA_BINDING_REGISTRY
): MetadataBindingContractWire | undefined {
  return registry.find((binding) => binding.blockId === blockId);
}
