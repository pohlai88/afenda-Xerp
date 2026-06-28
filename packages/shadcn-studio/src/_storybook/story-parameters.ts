export const shadcnStudioStoryA11y = {
  config: {
    rules: [{ id: "color-contrast", enabled: true }],
  },
} as const;

export const shadcnStudioFullscreenLayout = {
  layout: "fullscreen" as const,
};

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
    "PAS-005A lab verification — ThemeCustomizer, SettingsProvider, and all THEME_PRESET_SLUGS in light/dark. Imports @afenda/shadcn-studio only (no Afenda governance packages).",
} as const;

export const shadcnStudioPrimitivesDocs = {
  component:
    "Stock shadcn/studio primitives from @afenda/shadcn-studio (B40 MCP seed). Unprefixed shadcn CSS variables — not Governed UI governed @afenda/ui.",
} as const;

export const shadcnStudioBlockDocs = {
  component:
    "Live MCP blocks from @ss-blocks (B42c) — hero-section-01, login-page-04, application-shell chrome, statistics-card-01. Stock shadcn className patterns (Phase 1 — no Governed UI strip).",
} as const;
