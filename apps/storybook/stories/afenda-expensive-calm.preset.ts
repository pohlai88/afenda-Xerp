export const AFENDA_EXPENSIVE_CALM_PRESET_ID = "afenda-expensive-calm" as const;

export const afendaExpensiveCalmPreset = {
  id: AFENDA_EXPENSIVE_CALM_PRESET_ID,
  label: "Afenda Expensive Calm",
  description:
    "Editorial dark surface for long-hour ERP operators: warm black, muted paper text, low-glare amber, restrained blue.",
  className: "theme-afenda-expensive-calm",
  tokens: {
    background: "oklch(0.145 0.012 255)",
    foreground: "oklch(0.925 0.018 82)",
    primary: "oklch(0.735 0.105 74)",
    accent: "oklch(0.285 0.035 250)",
    border: "oklch(0.305 0.018 255)",
    radius: "0.875rem",
  },
  usage: {
    bestFor: [
      "App shell (protected operator chrome)",
      "Storybook presentation lab",
      "dashboard review",
      "approval and governance screens",
      "long-hour internal tools",
    ],
    avoidFor: [
      "marketing landing pages",
      "children-style playful UI",
      "high-saturation campaign visuals",
    ],
  },
} as const;

export type AfendaExpensiveCalmPreset = typeof afendaExpensiveCalmPreset;
