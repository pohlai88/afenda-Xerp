/** PAS-006A L4 — Storybook layout, docs, a11y, and preview parameters for the presentation lab. */

export const shadcnStudioStoryA11y = {
  config: {
    rules: [
      { id: "color-contrast", enabled: true },
      { id: "label", enabled: true },
      { id: "button-name", enabled: true },
      { id: "link-name", enabled: true },
      { id: "image-alt", enabled: true },
      { id: "aria-hidden-body", enabled: true },
      { id: "duplicate-id", enabled: true },
      { id: "tabindex", enabled: true },
    ],
  },
  test: "warn" as const,
} as const;

export const shadcnStudioLabViewports = {
  mobile: {
    name: "Mobile",
    styles: { width: "375px", height: "667px" },
    type: "mobile" as const,
  },
  tablet: {
    name: "Tablet",
    styles: { width: "768px", height: "1024px" },
    type: "tablet" as const,
  },
  desktop: {
    name: "Desktop",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
} as const;

export const shadcnStudioLabDocsParameters = {
  toc: true,
  source: {
    type: "code" as const,
    state: "open" as const,
  },
  canvas: {
    sourceState: "shown" as const,
  },
} as const;

export const shadcnStudioLabPreviewParameters = {
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  layout: "centered" as const,
  backgrounds: {
    disable: true,
  },
  a11y: shadcnStudioStoryA11y,
  docs: shadcnStudioLabDocsParameters,
  viewport: {
    defaultViewport: "responsive",
    viewports: shadcnStudioLabViewports,
  },
} as const;

export const shadcnStudioLabStorySort = {
  order: [
    "Afenda",
    ["Lab"],
    "Presentation Lab",
    ["Swiss Noir Control Room", "Verdant Milk Noir"],
    "Shadcn Studio",
    [
      "Blocks",
      "Blocks Auto",
      "Blocks Flat",
      "Blocks Preview",
      "App Shell",
      "Assets",
      "Theme Lab",
      "Token Verification",
      "Primitives",
      "Primitives Catalog",
    ],
    "components-ui",
    "components-layouts",
  ],
} as const;

/** Mirror of `apps/storybook/.storybook/preview.tsx` — Storybook 10 requires inline storySort at runtime. */

/** Storybook `GlobalTypes` — icon literals must stay narrow for toolbar typing. */
export const shadcnStudioLabGlobalTypes = {
  theme: {
    description:
      "Presentation color mode — shadcn-studio CSS tokens (ADR-0027)",
    defaultValue: "light",
    toolbar: {
      title: "Color mode",
      icon: "circlehollow" as const,
      items: [
        { value: "light", title: "Light", icon: "sun" as const },
        { value: "dark", title: "Dark", icon: "moon" as const },
      ],
      dynamicTitle: true,
    },
  },
};

export const shadcnStudioLabInitialGlobals = {
  theme: "light" as const,
} as const;

export const shadcnStudioFullscreenLayout = {
  layout: "fullscreen" as const,
};

/** Page blocks (account-settings, login, …) — fullscreen canvas in Docs too. */
export const shadcnStudioPageBlockParameters = {
  layout: "fullscreen" as const,
  docs: {
    ...shadcnStudioLabDocsParameters,
    canvas: {
      ...shadcnStudioLabDocsParameters.canvas,
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

export const shadcnStudioLabWelcomeDocs = {
  component:
    "Afenda presentation lab (ADR-0027 · PAS-006). Editorial entry point for MCP block verification, theme presets, and governed primitive review before ERP promotion.",
} as const;

/** Docs pages from `component` prop tables — set on meta or preview.
 *  CSF indexer requires string literals in story files; mirror these values. */
export const shadcnStudioLabAutodocsTags = ["autodocs"] as const;

/** Curated entry points run in Vitest browser CI (`pnpm test:storybook:run`). */
export const shadcnStudioLabSmokeTags = ["autodocs", "lab-smoke"] as const;

/** Colocated primitive stories — args-first CSF with optional `play`. */
export const shadcnStudioLabColocatedTags = [
  "autodocs",
  "lab-smoke",
  "colocated",
] as const;

/** Gold colocated primitives — tag on Primary story (not meta) for Vitest a11y CI. */
export const shadcnStudioLabA11ySmokeStoryTags = ["a11y-smoke"] as const;

/** Meta tags when documenting the full Gold colocated bundle (reference only). */
export const shadcnStudioLabA11ySmokeTags = [
  "autodocs",
  "lab-smoke",
  "colocated",
  "a11y-smoke",
] as const;

/** Vitest a11y run — fail on violations (scoped to `a11y-smoke` stories only). */
export const shadcnStudioStoryA11yVitest = {
  ...shadcnStudioStoryA11y,
  test: "error" as const,
} as const;

/** Chromatic default — snapshots off until Gold Primary opts in (Step 10). */
export const shadcnStudioChromaticDisabledParameters = {
  chromatic: {
    disableSnapshot: true,
  },
} as const;

/** Gold Primary story — Chromatic visual smoke (inherits modes from preview). */
export const shadcnStudioChromaticSmokeParameters = {
  chromatic: {
    disableSnapshot: false,
  },
} as const;

/** Optional Figma frame link via env — no-op when unset (addon-designs). */
export function shadcnStudioFigmaDesignFromEnv(envKey: string): {
  design?: { type: "figma"; url: string };
} {
  const url = process.env[envKey]?.trim();
  if (!url) {
    return {};
  }

  return {
    design: {
      type: "figma",
      url,
    },
  };
}

/** Env key for Gold primitive Figma design — `STORYBOOK_FIGMA_PRIMITIVE_{SLUG}`. */
export function shadcnStudioPrimitiveFigmaEnvKey(slug: string): string {
  return `STORYBOOK_FIGMA_PRIMITIVE_${slug.replace(/-/g, "_").toUpperCase()}`;
}

/** Optional Figma frame on Gold primitive meta — no-op when env unset (Step 11). */
export function shadcnStudioPrimitiveFigmaDesignFromEnv(slug: string): {
  design?: { type: "figma"; url: string };
} {
  return shadcnStudioFigmaDesignFromEnv(shadcnStudioPrimitiveFigmaEnvKey(slug));
}
