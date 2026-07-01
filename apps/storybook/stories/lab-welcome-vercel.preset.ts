export const VERCEL_LAB_PRESET_ID = "vercel-lab" as const;

/** Cursor Vercel plugin — vercel.md UI Design Defaults (shadcn + Geist, dark zinc). */
export const vercelLabPreset = {
  id: VERCEL_LAB_PRESET_ID,
  label: "Vercel Lab",
  description:
    "Vercel plugin design system demo: true black canvas, zinc borders, Geist hierarchy, mono commands.",
  className: "theme-vercel-lab",
  pluginAuthority:
    "Cursor Vercel plugin → vercel.md → UI Design Defaults (shadcn/ui + Geist, dark developer surfaces)",
  tokens: {
    background: "oklch(0 0 0)",
    foreground: "oklch(0.985 0 0)",
    border: "oklch(0.24 0 0)",
    radius: "0.5rem",
  },
} as const;

export type VercelLabPreset = typeof vercelLabPreset;
