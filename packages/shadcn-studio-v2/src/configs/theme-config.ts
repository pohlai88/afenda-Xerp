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
      label: "shadcn Default",
      description: "Canonical V2 default token layer.",
    },
    {
      id: "swiss-noir",
      label: "Swiss Noir",
      description: "Editorial monochrome theme constrained to shadcn tokens.",
    },
    {
      id: "verdant-noir",
      label: "Verdant Noir",
      description: "Editorial green noir theme constrained to shadcn tokens.",
    },
  ],
} as const satisfies StudioThemeConfig;
