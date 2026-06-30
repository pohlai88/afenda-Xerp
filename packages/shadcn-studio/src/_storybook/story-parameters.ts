/** PAS-006A L4 — Storybook layout, docs, and a11y parameters for the presentation lab. */

export const shadcnStudioStoryA11y = {
  config: {
    rules: [{ id: "color-contrast", enabled: true }],
  },
} as const;

export const shadcnStudioFullscreenLayout = {
  layout: "fullscreen" as const,
};

/** Page blocks (account-settings, login, …) — fullscreen canvas in Docs too. */
export const shadcnStudioPageBlockParameters = {
  layout: "fullscreen" as const,
  docs: {
    canvas: {
      layout: "fullscreen" as const,
    },
  },
} as const;

export const shadcnStudioAccountSettingsBlockDocs = {
  component:
    "Curated account-settings-01 lab — settings page shell, fixture-backed metadata hydration, and fullscreen layout. Auto story under Blocks Auto remains install smoke only.",
} as const;

export const shadcnStudioPaddedLayout = {
  layout: "padded" as const,
};

export const shadcnStudioCenteredLayout = {
  layout: "centered" as const,
};

export const shadcnStudioDarkThemeGlobals = {
  theme: "dark" as const,
};

export const shadcnStudioThemeLabDocs = {
  component:
    "PAS-006A lab verification — ThemeCustomizer, SettingsProvider, and all THEME_PRESET_SLUGS in light/dark. Imports @afenda/shadcn-studio only (no Afenda governance packages).",
} as const;

export const shadcnStudioPrimitivesDocs = {
  component:
    "Stock shadcn/studio primitives from @afenda/shadcn-studio (MCP seed). Unprefixed shadcn CSS variables — not legacy governed UI.",
} as const;

export const shadcnStudioBlockDocs = {
  component:
    "Live MCP blocks from @ss-blocks — hero-section-01, login-page-04, statistics-card-01, and related Pro inventory. Stock shadcn className patterns (PAS-006 Phase 1).",
} as const;
