/**
 * PAS-006D P06-008-R1 — auditable metadata binding overrides (merge onto generated rows).
 */

import type { MetadataBindingContractWire } from "../meta-contracts/metadata-binding.contract.js";

export type MetadataBindingOverrideReason =
  | "label-atom-refinement"
  | "presentation-kind-refinement"
  | "surface-template-class-refinement"
  | "erp-domain-assignment"
  | "legacy-contract-compatibility";

export interface MetadataBindingOverrideWire {
  readonly blockId: string;
  readonly notes: string;
  readonly patch: Partial<MetadataBindingContractWire>;
  readonly reason: MetadataBindingOverrideReason;
}

/** Controlled overrides only — prefer data-contract fixes over hidden manual rows. */
export const METADATA_BINDING_OVERRIDE_REGISTRY: readonly MetadataBindingOverrideWire[] =
  [
    {
      blockId: "account-settings-01",
      notes:
        "Profile fields expose help-text atom refs paired with profile.*.help DOM markers.",
      patch: {
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
      reason: "label-atom-refinement",
    },
    {
      blockId: "login-page-04",
      notes:
        "Auth sign-in password exposes a help-text atom for WCAG-adjacent metadata hydration.",
      patch: {
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
      reason: "label-atom-refinement",
    },
  ];

export function applyMetadataBindingOverrides(
  bindings: readonly MetadataBindingContractWire[]
): readonly MetadataBindingContractWire[] {
  if (METADATA_BINDING_OVERRIDE_REGISTRY.length === 0) {
    return bindings;
  }

  const overrideByBlockId = new Map<string, MetadataBindingOverrideWire>(
    METADATA_BINDING_OVERRIDE_REGISTRY.map((entry) => [entry.blockId, entry])
  );

  return bindings.map((binding) => {
    const override = overrideByBlockId.get(binding.blockId);

    if (override === undefined) {
      return binding;
    }

    return {
      ...binding,
      ...override.patch,
      ...(override.patch.fields === undefined
        ? {}
        : { fields: override.patch.fields }),
    } satisfies MetadataBindingContractWire;
  });
}
