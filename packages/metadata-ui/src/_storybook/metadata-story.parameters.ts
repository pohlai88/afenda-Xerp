export const metadataStoryA11y = {
  config: {
    rules: [{ id: "color-contrast", enabled: true }],
  },
} as const;

export const metadataFullscreenLayout = {
  layout: "fullscreen" as const,
};

export const metadataPaddedLayout = {
  layout: "padded" as const,
};

export const metadataCenteredLayout = {
  layout: "centered" as const,
};

export const metadataMobileViewport = {
  viewport: { defaultViewport: "mobile" as const },
};

export const metadataTabletViewport = {
  viewport: { defaultViewport: "tablet" as const },
};

export const metadataDarkThemeGlobals = {
  theme: "dark" as const,
};

export const metadataRawDocs = {
  component:
    "Production metadata-ui chrome only. Stories render structural regions and data hooks (`data-slot`, `data-action-group`, `data-metadata-readonly`) without `metadata-fixture-*` composition markup. Visual tokens will wire through `@afenda/ui/governance` (`resolveMetadataUiSlotClassName`, `densityToAttribute`) — see Metadata/Authority Preview before downstream integration.",
} as const;

export const metadataComposedDocs = {
  component:
    "ERP-composed preview of metadata-ui fixtures inside Afenda design tokens. Demonstrates how asymmetric dashboard and master-detail page rhythms look when the consuming shell applies visual styling. Fixture layout classes live in `metadata-ui-fixtures.css` and are not production chrome.",
} as const;

export const metadataFixtureDashboardDocs = {
  component:
    "Demo-only asymmetric fulfillment dashboard. Validates dominant metric, secondary rail, attention queue, trend evidence, and compact activity table — deliberately not a uniform KPI card grid.",
} as const;

export const metadataFixturePageDocs = {
  component:
    "Demo-only master-detail order workspace. Structurally distinct from the dashboard fixture: aside detail summary, master queue table, contextual actions, and audit evidence.",
} as const;

export const metadataActionsDocs = {
  component:
    "Governed action bar rendering for metadata surfaces. Exposes hierarchy via `data-action-group` and visibility via `data-action-visibility`. Primary actions are not visually styled here — the consuming shell owns accent treatment. Diagnostics warn when more than one visible primary action is present.",
} as const;

export const metadataStatesDocs = {
  component:
    "Runtime state placeholders aligned with `@afenda/ui-composition` vocabulary. Optional `slots.icon`, `slots.action`, and `slots.detail` are shell-provided only; metadata-ui renders slot locations, not icons or decoration.",
} as const;
