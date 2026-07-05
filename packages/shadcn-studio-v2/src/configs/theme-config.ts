import type { StudioThemeConfig } from "../types/theme";

export const studioThemeConfig = {
  defaultThemeId: "shadcn-default",
  defaultMode: "system",
  storageKey: "afenda-studio-v2-theme",
  themeAttribute: "data-theme",
  darkClassName: "dark",
  themes: [
    {
      id: "shadcn-default",
      label: "Shadcn Default",
      description: "Canonical V2 default token layer.",
      selector: ":root",
    },
    {
      id: "swiss-noir",
      label: "Swiss Noir",
      description: "Editorial monochrome theme constrained to shadcn tokens.",
      selector: '[data-theme="swiss-noir"]',
    },
    {
      id: "verdant-noir",
      label: "Verdant Noir",
      description: "Editorial green noir theme constrained to shadcn tokens.",
      selector: '[data-theme="verdant-noir"]',
    },
  ],
} satisfies StudioThemeConfig;
