import {
  type AfendaCssVariableName,
  type AfendaTokenName,
  assertAfendaTokenName,
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
  type TokenDefinition,
  type TokenRegistry,
  tokenNameToCssVariable,
} from "../contracts/token.contract";

/**
 * Afenda ERP v2 token authority (TIP-004B, hardened).
 *
 * Single source of truth for every governed design value. `generate-tokens-css`
 * reverse-renders this registry into:
 *   src/css/afenda-tokens.css          (raw --afenda-* vars, grouped by `group`)
 *   src/css/afenda-design-system.css   (Parts A–D, full Tailwind v4 theme)
 *
 * Authority layers (mirrors the generated CSS section order):
 *   RAW       literal oklch()/px/rem values — light in `value`, dark in `darkValue`
 *   SEMANTIC  intent aliases — `var(--afenda-*)`, never new literals, no darkValue
 *   ERP STATE operational surface states — RAW literals with dark overrides
 *   VIZ ACPA  chart/KPI/trend/approval/forecast/finance/timeline — `var()` aliases
 *   SCALES    typography, spacing, radius, border-width, shadow, motion, density,
 *             z-index, opacity, layout — mode-agnostic (shadow alpha deepens in dark)
 *
 * Palette direction — Afenda ERP v2 (approved):
 *   deep sapphire primary · warm off-white canvas · deep blue-slate dark canvas ·
 *   forest green success · controlled amber warning · clear risk red danger ·
 *   royal violet forbidden · cool stone neutral structure.
 */

// ─── Builders ───────────────────────────────────────────────────────────────

/** [name, lightValue, darkValue | null, description] */
type TokenEntry = readonly [
  name: string,
  value: string,
  darkValue: string | null,
  description: string,
];

/**
 * Expands a section of entries into fully-typed `TokenDefinition`s, computing
 * the CSS variable from the name and attaching the section `group` label that
 * the generator uses to reconstruct comment banners.
 */
function section(
  category: TokenDefinition["category"],
  group: string,
  entries: readonly TokenEntry[]
): readonly TokenDefinition[] {
  return entries.map(([name, value, darkValue, description]) => {
    assertAfendaTokenName(name);
    const base: TokenDefinition = {
      name,
      cssVariable: tokenNameToCssVariable(name) as AfendaCssVariableName,
      category,
      value,
      description,
      group,
      stable: true,
      public: true,
    };
    return darkValue === null ? base : { ...base, darkValue };
  });
}

// ─── Token list ───────────────────────────────────────────────────────────────

const tokens: readonly TokenDefinition[] = [
  // ════════════════════════════════ RAW · COLOR ════════════════════════════════
  ...section("color", "RAW · Surfaces", [
    ["afenda.color.surface.canvas", "oklch(0.984 0.005 80)", "oklch(0.130 0.024 256)", "Warm off-white page canvas; deep blue-slate in dark."],
    ["afenda.color.surface.sunken", "oklch(0.960 0.009 82)", "oklch(0.100 0.020 256)", "Recessed well — filter bars, sunken inputs."],
    ["afenda.color.surface.card", "oklch(0.999 0.001 85)", "oklch(0.162 0.022 256)", "Card surface — clearly above canvas."],
    ["afenda.color.surface.raised", "oklch(1.000 0.000 0)", "oklch(0.188 0.020 256)", "Raised surface — tooltips, raised panels."],
    ["afenda.color.surface.muted", "oklch(0.956 0.008 82)", "oklch(0.148 0.020 256)", "Muted surface — table alt-rows, section bg."],
    ["afenda.color.surface.popover", "oklch(1.000 0.000 0)", "oklch(0.178 0.022 256)", "Popover / dropdown / command palette surface."],
    ["afenda.color.surface.inverse", "oklch(0.150 0.022 256)", "oklch(0.970 0.004 90)", "Inverted chip surface (dark on light)."],
    ["afenda.color.surface.overlay", "oklch(0.150 0.022 256)", "oklch(0.090 0.018 256)", "Scrim / backdrop fill."],
    ["afenda.color.surface.header", "oklch(0.993 0.003 82)", "oklch(0.148 0.022 256)", "AppShell sticky header surface."],
    ["afenda.color.surface.hover", "oklch(0.963 0.007 84)", "oklch(0.198 0.018 256)", "Row / item hover highlight."],
    ["afenda.color.surface.selected", "oklch(0.946 0.022 250)", "oklch(0.202 0.038 254)", "Row / item selected state."],
  ]),
  ...section("color", "RAW · Text", [
    ["afenda.color.text.default", "oklch(0.148 0.022 256)", "oklch(0.952 0.004 90)", "Primary readable foreground — blue-ink near-black."],
    ["afenda.color.text.muted", "oklch(0.440 0.018 248)", "oklch(0.680 0.016 250)", "Secondary labels, metadata."],
    ["afenda.color.text.subtle", "oklch(0.530 0.014 248)", "oklch(0.598 0.014 250)", "Tertiary / supporting text."],
    ["afenda.color.text.placeholder", "oklch(0.620 0.011 248)", "oklch(0.518 0.011 250)", "Input placeholder text."],
    ["afenda.color.text.inverse", "oklch(0.985 0.003 90)", "oklch(0.120 0.022 256)", "Text on dark / inverse surfaces."],
    ["afenda.color.text.disabled", "oklch(0.680 0.010 248)", "oklch(0.418 0.011 248)", "Disabled control text."],
    ["afenda.color.text.link", "oklch(0.460 0.175 254)", "oklch(0.720 0.162 254)", "Sapphire link colour."],
  ]),
  ...section("color", "RAW · Brand · Primary", [
    ["afenda.color.primary", "oklch(0.450 0.185 254)", "oklch(0.598 0.182 254)", "Authority sapphire — primary action."],
    ["afenda.color.primary.foreground", "oklch(1.000 0.000 0)", "oklch(0.100 0.020 256)", "Foreground on primary."],
    ["afenda.color.primary.hover", "oklch(0.400 0.178 254)", "oklch(0.648 0.175 254)", "Primary hover state."],
    ["afenda.color.primary.active", "oklch(0.355 0.168 254)", "oklch(0.698 0.165 254)", "Primary pressed state."],
    ["afenda.color.primary.subtle", "oklch(0.942 0.030 252)", "oklch(0.218 0.048 254)", "Ghost badge container."],
    ["afenda.color.primary.subtle.foreground", "oklch(0.390 0.165 254)", "oklch(0.748 0.162 254)", "Text on subtle primary container."],
  ]),
  ...section("color", "RAW · Brand · Secondary", [
    ["afenda.color.secondary", "oklch(0.940 0.015 238)", "oklch(0.238 0.022 256)", "Cool blue-slate secondary surface."],
    ["afenda.color.secondary.foreground", "oklch(0.218 0.032 252)", "oklch(0.878 0.010 248)", "Foreground on secondary."],
  ]),
  ...section("color", "RAW · Brand · Accent", [
    ["afenda.color.accent", "oklch(0.928 0.042 152)", "oklch(0.258 0.042 152)", "Operational forest-green accent surface."],
    ["afenda.color.accent.foreground", "oklch(0.218 0.058 152)", "oklch(0.718 0.120 152)", "Foreground on accent."],
  ]),
  ...section("color", "RAW · Risk · Destructive", [
    ["afenda.color.destructive", "oklch(0.468 0.210 27)", "oklch(0.548 0.218 27)", "Decisive risk red."],
    ["afenda.color.destructive.foreground", "oklch(1.000 0.000 0)", "oklch(0.100 0.018 30)", "Foreground on destructive."],
    ["afenda.color.destructive.hover", "oklch(0.420 0.202 27)", "oklch(0.598 0.212 27)", "Destructive hover."],
    ["afenda.color.destructive.active", "oklch(0.372 0.190 27)", "oklch(0.638 0.200 27)", "Destructive pressed."],
  ]),
  ...section("color", "RAW · Border & chrome", [
    ["afenda.color.border.default", "oklch(0.888 0.013 244)", "oklch(0.278 0.022 254)", "Standard divider border."],
    ["afenda.color.border.muted", "oklch(0.928 0.009 248)", "oklch(0.220 0.018 254)", "Very subtle separation."],
    ["afenda.color.border.strong", "oklch(0.800 0.020 244)", "oklch(0.358 0.026 254)", "Emphasis border for active controls."],
    ["afenda.color.border.focus", "oklch(0.500 0.178 254)", "oklch(0.638 0.180 254)", "Keyboard focus indicator border."],
    ["afenda.color.input", "oklch(0.876 0.015 244)", "oklch(0.258 0.020 254)", "Form input border / chrome."],
    ["afenda.color.focus.ring", "oklch(0.500 0.178 254)", "oklch(0.638 0.180 254)", "3px focus ring colour."],
  ]),
  ...section("color", "RAW · Charts · Categorical", [
    ["afenda.color.chart.1", "oklch(0.500 0.172 254)", "oklch(0.618 0.172 254)", "Chart series 1 — sapphire blue."],
    ["afenda.color.chart.2", "oklch(0.570 0.130 152)", "oklch(0.638 0.132 152)", "Chart series 2 — forest green."],
    ["afenda.color.chart.3", "oklch(0.718 0.122 75)", "oklch(0.758 0.130 75)", "Chart series 3 — golden amber."],
    ["afenda.color.chart.4", "oklch(0.595 0.148 340)", "oklch(0.648 0.152 340)", "Chart series 4 — burgundy rose."],
    ["afenda.color.chart.5", "oklch(0.548 0.122 288)", "oklch(0.628 0.124 288)", "Chart series 5 — royal violet."],
    ["afenda.color.chart.6", "oklch(0.576 0.112 197)", "oklch(0.628 0.118 197)", "Chart series 6 — executive teal."],
    ["afenda.color.chart.7", "oklch(0.528 0.042 248)", "oklch(0.578 0.040 250)", "Chart series 7 — warm slate / reference."],
    ["afenda.color.chart.8", "oklch(0.565 0.098 58)", "oklch(0.618 0.100 58)", "Chart series 8 — bronze / financial bench."],
  ]),
  ...section("color", "RAW · Charts · Sequential", [
    ["afenda.color.chart.sequential.1", "oklch(0.918 0.042 252)", "oklch(0.290 0.048 252)", "Sequential ramp — lowest magnitude."],
    ["afenda.color.chart.sequential.2", "oklch(0.818 0.082 252)", "oklch(0.388 0.085 252)", "Sequential ramp — low."],
    ["afenda.color.chart.sequential.3", "oklch(0.692 0.118 253)", "oklch(0.488 0.118 253)", "Sequential ramp — moderate."],
    ["afenda.color.chart.sequential.4", "oklch(0.582 0.150 253)", "oklch(0.578 0.148 253)", "Sequential ramp — high."],
    ["afenda.color.chart.sequential.5", "oklch(0.482 0.168 254)", "oklch(0.668 0.165 254)", "Sequential ramp — very high."],
    ["afenda.color.chart.sequential.6", "oklch(0.372 0.152 254)", "oklch(0.758 0.155 254)", "Sequential ramp — maximum."],
  ]),
  ...section("color", "RAW · Charts · Diverging", [
    ["afenda.color.chart.diverging.neg-3", "oklch(0.478 0.185 27)", "oklch(0.548 0.188 27)", "Diverging — deep deficit."],
    ["afenda.color.chart.diverging.neg-2", "oklch(0.618 0.148 30)", "oklch(0.648 0.150 30)", "Diverging — moderate deficit."],
    ["afenda.color.chart.diverging.neg-1", "oklch(0.762 0.088 38)", "oklch(0.748 0.088 38)", "Diverging — slight deficit."],
    ["afenda.color.chart.diverging.neutral", "oklch(0.878 0.013 248)", "oklch(0.378 0.015 248)", "Diverging — breakeven / zero."],
    ["afenda.color.chart.diverging.pos-1", "oklch(0.782 0.088 152)", "oklch(0.728 0.088 152)", "Diverging — slight surplus."],
    ["afenda.color.chart.diverging.pos-2", "oklch(0.622 0.118 152)", "oklch(0.618 0.118 152)", "Diverging — moderate surplus."],
    ["afenda.color.chart.diverging.pos-3", "oklch(0.470 0.122 152)", "oklch(0.518 0.122 152)", "Diverging — strong surplus."],
  ]),
  ...section("color", "RAW · Trend", [
    ["afenda.color.trend.positive", "oklch(0.498 0.118 152)", "oklch(0.618 0.120 152)", "Positive KPI delta text/icon."],
    ["afenda.color.trend.positive.surface", "oklch(0.935 0.050 155)", "oklch(0.208 0.048 152)", "Positive delta badge background."],
    ["afenda.color.trend.negative", "oklch(0.498 0.190 27)", "oklch(0.618 0.188 27)", "Negative KPI delta text/icon."],
    ["afenda.color.trend.negative.surface", "oklch(0.954 0.042 23)", "oklch(0.208 0.042 24)", "Negative delta badge background."],
    ["afenda.color.trend.neutral", "oklch(0.518 0.016 248)", "oklch(0.618 0.016 248)", "Flat / unchanged delta text."],
    ["afenda.color.trend.neutral.surface", "oklch(0.965 0.008 248)", "oklch(0.208 0.010 248)", "Flat delta badge background."],
  ]),
  ...section("color", "RAW · Sidebar", [
    ["afenda.color.sidebar.background", "oklch(0.972 0.008 244)", "oklch(0.110 0.024 258)", "Sidebar background — cooler than canvas."],
    ["afenda.color.sidebar.foreground", "oklch(0.198 0.026 252)", "oklch(0.900 0.005 90)", "Sidebar text."],
    ["afenda.color.sidebar.primary", "oklch(0.450 0.185 254)", "oklch(0.598 0.182 254)", "Sidebar primary active item."],
    ["afenda.color.sidebar.primary.foreground", "oklch(1.000 0.000 0)", "oklch(0.100 0.020 256)", "Foreground on sidebar primary."],
    ["afenda.color.sidebar.accent", "oklch(0.934 0.028 152)", "oklch(0.240 0.042 152)", "Sidebar accent surface."],
    ["afenda.color.sidebar.accent.foreground", "oklch(0.218 0.055 152)", "oklch(0.718 0.120 152)", "Foreground on sidebar accent."],
    ["afenda.color.sidebar.border", "oklch(0.882 0.013 244)", "oklch(0.220 0.022 256)", "Sidebar separator."],
    ["afenda.color.sidebar.ring", "oklch(0.500 0.178 254)", "oklch(0.638 0.180 254)", "Sidebar focus ring."],
  ]),

  // ══════════════════════════ RAW · STATUS TONES ═══════════════════════════════
  ...section("statusTone", "RAW · Status tone · Neutral", [
    ["afenda.status-tone.neutral.surface", "oklch(0.964 0.007 248)", "oklch(0.208 0.010 252)", "Neutral status surface."],
    ["afenda.status-tone.neutral.foreground", "oklch(0.358 0.020 248)", "oklch(0.798 0.012 248)", "Neutral status foreground."],
    ["afenda.status-tone.neutral.border", "oklch(0.818 0.014 248)", "oklch(0.338 0.014 252)", "Neutral status border."],
    ["afenda.status-tone.neutral.focus", "oklch(0.618 0.017 248)", "oklch(0.558 0.016 248)", "Neutral status focus ring."],
    ["afenda.status-tone.neutral.solid", "oklch(0.438 0.018 248)", "oklch(0.558 0.022 248)", "Neutral solid badge fill."],
    ["afenda.status-tone.neutral.solid-foreground", "oklch(0.985 0.002 90)", "oklch(0.098 0.018 256)", "Foreground on neutral solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Info", [
    ["afenda.status-tone.info.surface", "oklch(0.950 0.050 226)", "oklch(0.200 0.042 228)", "Info status surface."],
    ["afenda.status-tone.info.foreground", "oklch(0.342 0.088 228)", "oklch(0.778 0.092 226)", "Info status foreground."],
    ["afenda.status-tone.info.border", "oklch(0.738 0.082 224)", "oklch(0.348 0.088 226)", "Info status border."],
    ["afenda.status-tone.info.focus", "oklch(0.518 0.112 226)", "oklch(0.578 0.122 228)", "Info status focus ring."],
    ["afenda.status-tone.info.solid", "oklch(0.458 0.138 240)", "oklch(0.578 0.162 254)", "Info solid badge fill (AA vs white)."],
    ["afenda.status-tone.info.solid-foreground", "oklch(1.000 0.000 0)", "oklch(0.098 0.018 256)", "Foreground on info solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Success", [
    ["afenda.status-tone.success.surface", "oklch(0.942 0.048 152)", "oklch(0.200 0.045 148)", "Success status surface."],
    ["afenda.status-tone.success.foreground", "oklch(0.318 0.096 152)", "oklch(0.758 0.102 152)", "Success status foreground."],
    ["afenda.status-tone.success.border", "oklch(0.718 0.092 152)", "oklch(0.348 0.092 150)", "Success status border."],
    ["afenda.status-tone.success.focus", "oklch(0.518 0.110 152)", "oklch(0.558 0.122 152)", "Success status focus ring."],
    ["afenda.status-tone.success.solid", "oklch(0.468 0.132 152)", "oklch(0.568 0.135 152)", "Success solid badge fill (AA vs white)."],
    ["afenda.status-tone.success.solid-foreground", "oklch(1.000 0.000 0)", "oklch(0.098 0.018 152)", "Foreground on success solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Warning", [
    ["afenda.status-tone.warning.surface", "oklch(0.952 0.065 74)", "oklch(0.198 0.052 68)", "Warning status surface."],
    ["afenda.status-tone.warning.foreground", "oklch(0.378 0.110 65)", "oklch(0.818 0.112 72)", "Warning status foreground."],
    ["afenda.status-tone.warning.border", "oklch(0.782 0.102 70)", "oklch(0.378 0.108 68)", "Warning status border."],
    ["afenda.status-tone.warning.focus", "oklch(0.598 0.122 70)", "oklch(0.628 0.132 68)", "Warning status focus ring."],
    ["afenda.status-tone.warning.solid", "oklch(0.648 0.162 62)", "oklch(0.698 0.162 65)", "Warning solid badge fill (dark fg)."],
    ["afenda.status-tone.warning.solid-foreground", "oklch(0.148 0.022 58)", "oklch(0.118 0.022 60)", "Foreground on warning solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Danger", [
    ["afenda.status-tone.danger.surface", "oklch(0.952 0.042 24)", "oklch(0.198 0.042 24)", "Danger status surface."],
    ["afenda.status-tone.danger.foreground", "oklch(0.350 0.162 26)", "oklch(0.798 0.152 27)", "Danger status foreground."],
    ["afenda.status-tone.danger.border", "oklch(0.748 0.122 26)", "oklch(0.378 0.162 26)", "Danger status border."],
    ["afenda.status-tone.danger.focus", "oklch(0.530 0.182 26)", "oklch(0.578 0.188 26)", "Danger status focus ring."],
    ["afenda.status-tone.danger.solid", "oklch(0.468 0.210 27)", "oklch(0.558 0.215 27)", "Danger solid badge fill (AA vs white)."],
    ["afenda.status-tone.danger.solid-foreground", "oklch(1.000 0.000 0)", "oklch(0.980 0.002 90)", "Foreground on danger solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Critical", [
    ["afenda.status-tone.critical.surface", "oklch(0.948 0.048 18)", "oklch(0.188 0.048 18)", "Critical failure surface — deeper than danger."],
    ["afenda.status-tone.critical.foreground", "oklch(0.328 0.178 18)", "oklch(0.828 0.168 20)", "Critical status foreground."],
    ["afenda.status-tone.critical.border", "oklch(0.718 0.142 20)", "oklch(0.368 0.178 18)", "Critical status border."],
    ["afenda.status-tone.critical.focus", "oklch(0.498 0.198 20)", "oklch(0.548 0.192 20)", "Critical status focus ring."],
    ["afenda.status-tone.critical.solid", "oklch(0.398 0.218 18)", "oklch(0.488 0.212 18)", "Critical solid badge fill."],
    ["afenda.status-tone.critical.solid-foreground", "oklch(1.000 0.000 0)", "oklch(0.980 0.002 90)", "Foreground on critical solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Pending", [
    ["afenda.status-tone.pending.surface", "oklch(0.956 0.058 78)", "oklch(0.198 0.052 72)", "Pending / awaiting approval surface."],
    ["afenda.status-tone.pending.foreground", "oklch(0.388 0.108 68)", "oklch(0.808 0.112 72)", "Pending status foreground."],
    ["afenda.status-tone.pending.border", "oklch(0.768 0.098 70)", "oklch(0.368 0.102 68)", "Pending status border."],
    ["afenda.status-tone.pending.focus", "oklch(0.578 0.118 68)", "oklch(0.618 0.122 70)", "Pending status focus ring."],
    ["afenda.status-tone.pending.solid", "oklch(0.588 0.142 65)", "oklch(0.648 0.148 68)", "Pending solid badge fill."],
    ["afenda.status-tone.pending.solid-foreground", "oklch(0.148 0.022 58)", "oklch(0.118 0.022 60)", "Foreground on pending solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Forbidden", [
    ["afenda.status-tone.forbidden.surface", "oklch(0.952 0.040 286)", "oklch(0.198 0.040 286)", "Forbidden status surface."],
    ["afenda.status-tone.forbidden.foreground", "oklch(0.328 0.094 286)", "oklch(0.778 0.112 286)", "Forbidden status foreground."],
    ["afenda.status-tone.forbidden.border", "oklch(0.718 0.088 286)", "oklch(0.358 0.092 286)", "Forbidden status border."],
    ["afenda.status-tone.forbidden.focus", "oklch(0.518 0.122 286)", "oklch(0.578 0.128 286)", "Forbidden status focus ring."],
    ["afenda.status-tone.forbidden.solid", "oklch(0.458 0.142 286)", "oklch(0.558 0.158 286)", "Forbidden solid badge fill (AA vs white)."],
    ["afenda.status-tone.forbidden.solid-foreground", "oklch(1.000 0.000 0)", "oklch(0.980 0.002 90)", "Foreground on forbidden solid."],
  ]),
  ...section("statusTone", "RAW · Status tone · Invalid", [
    ["afenda.status-tone.invalid.surface", "oklch(0.952 0.052 40)", "oklch(0.200 0.042 40)", "Invalid status surface."],
    ["afenda.status-tone.invalid.foreground", "oklch(0.348 0.122 38)", "oklch(0.798 0.112 40)", "Invalid status foreground."],
    ["afenda.status-tone.invalid.border", "oklch(0.738 0.112 38)", "oklch(0.358 0.112 38)", "Invalid status border."],
    ["afenda.status-tone.invalid.focus", "oklch(0.538 0.148 38)", "oklch(0.568 0.148 38)", "Invalid status focus ring."],
    ["afenda.status-tone.invalid.solid", "oklch(0.535 0.162 38)", "oklch(0.598 0.158 38)", "Invalid solid badge fill (AA vs white)."],
    ["afenda.status-tone.invalid.solid-foreground", "oklch(1.000 0.000 0)", "oklch(0.098 0.018 38)", "Foreground on invalid solid."],
  ]),

  // ════════════════════════════════ SEMANTIC ═══════════════════════════════════
  // Semantic tokens reference RAW via var() only — no darkValue (theme switches at RAW).
  ...section("color", "SEMANTIC · Surface stack", [
    ["afenda.semantic.surface.canvas", "var(--afenda-color-surface-canvas)", null, "Page canvas — lowest elevation."],
    ["afenda.semantic.surface.raised", "var(--afenda-color-surface-raised)", null, "Raised panel — cards, tooltips."],
    ["afenda.semantic.surface.card", "var(--afenda-color-surface-card)", null, "Card surface — grouped content."],
    ["afenda.semantic.surface.overlay", "var(--afenda-color-surface-popover)", null, "Modal / popover / sheet surface."],
    ["afenda.semantic.surface.sunken", "var(--afenda-color-surface-sunken)", null, "Recessed well — filters, inset areas."],
    ["afenda.semantic.surface.inverse", "var(--afenda-color-surface-inverse)", null, "Inverted block — chips, tooltips on light."],
    ["afenda.semantic.surface.muted", "var(--afenda-color-surface-muted)", null, "Muted background — alt rows, sections."],
    ["afenda.semantic.surface.hover", "var(--afenda-color-surface-hover)", null, "Generic hover surface."],
    ["afenda.semantic.surface.selected", "var(--afenda-color-surface-selected)", null, "Generic selected surface."],
  ]),
  ...section("color", "SEMANTIC · Text roles", [
    ["afenda.semantic.text.primary", "var(--afenda-color-text-default)", null, "Primary readable text."],
    ["afenda.semantic.text.secondary", "var(--afenda-color-text-muted)", null, "Secondary labels, metadata."],
    ["afenda.semantic.text.tertiary", "var(--afenda-color-text-subtle)", null, "Tertiary / supporting text."],
    ["afenda.semantic.text.placeholder", "var(--afenda-color-text-placeholder)", null, "Input placeholder text."],
    ["afenda.semantic.text.inverse", "var(--afenda-color-text-inverse)", null, "Text on dark / inverse surfaces."],
    ["afenda.semantic.text.disabled", "var(--afenda-color-text-disabled)", null, "Disabled control text."],
    ["afenda.semantic.text.link", "var(--afenda-color-text-link)", null, "Interactive link text."],
    ["afenda.semantic.text.on-accent", "var(--afenda-color-primary-foreground)", null, "Text on accent / primary fill."],
  ]),
  ...section("color", "SEMANTIC · Border roles", [
    ["afenda.semantic.border.subtle", "var(--afenda-color-border-muted)", null, "Very subtle separation."],
    ["afenda.semantic.border.default", "var(--afenda-color-border-default)", null, "Standard divider border."],
    ["afenda.semantic.border.strong", "var(--afenda-color-border-strong)", null, "Emphasis border for active controls."],
    ["afenda.semantic.border.focus", "var(--afenda-color-border-focus)", null, "Keyboard focus indicator border."],
    ["afenda.semantic.border.error", "var(--afenda-status-tone-invalid-border)", null, "Validation error border."],
  ]),
  ...section("color", "SEMANTIC · Brand roles", [
    ["afenda.semantic.brand.default", "var(--afenda-color-primary)", null, "Primary brand fill."],
    ["afenda.semantic.brand.emphasis", "var(--afenda-color-primary-hover)", null, "Brand emphasis / hover."],
    ["afenda.semantic.brand.muted", "var(--afenda-color-primary-subtle)", null, "Muted brand container."],
    ["afenda.semantic.brand.subtle", "var(--afenda-color-primary-subtle)", null, "Subtle brand background."],
    ["afenda.semantic.brand.contrast", "var(--afenda-color-primary-foreground)", null, "Foreground on brand fill."],
  ]),
  ...section("color", "SEMANTIC · Accent roles", [
    ["afenda.semantic.accent.bg", "var(--afenda-color-primary)", null, "Primary accent fill."],
    ["afenda.semantic.accent.bg-hover", "var(--afenda-color-primary-hover)", null, "Primary accent hover fill."],
    ["afenda.semantic.accent.bg-active", "var(--afenda-color-primary-active)", null, "Primary accent pressed fill."],
    ["afenda.semantic.accent.text", "var(--afenda-color-primary-foreground)", null, "Text on accent fill."],
    ["afenda.semantic.accent.border", "var(--afenda-color-border-focus)", null, "Accent outline border."],
  ]),
  ...section("color", "SEMANTIC · Action & overlay", [
    ["afenda.semantic.action.primary.subtle", "var(--afenda-color-primary-subtle)", null, "Subtle primary action container."],
    ["afenda.semantic.action.primary.surface", "var(--afenda-color-primary)", null, "Solid primary action fill."],
    ["afenda.semantic.overlay.scrim", "var(--afenda-color-surface-overlay)", null, "Overlay scrim fill."],
  ]),
  ...section("shadow", "SEMANTIC · Elevation", [
    ["afenda.semantic.elevation.flat", "var(--afenda-shadow-none)", null, "No elevation — flat surface."],
    ["afenda.semantic.elevation.raised", "var(--afenda-shadow-base)", null, "Raised panel — cards, panels."],
    ["afenda.semantic.elevation.overlay", "var(--afenda-shadow-lg)", null, "Overlay elevation — popovers, dropdowns."],
    ["afenda.semantic.elevation.modal", "var(--afenda-shadow-xl)", null, "Modal / dialog elevation."],
    ["afenda.semantic.elevation.focus", "var(--afenda-shadow-focus)", null, "Focus ring elevation."],
  ]),
  ...section("color", "SEMANTIC · Status roles", [
    ["afenda.semantic.status.success.bg", "var(--afenda-status-tone-success-surface)", null, "Success status background."],
    ["afenda.semantic.status.success.text", "var(--afenda-status-tone-success-foreground)", null, "Success status text."],
    ["afenda.semantic.status.success.border", "var(--afenda-status-tone-success-border)", null, "Success status border."],
    ["afenda.semantic.status.warning.bg", "var(--afenda-status-tone-warning-surface)", null, "Warning status background."],
    ["afenda.semantic.status.warning.text", "var(--afenda-status-tone-warning-foreground)", null, "Warning status text."],
    ["afenda.semantic.status.warning.border", "var(--afenda-status-tone-warning-border)", null, "Warning status border."],
    ["afenda.semantic.status.error.bg", "var(--afenda-status-tone-danger-surface)", null, "Error / danger status background."],
    ["afenda.semantic.status.error.text", "var(--afenda-status-tone-danger-foreground)", null, "Error / danger status text."],
    ["afenda.semantic.status.error.border", "var(--afenda-status-tone-danger-border)", null, "Error / danger status border."],
    ["afenda.semantic.status.info.bg", "var(--afenda-status-tone-info-surface)", null, "Info status background."],
    ["afenda.semantic.status.info.text", "var(--afenda-status-tone-info-foreground)", null, "Info status text."],
    ["afenda.semantic.status.info.border", "var(--afenda-status-tone-info-border)", null, "Info status border."],
    ["afenda.semantic.status.critical.bg", "var(--afenda-status-tone-critical-surface)", null, "Critical status background."],
    ["afenda.semantic.status.critical.text", "var(--afenda-status-tone-critical-foreground)", null, "Critical status text."],
    ["afenda.semantic.status.critical.border", "var(--afenda-status-tone-critical-border)", null, "Critical status border."],
    ["afenda.semantic.status.pending.bg", "var(--afenda-status-tone-pending-surface)", null, "Pending status background."],
    ["afenda.semantic.status.pending.text", "var(--afenda-status-tone-pending-foreground)", null, "Pending status text."],
    ["afenda.semantic.status.pending.border", "var(--afenda-status-tone-pending-border)", null, "Pending status border."],
  ]),
  ...section("typography", "SEMANTIC · Typography roles", [
    ["afenda.semantic.type.display", "var(--afenda-typography-font-size-display-sm)", null, "Display scale — page heroes."],
    ["afenda.semantic.type.heading", "var(--afenda-typography-font-size-heading-md)", null, "Section heading scale."],
    ["afenda.semantic.type.title", "var(--afenda-typography-font-size-heading-sm)", null, "Subsection title scale."],
    ["afenda.semantic.type.body", "var(--afenda-typography-font-size-body-md)", null, "Default body scale."],
    ["afenda.semantic.type.body-sm", "var(--afenda-typography-font-size-body-sm)", null, "Compact body scale."],
    ["afenda.semantic.type.caption", "var(--afenda-typography-font-size-caption)", null, "Caption / metadata scale."],
    ["afenda.semantic.type.label", "var(--afenda-typography-font-size-label-md)", null, "Form label scale."],
    ["afenda.semantic.type.code", "var(--afenda-font-mono)", null, "Monospace code stack."],
    ["afenda.semantic.type.numeric", "var(--afenda-font-numeric)", null, "Tabular numeric stack."],
  ]),
  ...section("radius", "SEMANTIC · Radius roles", [
    ["afenda.semantic.radius.control", "var(--afenda-radius-md)", null, "Inputs, buttons, selects."],
    ["afenda.semantic.radius.card", "var(--afenda-radius-md)", null, "Cards and panels."],
    ["afenda.semantic.radius.surface", "var(--afenda-radius-lg)", null, "Large surfaces and sections."],
    ["afenda.semantic.radius.pill", "var(--afenda-radius-full)", null, "Pills, badges, avatars."],
  ]),
  ...section("shadow", "SEMANTIC · Shadow roles", [
    ["afenda.semantic.shadow.popover", "var(--afenda-shadow-md)", null, "Popover / dropdown shadow."],
    ["afenda.semantic.shadow.modal", "var(--afenda-shadow-xl)", null, "Modal / dialog shadow."],
    ["afenda.semantic.shadow.focus", "var(--afenda-shadow-focus)", null, "Focus ring shadow."],
  ]),
  ...section("color", "SEMANTIC · Focus roles", [
    ["afenda.semantic.focus.ring", "var(--afenda-color-focus-ring)", null, "Keyboard focus ring color."],
    ["afenda.semantic.focus.shadow", "var(--afenda-shadow-focus)", null, "Keyboard focus ring shadow."],
  ]),
  ...section("color", "SEMANTIC · Table", [
    ["afenda.table.header.background", "var(--afenda-semantic-surface-muted)", null, "ERP data-grid header background."],
    ["afenda.table.header.foreground", "var(--afenda-semantic-text-secondary)", null, "ERP data-grid header text."],
    ["afenda.table.row.background", "var(--afenda-semantic-surface-card)", null, "Data-grid row background."],
    ["afenda.table.row.hover", "var(--afenda-semantic-surface-hover)", null, "Data-grid row hover."],
    ["afenda.table.row.selected", "var(--afenda-semantic-surface-selected)", null, "Data-grid row selected."],
    ["afenda.table.row.border", "var(--afenda-semantic-border-subtle)", null, "Data-grid row separator."],
    ["afenda.table.cell.muted", "var(--afenda-semantic-text-tertiary)", null, "De-emphasised cell text."],
    ["afenda.table.cell.numeric", "var(--afenda-semantic-text-primary)", null, "Numeric cell text (tabular)."],
  ]),
  ...section("color", "SEMANTIC · Form field", [
    ["afenda.form-field.background", "var(--afenda-semantic-surface-card)", null, "Input / select / textarea background."],
    ["afenda.form-field.border", "var(--afenda-color-input)", null, "Form field border."],
    ["afenda.form-field.border.focus", "var(--afenda-semantic-border-focus)", null, "Form field focused border."],
    ["afenda.form-field.placeholder", "var(--afenda-semantic-text-placeholder)", null, "Form field placeholder text."],
    ["afenda.form-field.disabled.background", "var(--afenda-state-disabled-surface)", null, "Disabled form field background."],
    ["afenda.form-field.invalid.border", "var(--afenda-semantic-border-error)", null, "Invalid form field border."],
  ]),

  // ════════════════════════════════ ERP STATE ══════════════════════════════════
  ...section("color", "ERP STATE · Operational", [
    ["afenda.state.readonly.surface", "oklch(0.960 0.006 248)", "oklch(0.198 0.008 252)", "Read-only field / archived record surface."],
    ["afenda.state.readonly.foreground", "oklch(0.458 0.018 248)", "oklch(0.658 0.018 248)", "Read-only text."],
    ["afenda.state.readonly.border", "oklch(0.878 0.010 248)", "oklch(0.318 0.012 252)", "Read-only border."],
    ["afenda.state.disabled.surface", "oklch(0.955 0.005 248)", "oklch(0.190 0.006 252)", "Disabled control surface."],
    ["afenda.state.disabled.foreground", "oklch(0.648 0.012 250)", "oklch(0.418 0.012 248)", "Disabled control text."],
    ["afenda.state.degraded.surface", "oklch(0.944 0.072 76)", "oklch(0.198 0.072 76)", "Service degraded / partial outage surface."],
    ["afenda.state.degraded.foreground", "oklch(0.418 0.098 62)", "oklch(0.818 0.098 72)", "Degraded text."],
    ["afenda.state.degraded.border", "oklch(0.738 0.098 70)", "oklch(0.378 0.102 70)", "Degraded border."],
    ["afenda.state.maintenance.surface", "oklch(0.948 0.042 285)", "oklch(0.198 0.042 285)", "Planned maintenance surface."],
    ["afenda.state.maintenance.foreground", "oklch(0.358 0.092 288)", "oklch(0.778 0.092 288)", "Maintenance text."],
    ["afenda.state.maintenance.border", "oklch(0.738 0.072 288)", "oklch(0.358 0.074 288)", "Maintenance border."],
    ["afenda.state.offline.surface", "oklch(0.948 0.005 248)", "oklch(0.198 0.006 252)", "Module unavailable surface."],
    ["afenda.state.offline.foreground", "oklch(0.498 0.012 248)", "oklch(0.598 0.012 248)", "Offline text."],
    ["afenda.state.skeleton.base", "oklch(0.928 0.008 248)", "oklch(0.198 0.010 252)", "Skeleton loading base."],
    ["afenda.state.skeleton.highlight", "oklch(0.968 0.005 248)", "oklch(0.248 0.012 252)", "Skeleton shimmer highlight."],
  ]),
  ...section("color", "ERP STATE · Tenant context", [
    ["afenda.tenant.context.surface", "oklch(0.952 0.058 224)", "oklch(0.198 0.058 224)", "Multi-tenant context chrome surface."],
    ["afenda.tenant.context.foreground", "oklch(0.378 0.095 224)", "oklch(0.778 0.095 224)", "Tenant context text."],
    ["afenda.tenant.context.border", "oklch(0.748 0.088 222)", "oklch(0.348 0.088 222)", "Tenant context border."],
    ["afenda.tenant.context.accent", "oklch(0.500 0.162 254)", "oklch(0.598 0.162 254)", "Tenant context accent."],
  ]),

  // ═══════════════════════════ VISUALIZATION (ACPA) ════════════════════════════
  ...section("chart", "VIZ · Chart frame", [
    ["afenda.chart.background", "var(--afenda-color-surface-card)", null, "Chart plot background."],
    ["afenda.chart.foreground", "var(--afenda-color-text-default)", null, "Chart primary text / axis labels."],
    ["afenda.chart.grid", "var(--afenda-color-border-muted)", null, "Chart grid line stroke."],
    ["afenda.chart.axis", "var(--afenda-color-border-default)", null, "Chart axis line stroke."],
    ["afenda.chart.tooltip.bg", "var(--afenda-color-surface-raised)", null, "Chart tooltip surface."],
    ["afenda.chart.tooltip.border", "var(--afenda-color-border-strong)", null, "Chart tooltip border."],
    ["afenda.chart.reference.line", "var(--afenda-color-border-strong)", null, "Chart reference line."],
  ]),
  ...section("chart", "VIZ · Series", [
    ["afenda.chart.series.1", "var(--afenda-color-chart-1)", null, "Categorical series 1."],
    ["afenda.chart.series.2", "var(--afenda-color-chart-2)", null, "Categorical series 2."],
    ["afenda.chart.series.3", "var(--afenda-color-chart-3)", null, "Categorical series 3."],
    ["afenda.chart.series.4", "var(--afenda-color-chart-4)", null, "Categorical series 4."],
    ["afenda.chart.series.5", "var(--afenda-color-chart-5)", null, "Categorical series 5."],
    ["afenda.chart.series.6", "var(--afenda-color-chart-6)", null, "Categorical series 6."],
    ["afenda.chart.series.7", "var(--afenda-color-chart-7)", null, "Categorical series 7."],
    ["afenda.chart.series.8", "var(--afenda-color-chart-8)", null, "Categorical series 8."],
  ]),
  ...section("chart", "VIZ · Sequential", [
    ["afenda.chart.sequential.1", "var(--afenda-color-chart-sequential-1)", null, "Sequential ramp 1."],
    ["afenda.chart.sequential.2", "var(--afenda-color-chart-sequential-2)", null, "Sequential ramp 2."],
    ["afenda.chart.sequential.3", "var(--afenda-color-chart-sequential-3)", null, "Sequential ramp 3."],
    ["afenda.chart.sequential.4", "var(--afenda-color-chart-sequential-4)", null, "Sequential ramp 4."],
    ["afenda.chart.sequential.5", "var(--afenda-color-chart-sequential-5)", null, "Sequential ramp 5."],
    ["afenda.chart.sequential.6", "var(--afenda-color-chart-sequential-6)", null, "Sequential ramp 6."],
  ]),
  ...section("chart", "VIZ · Diverging", [
    ["afenda.chart.diverging.neg-3", "var(--afenda-color-chart-diverging-neg-3)", null, "Diverging deficit 3."],
    ["afenda.chart.diverging.neg-2", "var(--afenda-color-chart-diverging-neg-2)", null, "Diverging deficit 2."],
    ["afenda.chart.diverging.neg-1", "var(--afenda-color-chart-diverging-neg-1)", null, "Diverging deficit 1."],
    ["afenda.chart.diverging.neutral", "var(--afenda-color-chart-diverging-neutral)", null, "Diverging breakeven."],
    ["afenda.chart.diverging.pos-1", "var(--afenda-color-chart-diverging-pos-1)", null, "Diverging surplus 1."],
    ["afenda.chart.diverging.pos-2", "var(--afenda-color-chart-diverging-pos-2)", null, "Diverging surplus 2."],
    ["afenda.chart.diverging.pos-3", "var(--afenda-color-chart-diverging-pos-3)", null, "Diverging surplus 3."],
  ]),
  ...section("chart", "VIZ · Heatmap", [
    ["afenda.chart.heatmap.1", "var(--afenda-color-chart-sequential-1)", null, "Heatmap step 1."],
    ["afenda.chart.heatmap.2", "var(--afenda-color-chart-sequential-2)", null, "Heatmap step 2."],
    ["afenda.chart.heatmap.3", "var(--afenda-color-chart-sequential-3)", null, "Heatmap step 3."],
    ["afenda.chart.heatmap.4", "var(--afenda-color-chart-sequential-4)", null, "Heatmap step 4."],
    ["afenda.chart.heatmap.5", "var(--afenda-color-chart-sequential-5)", null, "Heatmap step 5."],
    ["afenda.chart.heatmap.6", "var(--afenda-color-chart-sequential-6)", null, "Heatmap step 6."],
  ]),
  ...section("chart", "VIZ · KPI", [
    ["afenda.chart.kpi.value", "var(--afenda-color-text-default)", null, "KPI value text."],
    ["afenda.chart.kpi.label", "var(--afenda-color-text-muted)", null, "KPI label text."],
    ["afenda.chart.kpi.positive", "var(--afenda-color-trend-positive)", null, "KPI positive delta."],
    ["afenda.chart.kpi.negative", "var(--afenda-color-trend-negative)", null, "KPI negative delta."],
    ["afenda.chart.kpi.neutral", "var(--afenda-color-trend-neutral)", null, "KPI neutral delta."],
    ["afenda.chart.kpi.target", "var(--afenda-color-chart-7)", null, "KPI target reference."],
  ]),
  ...section("chart", "VIZ · Trend", [
    ["afenda.chart.trend.positive", "var(--afenda-color-trend-positive)", null, "Trend positive."],
    ["afenda.chart.trend.positive.surface", "var(--afenda-color-trend-positive-surface)", null, "Trend positive surface."],
    ["afenda.chart.trend.negative", "var(--afenda-color-trend-negative)", null, "Trend negative."],
    ["afenda.chart.trend.negative.surface", "var(--afenda-color-trend-negative-surface)", null, "Trend negative surface."],
    ["afenda.chart.trend.neutral", "var(--afenda-color-trend-neutral)", null, "Trend neutral."],
    ["afenda.chart.trend.neutral.surface", "var(--afenda-color-trend-neutral-surface)", null, "Trend neutral surface."],
  ]),
  ...section("chart", "VIZ · Threshold", [
    ["afenda.chart.threshold.success", "var(--afenda-status-tone-success-solid)", null, "Threshold within target."],
    ["afenda.chart.threshold.warning", "var(--afenda-status-tone-warning-solid)", null, "Threshold approaching limit."],
    ["afenda.chart.threshold.danger", "var(--afenda-status-tone-danger-solid)", null, "Threshold breached."],
  ]),
  ...section("chart", "VIZ · Utilization", [
    ["afenda.chart.utilization.track", "var(--afenda-color-surface-muted)", null, "Utilization bar track."],
    ["afenda.chart.utilization.low", "var(--afenda-status-tone-success-solid)", null, "Utilization low band."],
    ["afenda.chart.utilization.medium", "var(--afenda-status-tone-warning-solid)", null, "Utilization medium band."],
    ["afenda.chart.utilization.high", "var(--afenda-status-tone-danger-solid)", null, "Utilization high band."],
    ["afenda.chart.utilization.over", "var(--afenda-color-destructive)", null, "Utilization overage."],
  ]),
  ...section("chart", "VIZ · Approval", [
    ["afenda.chart.approval.draft", "var(--afenda-status-tone-neutral-solid)", null, "Approval stage — draft."],
    ["afenda.chart.approval.pending", "var(--afenda-status-tone-warning-solid)", null, "Approval stage — pending."],
    ["afenda.chart.approval.approved", "var(--afenda-status-tone-success-solid)", null, "Approval stage — approved."],
    ["afenda.chart.approval.rejected", "var(--afenda-status-tone-danger-solid)", null, "Approval stage — rejected."],
    ["afenda.chart.approval.escalated", "var(--afenda-status-tone-forbidden-solid)", null, "Approval stage — escalated."],
    ["afenda.chart.approval.cancelled", "var(--afenda-status-tone-neutral-border)", null, "Approval stage — cancelled."],
  ]),
  ...section("chart", "VIZ · Forecast", [
    ["afenda.chart.forecast.actual", "var(--afenda-color-chart-1)", null, "Forecast — actual."],
    ["afenda.chart.forecast.projected", "var(--afenda-color-chart-7)", null, "Forecast — projected."],
    ["afenda.chart.forecast.band", "var(--afenda-color-primary-subtle)", null, "Forecast — confidence band."],
  ]),
  ...section("chart", "VIZ · Finance", [
    ["afenda.chart.finance.credit", "var(--afenda-status-tone-success-solid)", null, "Finance — credit."],
    ["afenda.chart.finance.debit", "var(--afenda-status-tone-danger-solid)", null, "Finance — debit."],
    ["afenda.chart.finance.balanced", "var(--afenda-status-tone-neutral-solid)", null, "Finance — balanced."],
  ]),
  ...section("chart", "VIZ · Timeline", [
    ["afenda.chart.timeline.line", "var(--afenda-color-border-default)", null, "Audit timeline line."],
    ["afenda.chart.timeline.marker", "var(--afenda-color-chart-7)", null, "Audit timeline marker."],
    ["afenda.chart.timeline.marker.active", "var(--afenda-color-primary)", null, "Audit timeline active marker."],
  ]),

  // ════════════════════════════════ TYPOGRAPHY ═════════════════════════════════
  ...section("font", "TYPOGRAPHY · Font family", [
    ["afenda.font.sans", "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"", null, "Default sans-serif stack."],
    ["afenda.font.mono", "ui-monospace, SFMono-Regular, Menlo, Monaco, \"Cascadia Mono\", Consolas, \"Courier New\", monospace", null, "Monospace stack."],
    ["afenda.font.heading", "var(--afenda-font-sans)", null, "Heading stack — defaults to sans."],
    ["afenda.font.body", "var(--afenda-font-sans)", null, "Body stack — defaults to sans."],
    ["afenda.font.numeric", "var(--afenda-font-mono)", null, "Tabular figures for tables."],
  ]),
  ...section("typography", "TYPOGRAPHY · Font size", [
    ["afenda.typography.font-size.caption", "0.6875rem", null, "Caption font size."],
    ["afenda.typography.font-size.body.xs", "0.75rem", null, "Body XS font size."],
    ["afenda.typography.font-size.body.sm", "0.875rem", null, "Body SM font size."],
    ["afenda.typography.font-size.body.md", "1rem", null, "Body MD font size."],
    ["afenda.typography.font-size.body.lg", "1.125rem", null, "Body LG font size."],
    ["afenda.typography.font-size.label.sm", "0.75rem", null, "Label SM font size."],
    ["afenda.typography.font-size.label.md", "0.875rem", null, "Label MD font size."],
    ["afenda.typography.font-size.heading.sm", "1rem", null, "Heading SM font size."],
    ["afenda.typography.font-size.heading.md", "1.25rem", null, "Heading MD font size."],
    ["afenda.typography.font-size.heading.lg", "1.5rem", null, "Heading LG font size."],
    ["afenda.typography.font-size.heading.xl", "1.875rem", null, "Heading XL font size."],
    ["afenda.typography.font-size.display.sm", "2.25rem", null, "Display SM font size."],
  ]),
  ...section("typography", "TYPOGRAPHY · Line height", [
    ["afenda.typography.line-height.caption", "0.875rem", null, "Caption line height."],
    ["afenda.typography.line-height.body.xs", "1rem", null, "Body XS line height."],
    ["afenda.typography.line-height.body.sm", "1.25rem", null, "Body SM line height."],
    ["afenda.typography.line-height.body.md", "1.5rem", null, "Body MD line height."],
    ["afenda.typography.line-height.body.lg", "1.75rem", null, "Body LG line height."],
    ["afenda.typography.line-height.label.sm", "1rem", null, "Label SM line height."],
    ["afenda.typography.line-height.label.md", "1rem", null, "Label MD line height."],
    ["afenda.typography.line-height.heading.sm", "1.25rem", null, "Heading SM line height."],
    ["afenda.typography.line-height.heading.md", "1.5rem", null, "Heading MD line height."],
    ["afenda.typography.line-height.heading.lg", "1.875rem", null, "Heading LG line height."],
    ["afenda.typography.line-height.heading.xl", "2.25rem", null, "Heading XL line height."],
    ["afenda.typography.line-height.display.sm", "2.5rem", null, "Display SM line height."],
  ]),
  ...section("typography", "TYPOGRAPHY · Font weight", [
    ["afenda.typography.font-weight.body.xs", "400", null, "Body XS weight."],
    ["afenda.typography.font-weight.body.sm", "400", null, "Body SM weight."],
    ["afenda.typography.font-weight.body.md", "400", null, "Body MD weight."],
    ["afenda.typography.font-weight.label.sm", "500", null, "Label SM weight."],
    ["afenda.typography.font-weight.label.md", "600", null, "Label MD weight."],
    ["afenda.typography.font-weight.heading.sm", "600", null, "Heading SM weight."],
    ["afenda.typography.font-weight.heading.md", "600", null, "Heading MD weight."],
    ["afenda.typography.font-weight.heading.lg", "650", null, "Heading LG weight."],
    ["afenda.typography.font-weight.heading.xl", "700", null, "Heading XL weight."],
    ["afenda.typography.font-weight.display.sm", "700", null, "Display SM weight."],
  ]),
  ...section("typography", "TYPOGRAPHY · Letter spacing", [
    ["afenda.typography.letter-spacing.tighter", "-0.02em", null, "Tighter tracking."],
    ["afenda.typography.letter-spacing.tight", "-0.01em", null, "Tight tracking."],
    ["afenda.typography.letter-spacing.normal", "0em", null, "Normal tracking."],
    ["afenda.typography.letter-spacing.wide", "0.01em", null, "Wide tracking."],
    ["afenda.typography.letter-spacing.wider", "0.04em", null, "Wider tracking."],
    ["afenda.typography.letter-spacing.widest", "0.08em", null, "Widest tracking."],
  ]),

  // ══════════════════════════════════ SCALES ═══════════════════════════════════
  ...section("spacing", "SCALE · Spacing", [
    ["afenda.spacing.0", "0", null, "Zero spacing."],
    ["afenda.spacing.0-5", "0.125rem", null, "Hairline spacing."],
    ["afenda.spacing.1", "0.25rem", null, "Smallest governed spacing unit."],
    ["afenda.spacing.2", "0.5rem", null, "Compact inline spacing."],
    ["afenda.spacing.3", "0.75rem", null, "Standard inline spacing."],
    ["afenda.spacing.4", "1rem", null, "Standard block spacing."],
    ["afenda.spacing.5", "1.25rem", null, "Section spacing."],
    ["afenda.spacing.6", "1.5rem", null, "Generous section spacing."],
    ["afenda.spacing.7", "1.75rem", null, "Large section spacing."],
    ["afenda.spacing.8", "2rem", null, "Large layout spacing."],
    ["afenda.spacing.10", "2.5rem", null, "Extra-large layout spacing."],
    ["afenda.spacing.12", "3rem", null, "Page gutter spacing."],
    ["afenda.spacing.16", "4rem", null, "Hero / section break spacing."],
  ]),
  ...section("radius", "SCALE · Radius", [
    ["afenda.radius.base", "0.625rem", null, "Base radius — premium ERP refinement (TIP-004B)."],
    ["afenda.radius.none", "0", null, "No border radius — sharp edges."],
    ["afenda.radius.xs", "calc(0.625rem * 0.4)", null, "Extra-small radius — chips, tags."],
    ["afenda.radius.sm", "calc(0.625rem * 0.6)", null, "Small radius."],
    ["afenda.radius.md", "calc(0.625rem * 0.8)", null, "Medium radius."],
    ["afenda.radius.lg", "0.625rem", null, "Large radius — cards, overlays (= base)."],
    ["afenda.radius.xl", "calc(0.625rem * 1.4)", null, "Extra-large radius."],
    ["afenda.radius.2xl", "calc(0.625rem * 1.8)", null, "2XL radius."],
    ["afenda.radius.full", "9999px", null, "Fully rounded — pills, circular controls."],
  ]),
  ...section("borderWidth", "SCALE · Border width", [
    ["afenda.border-width.none", "0", null, "No border."],
    ["afenda.border-width.sm", "1px", null, "Hairline border."],
    ["afenda.border-width.md", "1.5px", null, "Default emphasised border."],
    ["afenda.border-width.lg", "2px", null, "Strong border."],
    ["afenda.border-width.xl", "3px", null, "Heaviest border."],
  ]),
  ...section("shadow", "SCALE · Shadow", [
    ["afenda.shadow.none", "none", null, "No elevation — flat surface."],
    ["afenda.shadow.2xs", "0 1px 2px 0 oklch(0.148 0.022 256 / 0.04)", "0 1px 2px 0 oklch(0.080 0.025 256 / 0.34)", "Micro shadow."],
    ["afenda.shadow.xs", "0 1px 2px 0 oklch(0.148 0.022 256 / 0.06)", "0 1px 2px 0 oklch(0.080 0.025 256 / 0.40)", "Extra-small shadow."],
    ["afenda.shadow.sm", "0 1px 3px 0 oklch(0.148 0.022 256 / 0.09), 0 1px 2px -1px oklch(0.148 0.022 256 / 0.08)", "0 1px 3px 0 oklch(0.080 0.025 256 / 0.42), 0 1px 2px -1px oklch(0.080 0.025 256 / 0.36)", "Small shadow — inputs, chips."],
    ["afenda.shadow.base", "0 1px 3px 0 oklch(0.148 0.022 256 / 0.10), 0 1px 2px -1px oklch(0.148 0.022 256 / 0.09)", "0 1px 3px 0 oklch(0.080 0.025 256 / 0.46), 0 1px 2px -1px oklch(0.080 0.025 256 / 0.40)", "Default shadow — panels, cards."],
    ["afenda.shadow.md", "0 4px 8px -4px oklch(0.148 0.022 256 / 0.13), 0 2px 4px -2px oklch(0.148 0.022 256 / 0.09)", "0 4px 8px -4px oklch(0.080 0.025 256 / 0.48), 0 2px 4px -2px oklch(0.080 0.025 256 / 0.42)", "Medium shadow — popovers."],
    ["afenda.shadow.lg", "0 12px 20px -12px oklch(0.148 0.022 256 / 0.20), 0 4px 8px -4px oklch(0.148 0.022 256 / 0.11)", "0 12px 20px -12px oklch(0.080 0.025 256 / 0.52), 0 4px 8px -4px oklch(0.080 0.025 256 / 0.44)", "Large shadow — dialogs, dropdowns."],
    ["afenda.shadow.xl", "0 20px 28px -16px oklch(0.148 0.022 256 / 0.24), 0 8px 12px -8px oklch(0.148 0.022 256 / 0.13)", "0 20px 28px -16px oklch(0.080 0.025 256 / 0.54), 0 8px 12px -8px oklch(0.080 0.025 256 / 0.46)", "Extra-large shadow — modals."],
    ["afenda.shadow.2xl", "0 28px 48px -24px oklch(0.148 0.022 256 / 0.30)", "0 28px 48px -24px oklch(0.080 0.025 256 / 0.58)", "Maximum shadow — full-screen overlays."],
    ["afenda.shadow.focus", "0 0 0 3px oklch(0.500 0.178 254 / 0.35)", "0 0 0 3px oklch(0.638 0.180 254 / 0.40)", "Focus ring shadow."],
    ["afenda.shadow.raised", "var(--afenda-shadow-base)", null, "@deprecated Use afenda.shadow.base."],
    ["afenda.shadow.overlay", "var(--afenda-shadow-lg)", null, "@deprecated Use afenda.shadow.lg."],
  ]),
  ...section("motion", "SCALE · Motion duration", [
    ["afenda.motion.duration.instant", "0ms", null, "Zero-duration programmatic change."],
    ["afenda.motion.duration.fast", "120ms", null, "Fast control feedback."],
    ["afenda.motion.duration.normal", "160ms", null, "Overlay / dialog transition."],
    ["afenda.motion.duration.slow", "200ms", null, "Page-level transition."],
    ["afenda.motion.duration.slower", "280ms", null, "Emphasised long transition."],
  ]),
  ...section("motion", "SCALE · Motion easing", [
    ["afenda.motion.easing.standard", "cubic-bezier(0.2, 0, 0, 1)", null, "Standard easing."],
    ["afenda.motion.easing.emphasized", "cubic-bezier(0.05, 0.7, 0.1, 1)", null, "Emphasised easing."],
    ["afenda.motion.easing.decelerate", "cubic-bezier(0, 0, 0.2, 1)", null, "Decelerate (entrance) easing."],
    ["afenda.motion.easing.accelerate", "cubic-bezier(0.4, 0, 1, 1)", null, "Accelerate (exit) easing."],
    ["afenda.motion.easing.enter", "var(--afenda-motion-easing-decelerate)", null, "Enter intent easing alias."],
    ["afenda.motion.easing.exit", "var(--afenda-motion-easing-accelerate)", null, "Exit intent easing alias."],
  ]),
  ...section("motion", "SEMANTIC · Motion intents", [
    ["afenda.semantic.motion.intent.enter", "var(--afenda-motion-duration-normal)", null, "Enter transition duration."],
    ["afenda.semantic.motion.intent.exit", "var(--afenda-motion-duration-fast)", null, "Exit transition duration — faster than enter."],
    ["afenda.semantic.motion.intent.expand", "var(--afenda-motion-duration-normal)", null, "Expand / disclose duration."],
    ["afenda.semantic.motion.intent.collapse", "var(--afenda-motion-duration-fast)", null, "Collapse / hide duration."],
    ["afenda.semantic.motion.intent.feedback", "var(--afenda-motion-duration-fast)", null, "Control feedback duration."],
  ]),
  ...section("density", "SCALE · Density", [
    ["afenda.density.compact.control-height", "32px", null, "Compact control height."],
    ["afenda.density.standard.control-height", "36px", null, "Standard control height."],
    ["afenda.density.comfortable.control-height", "44px", null, "Comfortable control height (WCAG 2.5.5)."],
    ["afenda.density.default.control-height", "var(--afenda-density-standard-control-height)", null, "Default density alias — maps to standard."],
    ["afenda.density.compact.gap", "var(--afenda-spacing-2)", null, "Compact internal gap."],
    ["afenda.density.standard.gap", "var(--afenda-spacing-3)", null, "Standard internal gap."],
    ["afenda.density.comfortable.gap", "var(--afenda-spacing-4)", null, "Comfortable internal gap."],
    ["afenda.density.default.gap", "var(--afenda-density-standard-gap)", null, "Default gap alias."],
    ["afenda.density.compact.padding-x", "var(--afenda-spacing-2)", null, "Compact horizontal padding."],
    ["afenda.density.standard.padding-x", "var(--afenda-spacing-3)", null, "Standard horizontal padding."],
    ["afenda.density.comfortable.padding-x", "var(--afenda-spacing-4)", null, "Comfortable horizontal padding."],
    ["afenda.density.default.padding-x", "var(--afenda-density-standard-padding-x)", null, "Default padding alias."],
    ["afenda.density.compact.section-gap", "var(--afenda-spacing-4)", null, "Compact section vertical gap."],
    ["afenda.density.standard.section-gap", "var(--afenda-spacing-6)", null, "Standard section vertical gap."],
    ["afenda.density.comfortable.section-gap", "var(--afenda-spacing-8)", null, "Comfortable section vertical gap."],
    ["afenda.density.default.section-gap", "var(--afenda-density-standard-section-gap)", null, "Default section gap alias."],
    ["afenda.density.compact.table-row-height", "2rem", null, "Compact data-grid row height."],
    ["afenda.density.standard.table-row-height", "2.25rem", null, "Standard data-grid row height."],
    ["afenda.density.comfortable.table-row-height", "2.75rem", null, "Comfortable data-grid row height."],
    ["afenda.density.default.table-row-height", "var(--afenda-density-standard-table-row-height)", null, "Default table row height alias."],
    ["afenda.density.compact.toolbar-gap", "var(--afenda-spacing-2)", null, "Compact toolbar gap."],
    ["afenda.density.standard.toolbar-gap", "var(--afenda-spacing-3)", null, "Standard toolbar gap."],
    ["afenda.density.comfortable.toolbar-gap", "var(--afenda-spacing-4)", null, "Comfortable toolbar gap."],
    ["afenda.density.default.toolbar-gap", "var(--afenda-density-standard-toolbar-gap)", null, "Default toolbar gap alias."],
    ["afenda.density.compact.field-gap", "var(--afenda-spacing-1)", null, "Compact form field gap."],
    ["afenda.density.standard.field-gap", "var(--afenda-spacing-2)", null, "Standard form field gap."],
    ["afenda.density.comfortable.field-gap", "var(--afenda-spacing-3)", null, "Comfortable form field gap."],
    ["afenda.density.default.field-gap", "var(--afenda-density-standard-field-gap)", null, "Default field gap alias."],
  ]),
  ...section("z-index", "SCALE · Z-index", [
    ["afenda.z-index.hide", "-1", null, "Hidden below base."],
    ["afenda.z-index.base", "0", null, "Base stacking context."],
    ["afenda.z-index.raised", "10", null, "Raised elements."],
    ["afenda.z-index.docked", "100", null, "Docked toolbars."],
    ["afenda.z-index.sticky", "200", null, "Sticky headers."],
    ["afenda.z-index.banner", "300", null, "Banners."],
    ["afenda.z-index.dropdown", "1000", null, "Dropdowns."],
    ["afenda.z-index.overlay", "1100", null, "Overlays / scrims."],
    ["afenda.z-index.modal", "1200", null, "Modals."],
    ["afenda.z-index.popover", "1300", null, "Popovers."],
    ["afenda.z-index.toast", "1400", null, "Toasts."],
    ["afenda.z-index.tooltip", "1500", null, "Tooltips."],
    ["afenda.z-index.command", "1600", null, "Command palette."],
    ["afenda.z-index.max", "2147483000", null, "Maximum stacking ceiling."],
  ]),
  ...section("opacity", "SCALE · Opacity", [
    ["afenda.opacity.0", "0", null, "Fully transparent."],
    ["afenda.opacity.disabled", "0.50", null, "Disabled control opacity."],
    ["afenda.opacity.muted", "0.72", null, "Muted opacity."],
    ["afenda.opacity.subtle", "0.85", null, "Subtle opacity."],
    ["afenda.opacity.hover", "0.08", null, "Hover overlay opacity."],
    ["afenda.opacity.active", "0.12", null, "Active overlay opacity."],
    ["afenda.opacity.selected", "0.16", null, "Selected overlay opacity."],
    ["afenda.opacity.focus-ring", "0.35", null, "Focus ring opacity."],
    ["afenda.opacity.backdrop", "0.60", null, "Backdrop opacity."],
    ["afenda.opacity.scrim", "0.45", null, "Scrim opacity."],
    ["afenda.opacity.skeleton", "0.65", null, "Skeleton opacity."],
    ["afenda.opacity.ghost", "0.04", null, "Ghost overlay opacity."],
  ]),
  ...section("breakpoint", "SCALE · Breakpoint", [
    ["afenda.breakpoint.sm", "640px", null, "Small viewport minimum width."],
    ["afenda.breakpoint.md", "768px", null, "Medium viewport minimum width."],
    ["afenda.breakpoint.lg", "1024px", null, "Large viewport minimum width."],
    ["afenda.breakpoint.xl", "1280px", null, "Extra-large viewport minimum width."],
    ["afenda.breakpoint.2xl", "1536px", null, "Wide desktop viewport minimum width."],
  ]),
  ...section("layout", "SCALE · Layout", [
    ["afenda.layout.touch-target.minimum", "44px", null, "Minimum accessible touch target (WCAG 2.5.5)."],
  ]),
];

// ─── Named export sets ────────────────────────────────────────────────────────

/** Canonical token registry. Single source of truth. */
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

// AfendaTokenName is the canonical type; re-export for backward compat.
export type { AfendaTokenName } from "../contracts/token.contract";
