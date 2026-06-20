import {
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
  type AfendaCssVariableName,
  type AfendaTokenName,
  type TokenDefinition,
  type TokenRegistry,
  tokenNameToCssVariable,
} from "../contracts/token.contract";

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Creates a fully-typed token definition, computing cssVariable from the name. */
function tok(
  name: AfendaTokenName,
  category: TokenDefinition["category"],
  value: string,
  description: string,
  isPublic = true,
  darkValue?: string
): TokenDefinition {
  return {
    name,
    cssVariable: tokenNameToCssVariable(name) as AfendaCssVariableName,
    category,
    value,
    ...(darkValue !== undefined ? { darkValue } : {}),
    description,
    stable: true,
    public: isPublic,
  };
}

// ─── Token list ───────────────────────────────────────────────────────────────

const tokens: readonly TokenDefinition[] = [
  // ── Color › Surface ────────────────────────────────────────────────────────
  tok(
    "afenda.color.surface.canvas",
    "color",
    "oklch(0.986 0.006 85)",
    "Application canvas background — warm ivory shell.",
    true,
    "oklch(0.15 0.026 255)"
  ),
  tok(
    "afenda.color.surface.card",
    "color",
    "oklch(0.998 0.002 85)",
    "Panel and card surface — slightly elevated above canvas.",
    true,
    "oklch(0.202 0.027 255)"
  ),
  tok(
    "afenda.color.surface.muted",
    "color",
    "oklch(0.958 0.011 88)",
    "Muted surface for secondary regions (tabs, code blocks).",
    true,
    "oklch(0.245 0.024 255)"
  ),
  tok(
    "afenda.color.surface.popover",
    "color",
    "oklch(1 0 0)",
    "Popover / dropdown surface — pure white in light, deep navy in dark.",
    true,
    "oklch(0.218 0.028 255)"
  ),
  tok(
    "afenda.color.surface.inverse",
    "color",
    "oklch(0.18 0.025 255)",
    "Inverse surface for high-contrast overlays.",
    true,
    "oklch(0.965 0.006 85)"
  ),

  // ── Color › Text ───────────────────────────────────────────────────────────
  tok(
    "afenda.color.text.default",
    "color",
    "oklch(0.18 0.025 255)",
    "Primary readable foreground — deep navy ink.",
    true,
    "oklch(0.965 0.006 85)"
  ),
  tok(
    "afenda.color.text.muted",
    "color",
    "oklch(0.42 0.025 250)",
    "Secondary readable foreground.",
    true,
    "oklch(0.78 0.02 245)"
  ),
  tok(
    "afenda.color.text.inverse",
    "color",
    "oklch(0.985 0.005 95)",
    "Foreground on inverse surfaces.",
    true,
    "oklch(0.18 0.025 255)"
  ),
  tok(
    "afenda.color.text.disabled",
    "color",
    "oklch(0.65 0.015 250)",
    "Disabled control label.",
    true,
    "oklch(0.45 0.02 250)"
  ),

  // ── Color › Brand ──────────────────────────────────────────────────────────
  tok(
    "afenda.color.primary",
    "color",
    "oklch(0.47 0.16 252)",
    "Primary brand color — deep authority blue (#005DB3 approx).",
    true,
    "oklch(0.72 0.14 245)"
  ),
  tok(
    "afenda.color.primary.foreground",
    "color",
    "oklch(0.985 0.005 95)",
    "Foreground on primary brand surfaces.",
    true,
    "oklch(0.15 0.025 255)"
  ),
  tok(
    "afenda.color.secondary",
    "color",
    "oklch(0.945 0.016 238)",
    "Secondary surface — cool blue-grey.",
    true,
    "oklch(0.265 0.032 250)"
  ),
  tok(
    "afenda.color.secondary.foreground",
    "color",
    "oklch(0.24 0.035 250)",
    "Foreground on secondary surfaces.",
    true,
    "oklch(0.965 0.006 85)"
  ),

  // ── Color › Accent ─────────────────────────────────────────────────────────
  tok(
    "afenda.color.accent",
    "color",
    "oklch(0.93 0.04 150)",
    "Accent color — intelligent green (organised clarity).",
    true,
    "oklch(0.30 0.06 150)"
  ),
  tok(
    "afenda.color.accent.foreground",
    "color",
    "oklch(0.24 0.06 150)",
    "Foreground on accent surfaces.",
    true,
    "oklch(0.90 0.05 150)"
  ),

  // ── Color › Destructive ────────────────────────────────────────────────────
  tok(
    "afenda.color.destructive",
    "color",
    "oklch(0.46 0.205 25)",
    "Destructive action / error state — risk red. Dark enough for white-text AA contrast.",
    true,
    "oklch(0.42 0.19 25)"
  ),
  tok(
    "afenda.color.destructive.foreground",
    "color",
    "oklch(0.985 0.005 95)",
    "Foreground on destructive surfaces.",
    true,
    "oklch(0.965 0.006 85)"
  ),

  // ── Color › Border ─────────────────────────────────────────────────────────
  tok(
    "afenda.color.border.default",
    "color",
    "oklch(0.895 0.014 245)",
    "Default low-emphasis border.",
    true,
    "oklch(1 0 0 / 10%)"
  ),
  tok(
    "afenda.color.border.muted",
    "color",
    "oklch(0.93 0.01 250)",
    "Subtle border for ghost containers.",
    true,
    "oklch(1 0 0 / 6%)"
  ),
  tok(
    "afenda.color.border.strong",
    "color",
    "oklch(0.82 0.02 245)",
    "High-emphasis border for active controls.",
    true,
    "oklch(1 0 0 / 20%)"
  ),
  tok(
    "afenda.color.border.focus",
    "color",
    "oklch(0.54 0.16 252)",
    "Focus indicator border.",
    true,
    "oklch(0.72 0.14 245)"
  ),

  // ── Color › Chrome ─────────────────────────────────────────────────────────
  tok(
    "afenda.color.input",
    "color",
    "oklch(0.875 0.016 245)",
    "Input border/chrome — slightly stronger than default border.",
    true,
    "oklch(1 0 0 / 15%)"
  ),
  tok(
    "afenda.color.focus.ring",
    "color",
    "oklch(0.54 0.16 252)",
    "Keyboard focus ring indicator.",
    true,
    "oklch(0.72 0.14 245)"
  ),

  // ── Color › Charts ─────────────────────────────────────────────────────────
  tok(
    "afenda.color.chart.1",
    "color",
    "oklch(0.52 0.16 252)",
    "Chart series 1 — authority blue.",
    true,
    "oklch(0.72 0.14 245)"
  ),
  tok(
    "afenda.color.chart.2",
    "color",
    "oklch(0.60 0.13 150)",
    "Chart series 2 — intelligent green.",
    true,
    "oklch(0.72 0.13 150)"
  ),
  tok(
    "afenda.color.chart.3",
    "color",
    "oklch(0.73 0.12 78)",
    "Chart series 3 — warm amber.",
    true,
    "oklch(0.82 0.13 78)"
  ),
  tok(
    "afenda.color.chart.4",
    "color",
    "oklch(0.61 0.16 335)",
    "Chart series 4 — rose.",
    true,
    "oklch(0.72 0.15 330)"
  ),
  tok(
    "afenda.color.chart.5",
    "color",
    "oklch(0.57 0.12 292)",
    "Chart series 5 — violet.",
    true,
    "oklch(0.72 0.12 292)"
  ),

  // ── Color › Sidebar ────────────────────────────────────────────────────────
  tok(
    "afenda.color.sidebar.background",
    "color",
    "oklch(0.978 0.007 85)",
    "Sidebar background — warmer/lighter than main canvas.",
    true,
    "oklch(0.175 0.027 255)"
  ),
  tok(
    "afenda.color.sidebar.foreground",
    "color",
    "oklch(0.22 0.025 255)",
    "Sidebar text.",
    true,
    "oklch(0.94 0.008 85)"
  ),
  tok(
    "afenda.color.sidebar.primary",
    "color",
    "oklch(0.47 0.16 252)",
    "Sidebar primary active item.",
    true,
    "oklch(0.72 0.14 245)"
  ),
  tok(
    "afenda.color.sidebar.primary.foreground",
    "color",
    "oklch(0.985 0.005 95)",
    "Foreground on sidebar primary.",
    true,
    "oklch(0.15 0.025 255)"
  ),
  tok(
    "afenda.color.sidebar.accent",
    "color",
    "oklch(0.94 0.025 150)",
    "Sidebar accent (hover state).",
    true,
    "oklch(0.255 0.04 150)"
  ),
  tok(
    "afenda.color.sidebar.accent.foreground",
    "color",
    "oklch(0.24 0.055 150)",
    "Foreground on sidebar accent.",
    true,
    "oklch(0.92 0.04 150)"
  ),
  tok(
    "afenda.color.sidebar.border",
    "color",
    "oklch(0.895 0.014 245)",
    "Sidebar border.",
    true,
    "oklch(1 0 0 / 10%)"
  ),
  tok(
    "afenda.color.sidebar.ring",
    "color",
    "oklch(0.54 0.16 252)",
    "Sidebar focus ring.",
    true,
    "oklch(0.72 0.14 245)"
  ),

  // ── Status tones › Neutral ─────────────────────────────────────────────────
  tok("afenda.status-tone.neutral.surface",    "statusTone", "oklch(0.966 0.007 248)", "Neutral status surface.",    true, "oklch(0.27 0.018 248)"),
  tok("afenda.status-tone.neutral.foreground", "statusTone", "oklch(0.38 0.022 248)",  "Neutral status foreground.", true, "oklch(0.83 0.018 248)"),
  tok("afenda.status-tone.neutral.border",     "statusTone", "oklch(0.82 0.014 248)",  "Neutral status border.",     true, "oklch(0.40 0.015 248)"),
  tok("afenda.status-tone.neutral.focus",      "statusTone", "oklch(0.64 0.018 248)",  "Neutral status focus ring.", true, "oklch(0.56 0.020 248)"),

  // ── Status tones › Info ────────────────────────────────────────────────────
  tok("afenda.status-tone.info.surface",    "statusTone", "oklch(0.955 0.055 222)", "Informational status surface.",    true, "oklch(0.23 0.050 235)"),
  tok("afenda.status-tone.info.foreground", "statusTone", "oklch(0.38 0.095 222)",  "Informational status foreground.", true, "oklch(0.80 0.095 220)"),
  tok("afenda.status-tone.info.border",     "statusTone", "oklch(0.75 0.085 220)",  "Informational status border.",     true, "oklch(0.42 0.075 228)"),
  tok("afenda.status-tone.info.focus",      "statusTone", "oklch(0.56 0.115 220)",  "Informational status focus ring.", true, "oklch(0.60 0.110 222)"),

  // ── Status tones › Success ─────────────────────────────────────────────────
  tok("afenda.status-tone.success.surface",    "statusTone", "oklch(0.935 0.052 158)", "Successful status surface.",    true, "oklch(0.23 0.050 158)"),
  tok("afenda.status-tone.success.foreground", "statusTone", "oklch(0.32 0.090 155)",  "Successful status foreground.", true, "oklch(0.80 0.098 155)"),
  tok("afenda.status-tone.success.border",     "statusTone", "oklch(0.68 0.080 155)",  "Successful status border.",     true, "oklch(0.40 0.070 155)"),
  tok("afenda.status-tone.success.focus",      "statusTone", "oklch(0.50 0.090 155)",  "Successful status focus ring.", true, "oklch(0.57 0.105 155)"),

  // ── Status tones › Warning ─────────────────────────────────────────────────
  tok("afenda.status-tone.warning.surface",    "statusTone", "oklch(0.930 0.082 80)",  "Warning status surface.",    true, "oklch(0.26 0.060 68)"),
  tok("afenda.status-tone.warning.foreground", "statusTone", "oklch(0.42 0.095 58)",   "Warning status foreground.", true, "oklch(0.85 0.098 80)"),
  tok("afenda.status-tone.warning.border",     "statusTone", "oklch(0.74 0.095 72)",   "Warning status border.",     true, "oklch(0.44 0.085 72)"),
  tok("afenda.status-tone.warning.focus",      "statusTone", "oklch(0.60 0.115 68)",   "Warning status focus ring.", true, "oklch(0.64 0.115 72)"),

  // ── Status tones › Danger ──────────────────────────────────────────────────
  tok("afenda.status-tone.danger.surface",    "statusTone", "oklch(0.955 0.042 22)", "Destructive or error status surface.",    true, "oklch(0.23 0.060 22)"),
  tok("afenda.status-tone.danger.foreground", "statusTone", "oklch(0.36 0.115 22)",  "Destructive or error status foreground.", true, "oklch(0.82 0.110 22)"),
  tok("afenda.status-tone.danger.border",     "statusTone", "oklch(0.68 0.110 20)",  "Destructive or error status border.",     true, "oklch(0.40 0.120 22)"),
  tok("afenda.status-tone.danger.focus",      "statusTone", "oklch(0.52 0.160 25)",  "Destructive or error status focus ring.", true, "oklch(0.58 0.155 25)"),

  // ── Status tones › Forbidden ───────────────────────────────────────────────
  tok("afenda.status-tone.forbidden.surface",    "statusTone", "oklch(0.954 0.025 308)", "Permission denied status surface.",    true, "oklch(0.22 0.048 308)"),
  tok("afenda.status-tone.forbidden.foreground", "statusTone", "oklch(0.33 0.088 305)",  "Permission denied status foreground.", true, "oklch(0.82 0.072 308)"),
  tok("afenda.status-tone.forbidden.border",     "statusTone", "oklch(0.70 0.072 305)",  "Permission denied status border.",     true, "oklch(0.40 0.072 305)"),
  tok("afenda.status-tone.forbidden.focus",      "statusTone", "oklch(0.50 0.105 305)",  "Permission denied status focus ring.", true, "oklch(0.58 0.105 305)"),

  // ── Status tones › Invalid ─────────────────────────────────────────────────
  tok("afenda.status-tone.invalid.surface",    "statusTone", "oklch(0.945 0.058 50)", "Validation failure status surface.",    true, "oklch(0.24 0.058 50)"),
  tok("afenda.status-tone.invalid.foreground", "statusTone", "oklch(0.40 0.100 50)",  "Validation failure status foreground.", true, "oklch(0.84 0.100 50)"),
  tok("afenda.status-tone.invalid.border",     "statusTone", "oklch(0.72 0.095 48)",  "Validation failure status border.",     true, "oklch(0.42 0.090 48)"),
  tok("afenda.status-tone.invalid.focus",      "statusTone", "oklch(0.58 0.118 48)",  "Validation failure status focus ring.", true, "oklch(0.62 0.115 50)"),

  // ── Spacing ────────────────────────────────────────────────────────────────
  tok("afenda.spacing.1", "spacing", "0.25rem", "Smallest governed spacing unit."),
  tok("afenda.spacing.2", "spacing", "0.5rem", "Compact inline spacing."),
  tok("afenda.spacing.3", "spacing", "0.75rem", "Standard inline spacing."),
  tok("afenda.spacing.4", "spacing", "1rem", "Standard block spacing."),
  tok("afenda.spacing.5", "spacing", "1.25rem", "Standard section spacing."),
  tok("afenda.spacing.6", "spacing", "1.5rem", "Generous section spacing."),
  tok("afenda.spacing.8", "spacing", "2rem", "Large layout spacing."),

  // ── Radius ─────────────────────────────────────────────────────────────────
  tok("afenda.radius.base", "radius", "0.875rem", "Base radius — the full scale derives from this via calc()."),
  tok("afenda.radius.none", "radius", "0", "No border radius — sharp edges."),
  tok("afenda.radius.sm", "radius", "calc(0.875rem * 0.6)", "Small radius (~0.525rem)."),
  tok("afenda.radius.md", "radius", "calc(0.875rem * 0.8)", "Medium radius (~0.7rem)."),
  tok("afenda.radius.lg", "radius", "0.875rem", "Large radius — cards, overlays (= radius.base)."),
  tok("afenda.radius.xl", "radius", "calc(0.875rem * 1.4)", "Extra-large radius (~1.225rem)."),
  tok("afenda.radius.2xl", "radius", "calc(0.875rem * 1.8)", "2XL radius (~1.575rem)."),
  tok("afenda.radius.full", "radius", "9999px", "Fully rounded — pills and circular controls."),

  // ── Shadow › Full elevation scale ──────────────────────────────────────────
  tok("afenda.shadow.none", "shadow", "none", "No elevation — flat surface."),
  tok(
    "afenda.shadow.2xs",
    "shadow",
    "0 1px 2px 0 oklch(0 0 0 / 0.04)",
    "Micro shadow — barely visible lift.",
    true,
    "0 1px 2px 0 oklch(0 0 0 / 0.18)"
  ),
  tok(
    "afenda.shadow.xs",
    "shadow",
    "0 1px 2px 0 oklch(0 0 0 / 0.05)",
    "Extra-small shadow.",
    true,
    "0 1px 2px 0 oklch(0 0 0 / 0.20)"
  ),
  tok(
    "afenda.shadow.sm",
    "shadow",
    "0 1px 3px 0 oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08)",
    "Small shadow for input controls and chips.",
    true,
    "0 1px 3px 0 oklch(0 0 0 / 0.24), 0 1px 2px -1px oklch(0 0 0 / 0.20)"
  ),
  tok(
    "afenda.shadow.base",
    "shadow",
    "0 1px 3px 0 oklch(0 0 0 / 0.09), 0 1px 2px -1px oklch(0 0 0 / 0.09)",
    "Default shadow — enterprise panels and cards.",
    true,
    "0 1px 3px 0 oklch(0 0 0 / 0.26), 0 1px 2px -1px oklch(0 0 0 / 0.22)"
  ),
  tok(
    "afenda.shadow.md",
    "shadow",
    "0 4px 8px -4px oklch(0 0 0 / 0.12), 0 2px 4px -2px oklch(0 0 0 / 0.08)",
    "Medium shadow — floating elements, popovers.",
    true,
    "0 4px 8px -4px oklch(0 0 0 / 0.34), 0 2px 4px -2px oklch(0 0 0 / 0.26)"
  ),
  tok(
    "afenda.shadow.lg",
    "shadow",
    "0 12px 20px -12px oklch(0 0 0 / 0.18), 0 4px 8px -4px oklch(0 0 0 / 0.10)",
    "Large shadow — dialogs, dropdowns.",
    true,
    "0 12px 20px -12px oklch(0 0 0 / 0.42), 0 4px 8px -4px oklch(0 0 0 / 0.32)"
  ),
  tok(
    "afenda.shadow.xl",
    "shadow",
    "0 20px 28px -16px oklch(0 0 0 / 0.22), 0 8px 12px -8px oklch(0 0 0 / 0.12)",
    "Extra-large shadow — modals.",
    true,
    "0 20px 28px -16px oklch(0 0 0 / 0.48), 0 8px 12px -8px oklch(0 0 0 / 0.36)"
  ),
  tok(
    "afenda.shadow.2xl",
    "shadow",
    "0 28px 48px -24px oklch(0 0 0 / 0.28)",
    "Maximum shadow — full-screen overlays.",
    true,
    "0 28px 48px -24px oklch(0 0 0 / 0.56)"
  ),
  tok(
    "afenda.shadow.focus",
    "shadow",
    "0 0 0 3px oklch(0.54 0.16 252 / 0.35)",
    "Focus ring shadow for keyboard navigation.",
    true,
    "0 0 0 3px oklch(0.72 0.14 245 / 0.40)"
  ),

  // ── Legacy shadow aliases (backward-compat — prefer the scale above) ────────
  tok(
    "afenda.shadow.raised",
    "shadow",
    "0 1px 3px 0 oklch(0 0 0 / 0.09), 0 1px 2px -1px oklch(0 0 0 / 0.09)",
    "@deprecated Use afenda.shadow.base. Low-elevation enterprise panel shadow.",
    true,
    "0 1px 3px 0 oklch(0 0 0 / 0.26), 0 1px 2px -1px oklch(0 0 0 / 0.22)"
  ),
  tok(
    "afenda.shadow.overlay",
    "shadow",
    "0 12px 20px -12px oklch(0 0 0 / 0.18), 0 4px 8px -4px oklch(0 0 0 / 0.10)",
    "@deprecated Use afenda.shadow.lg. High-elevation dialog/overlay shadow.",
    true,
    "0 12px 20px -12px oklch(0 0 0 / 0.42), 0 4px 8px -4px oklch(0 0 0 / 0.32)"
  ),

  // ── Font stacks ────────────────────────────────────────────────────────────
  tok(
    "afenda.font.sans",
    "font",
    "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    "Default sans-serif font stack."
  ),
  tok(
    "afenda.font.mono",
    "font",
    "ui-monospace, 'JetBrains Mono', 'Fira Code', Menlo, Consolas, 'Courier New', monospace",
    "Monospace font stack — code, pre, kbd."
  ),
  tok(
    "afenda.font.heading",
    "font",
    "var(--afenda-font-sans)",
    "Heading font stack — defaults to sans. Override with next/font injection."
  ),
  tok(
    "afenda.font.body",
    "font",
    "var(--afenda-font-sans)",
    "Body font stack — defaults to sans. Override with next/font injection."
  ),

  // ── Typography › Font size ─────────────────────────────────────────────────
  tok("afenda.typography.font-size.body.xs",    "typography", "0.75rem",  "Font size: extra-small body text."),
  tok("afenda.typography.font-size.body.sm",    "typography", "0.875rem", "Font size: compact body text."),
  tok("afenda.typography.font-size.body.md",    "typography", "1rem",     "Font size: default body text."),
  tok("afenda.typography.font-size.label.sm",   "typography", "0.75rem",  "Font size: small control label."),
  tok("afenda.typography.font-size.label.md",   "typography", "0.875rem", "Font size: default control label."),
  tok("afenda.typography.font-size.heading.sm", "typography", "1rem",     "Font size: small section heading."),
  tok("afenda.typography.font-size.heading.md", "typography", "1.25rem",  "Font size: default section heading."),

  // ── Typography › Line height ───────────────────────────────────────────────
  tok("afenda.typography.line-height.body.xs",    "typography", "1rem",    "Line height: extra-small body text."),
  tok("afenda.typography.line-height.body.sm",    "typography", "1.25rem", "Line height: compact body text."),
  tok("afenda.typography.line-height.body.md",    "typography", "1.5rem",  "Line height: default body text."),
  tok("afenda.typography.line-height.label.sm",   "typography", "1rem",    "Line height: small control label."),
  tok("afenda.typography.line-height.label.md",   "typography", "1rem",    "Line height: default control label."),
  tok("afenda.typography.line-height.heading.sm", "typography", "1.25rem", "Line height: small section heading."),
  tok("afenda.typography.line-height.heading.md", "typography", "1.5rem",  "Line height: default section heading."),

  // ── Typography › Font weight ───────────────────────────────────────────────
  tok("afenda.typography.font-weight.body.xs",    "typography", "400", "Font weight: extra-small body text."),
  tok("afenda.typography.font-weight.body.sm",    "typography", "400", "Font weight: compact body text."),
  tok("afenda.typography.font-weight.body.md",    "typography", "400", "Font weight: default body text."),
  tok("afenda.typography.font-weight.label.sm",   "typography", "500", "Font weight: small control label."),
  tok("afenda.typography.font-weight.label.md",   "typography", "600", "Font weight: default control label."),
  tok("afenda.typography.font-weight.heading.sm", "typography", "600", "Font weight: small section heading."),
  tok("afenda.typography.font-weight.heading.md", "typography", "600", "Font weight: default section heading."),

  // ── Motion › Duration ──────────────────────────────────────────────────────
  tok("afenda.motion.duration.instant", "motion", "0ms", "Zero-duration for programmatic state changes."),
  tok("afenda.motion.duration.fast", "motion", "120ms", "Fast control feedback (hover, press, focus)."),
  tok("afenda.motion.duration.normal", "motion", "160ms", "Overlay and dialog entrance/exit."),
  tok("afenda.motion.duration.slow", "motion", "200ms", "Page-level navigation transitions."),

  // ── Motion › Easing ────────────────────────────────────────────────────────
  tok("afenda.motion.easing.standard", "motion", "cubic-bezier(0.2, 0, 0, 1)", "Standard motion easing."),
  tok("afenda.motion.easing.emphasized", "motion", "cubic-bezier(0.05, 0.7, 0.1, 1)", "Emphasized motion easing for hero transitions."),

  // ── Density › Control height ──────────────────────────────────────────────
  tok("afenda.density.compact.control-height",     "density", "32px",                      "Compact: interactive control height."),
  tok("afenda.density.standard.control-height",    "density", "36px",                      "Standard: interactive control height."),
  tok("afenda.density.comfortable.control-height", "density", "44px",                      "Comfortable: interactive control height (≥ WCAG 2.5.5 touch target)."),

  // ── Density › Gap ─────────────────────────────────────────────────────────
  tok("afenda.density.compact.gap",                "density", "var(--afenda-spacing-2)",   "Compact: component internal gap."),
  tok("afenda.density.standard.gap",               "density", "var(--afenda-spacing-3)",   "Standard: component internal gap."),
  tok("afenda.density.comfortable.gap",            "density", "var(--afenda-spacing-4)",   "Comfortable: component internal gap."),

  // ── Density › Padding X ───────────────────────────────────────────────────
  tok("afenda.density.compact.padding-x",          "density", "var(--afenda-spacing-2)",   "Compact: horizontal padding for controls."),
  tok("afenda.density.standard.padding-x",         "density", "var(--afenda-spacing-3)",   "Standard: horizontal padding for controls."),
  tok("afenda.density.comfortable.padding-x",      "density", "var(--afenda-spacing-4)",   "Comfortable: horizontal padding for controls."),

  // ── Chart › Infrastructure ────────────────────────────────────────────────
  tok("afenda.chart.background",         "chart", "var(--afenda-color-surface-card)",    "Chart plot background surface."),
  tok("afenda.chart.foreground",         "chart", "var(--afenda-color-text-default)",    "Chart primary text and axis labels."),
  tok("afenda.chart.muted-foreground",   "chart", "var(--afenda-color-text-muted)",      "Chart secondary text — tick labels, legends."),
  tok("afenda.chart.grid-line",          "chart", "var(--afenda-color-border-muted)",    "Chart grid line stroke."),
  tok("afenda.chart.axis-line",          "chart", "var(--afenda-color-border-default)",  "Chart axis line stroke."),
  tok("afenda.chart.axis-label",         "chart", "var(--afenda-color-text-muted)",      "Chart axis value labels."),
  tok("afenda.chart.tooltip-background", "chart", "var(--afenda-color-surface-popover)", "Chart tooltip surface."),
  tok("afenda.chart.tooltip-foreground", "chart", "var(--afenda-color-text-default)",    "Chart tooltip text."),

  // ── Chart › Series aliases ─────────────────────────────────────────────────
  tok("afenda.chart.series.1", "chart", "var(--afenda-color-chart-1)", "Chart data series 1 — authority blue."),
  tok("afenda.chart.series.2", "chart", "var(--afenda-color-chart-2)", "Chart data series 2 — intelligent green."),
  tok("afenda.chart.series.3", "chart", "var(--afenda-color-chart-3)", "Chart data series 3 — warm amber."),
  tok("afenda.chart.series.4", "chart", "var(--afenda-color-chart-4)", "Chart data series 4 — rose."),
  tok("afenda.chart.series.5", "chart", "var(--afenda-color-chart-5)", "Chart data series 5 — violet."),

  // ── Chart › Semantic thresholds ───────────────────────────────────────────
  tok("afenda.chart.threshold.success", "chart", "var(--afenda-status-tone-success-focus)", "Chart threshold line: within target (green)."),
  tok("afenda.chart.threshold.warning", "chart", "var(--afenda-status-tone-warning-focus)", "Chart threshold line: approaching limit (amber)."),
  tok("afenda.chart.threshold.danger",  "chart", "var(--afenda-status-tone-danger-focus)",  "Chart threshold line: breached limit (red)."),

  // ── Layout ─────────────────────────────────────────────────────────────────
  tok(
    "afenda.layout.touch-target.minimum",
    "layout",
    "44px",
    "Minimum touch target size for accessible interactive controls (WCAG 2.5.5)."
  ),
] as const satisfies readonly TokenDefinition[];

// ─── Named export sets ────────────────────────────────────────────────────────

/** Canonical token registry. Use this as the single source of truth. */
export const AFENDA_TOKEN_REGISTRY = {
  categories: TOKEN_CATEGORIES,
  statusTones: STATUS_TONES,
  densities: DENSITIES,
  sizes: SIZES,
  radii: RADII,
  shadows: SHADOWS,
  tokens,
} as const satisfies TokenRegistry;

/** Tuple of every governed token name — useful for validation and type-level checks. */
export const AFENDA_TOKEN_NAMES = tokens.map(
  (t) => t.name
) as readonly AfendaTokenName[];

/** Tuple of every governed CSS variable name — for CSS generation and audits. */
export const AFENDA_CSS_VARIABLES = tokens.map(
  (t) => t.cssVariable
) as readonly AfendaCssVariableName[];

// ─── Legacy alias (backward-compat for existing index.ts imports) ─────────────

/**
 * @deprecated Use `AFENDA_TOKEN_REGISTRY` instead.
 * Kept for backward-compatibility with existing consumers.
 */
export const tokenRegistry = AFENDA_TOKEN_REGISTRY;
