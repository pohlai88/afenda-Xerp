/** PAS-006A L4 — Storybook layout, docs, a11y, and preview parameters for the v2 lab. */

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
  laptop: {
    name: "Laptop",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
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

export const shadcnStudioLabGlobalTypes = {
  theme: {
    description:
      "Presentation color mode — @afenda/shadcn-studio-v2 CSS tokens (ADR-0027)",
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
