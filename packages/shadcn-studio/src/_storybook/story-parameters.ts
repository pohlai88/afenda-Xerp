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
    "Stock shadcn/studio primitives from @afenda/shadcn-studio (B40 MCP seed). Unprefixed shadcn CSS variables — not TIP-004 governed @afenda/ui.",
} as const;

export const shadcnStudioBlockDocs = {
  component:
    "MCP placeholder block inventory (placeholder-hero). B40 manual seed equivalent — replace via /cui when MCP is available.",
} as const;
