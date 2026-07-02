/**
 * Serializable SSOT for scoped editorial lab presets (Storybook per-story only).
 *
 * Not registered in theme-presets.ts — SettingsProvider html inline override
 * is intentionally excluded for noir blast-radius control.
 */

export type EditorialLabPresetStatus = "review";

export type EditorialLabPresetId = "afenda-brand" | "afenda-verdant";

export type EditorialVocab = "lab-*" | "afenda-*";

export type PresentationLabPresetRegistryEntry = {
  readonly presetId: EditorialLabPresetId;
  readonly label: string;
  readonly className: string;
  readonly status: EditorialLabPresetStatus;
  readonly presetSourcePath: string;
  readonly cssMirrorPath: string;
  readonly specPath: string;
  readonly figmaManifestPath: string | null;
  readonly editorialVocab: EditorialVocab;
  readonly storyImportPath: string;
};

export const PRESENTATION_LAB_PRESET_REGISTRY = [
  {
    presetId: "afenda-brand",
    label: "Afenda Brand (Swiss Noir DNA)",
    className: "theme-afenda-brand",
    status: "review",
    presetSourcePath:
      "packages/shadcn-studio/src/styles/afenda-brand.preset.ts",
    cssMirrorPath: "packages/shadcn-studio/docs/swiss-noir.css",
    specPath: "packages/shadcn-studio/docs/swiss.noir.md",
    figmaManifestPath:
      "packages/shadcn-studio/src/styles/afenda-brand.figma-manifest.json",
    editorialVocab: "lab-*",
    storyImportPath: "../../../packages/shadcn-studio/docs/swiss-noir.css",
  },
  {
    presetId: "afenda-verdant",
    label: "Verdant Milk Noir",
    className: "theme-afenda-verdant-milk-noir",
    status: "review",
    presetSourcePath:
      "packages/shadcn-studio/src/styles/afenda-verdant.preset.ts",
    cssMirrorPath: "packages/shadcn-studio/docs/verdant-noir.css",
    specPath: "packages/shadcn-studio/docs/verdant.noir.md",
    figmaManifestPath:
      "packages/shadcn-studio/src/styles/afenda-verdant.figma-manifest.json",
    editorialVocab: "afenda-*",
    storyImportPath: "../../../packages/shadcn-studio/docs/verdant-noir.css",
  },
] as const satisfies readonly PresentationLabPresetRegistryEntry[];

export const PRESENTATION_LAB_PRESET_IDS = PRESENTATION_LAB_PRESET_REGISTRY.map(
  (entry) => entry.presetId
);

export function isEditorialLabPresetId(
  value: string
): value is EditorialLabPresetId {
  return (PRESENTATION_LAB_PRESET_IDS as readonly string[]).includes(value);
}

export function getPresentationLabPresetEntry(
  presetId: EditorialLabPresetId
): PresentationLabPresetRegistryEntry {
  const entry = PRESENTATION_LAB_PRESET_REGISTRY.find(
    (candidate) => candidate.presetId === presetId
  );

  if (!entry) {
    throw new Error(`Unknown editorial lab preset: ${presetId}`);
  }

  return entry;
}
