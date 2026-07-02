/**
 * @afenda.governance-envelope primitive-evidence
 * Role: Executable SSOT — Storybook primitive evidence tiers, interaction, slots, mismatch rules
 * Family: primitive-evidence
 * Relies on: _governance.registry (UI_PRIMITIVE_CONTRACT_SLUGS)
 * Relied on by: check-storybook-primitive-coverage, check-primitive-mismatch, check-storybook-evidence, storybook generator
 * Gate: check:storybook-primitive-coverage · check:primitive-mismatch · check:storybook-evidence
 */

import {
  UI_PRIMITIVE_CONTRACT_SLUGS,
  type UiPrimitiveContractSlug,
} from "./_governance.registry.js";

export type PrimitiveEvidenceTier = "bronze" | "silver" | "gold";

export type PrimitiveInteractionKind =
  | "click-opens"
  | "click-toggles"
  | "keyboard-opens"
  | "selection-changes"
  | "input-updates"
  | "none";

export type PrimitiveEvidenceSpec = {
  readonly slug: UiPrimitiveContractSlug;
  readonly tier: PrimitiveEvidenceTier;
  readonly compound: boolean;
  readonly requiresRender: boolean;
  readonly requiresPlay: boolean;
  readonly expectedSlots: readonly string[];
  readonly expectedRoles: readonly string[];
  readonly interaction: PrimitiveInteractionKind;
  readonly mismatchRules: readonly string[];
};

/** Compound primitives — autogen must not emit args-only Default. */
export const COMPOUND_PRIMITIVE_SLUGS = [
  "accordion",
  "alert-dialog",
  "calendar",
  "collapsible",
  "command",
  "dialog",
  "drawer",
  "dropdown-menu",
  "popover",
  "radio-group",
  "select",
  "sheet",
  "tabs",
  "toggle-group",
  "tooltip",
] as const satisfies readonly UiPrimitiveContractSlug[];

const COMPOUND_SET = new Set<string>(COMPOUND_PRIMITIVE_SLUGS);

/** Tier overrides — all other governed slugs default to bronze. */
const EVIDENCE_OVERRIDES: Partial<
  Record<
    UiPrimitiveContractSlug,
    Omit<PrimitiveEvidenceSpec, "slug"> & { slug?: never }
  >
> = {
  accordion: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: [
      "accordion",
      "accordion-item",
      "accordion-trigger",
      "accordion-content",
    ],
    expectedRoles: ["button"],
    interaction: "click-opens",
    mismatchRules: ["M1", "M2", "M3", "M6"],
  },
  button: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["button"],
    expectedRoles: ["button"],
    interaction: "click-toggles",
    mismatchRules: ["M4", "M6"],
  },
  checkbox: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["checkbox"],
    expectedRoles: ["checkbox"],
    interaction: "click-toggles",
    mismatchRules: ["M6"],
  },
  input: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["input"],
    expectedRoles: ["textbox"],
    interaction: "input-updates",
    mismatchRules: ["M6"],
  },
  switch: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["switch"],
    expectedRoles: ["switch"],
    interaction: "click-toggles",
    mismatchRules: ["M6"],
  },
  alert: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["alert"],
    expectedRoles: [],
    interaction: "none",
    mismatchRules: ["M4", "M6"],
  },
  badge: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["badge"],
    expectedRoles: [],
    interaction: "none",
    mismatchRules: ["M4", "M6"],
  },
  card: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["card"],
    expectedRoles: [],
    interaction: "none",
    mismatchRules: ["M4", "M6"],
  },
  progress: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["progress"],
    expectedRoles: ["progressbar"],
    interaction: "none",
    mismatchRules: ["M6"],
  },
  separator: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["separator"],
    expectedRoles: ["separator"],
    interaction: "none",
    mismatchRules: ["M6"],
  },
  spinner: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["spinner"],
    expectedRoles: ["status"],
    interaction: "none",
    mismatchRules: ["M6"],
  },
  tabs: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["tabs", "tabs-trigger", "tabs-content"],
    expectedRoles: ["tab"],
    interaction: "click-opens",
    mismatchRules: ["M2", "M6"],
  },
  collapsible: {
    tier: "silver",
    compound: true,
    requiresRender: true,
    requiresPlay: false,
    expectedSlots: [
      "collapsible",
      "collapsible-trigger",
      "collapsible-content",
    ],
    expectedRoles: ["button"],
    interaction: "click-opens",
    mismatchRules: ["M2", "M6"],
  },
  dialog: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["dialog", "dialog-content", "dialog-trigger"],
    expectedRoles: ["button", "dialog"],
    interaction: "click-opens",
    mismatchRules: ["M6"],
  },
  sheet: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["sheet", "sheet-content", "sheet-trigger"],
    expectedRoles: ["button", "dialog"],
    interaction: "click-opens",
    mismatchRules: ["M6"],
  },
  "alert-dialog": {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: [
      "alert-dialog",
      "alert-dialog-content",
      "alert-dialog-trigger",
    ],
    expectedRoles: ["button", "alertdialog"],
    interaction: "click-opens",
    mismatchRules: ["M6"],
  },
  select: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["select", "select-trigger", "select-content"],
    expectedRoles: ["combobox", "button"],
    interaction: "selection-changes",
    mismatchRules: ["M6"],
  },
  command: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["command"],
    expectedRoles: ["combobox", "textbox"],
    interaction: "selection-changes",
    mismatchRules: ["M6"],
  },
  tooltip: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["tooltip", "tooltip-trigger", "tooltip-content"],
    expectedRoles: ["button"],
    interaction: "none",
    mismatchRules: ["M6"],
  },
  popover: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["popover", "popover-trigger", "popover-content"],
    expectedRoles: ["button"],
    interaction: "click-opens",
    mismatchRules: ["M6"],
  },
  "dropdown-menu": {
    tier: "silver",
    compound: true,
    requiresRender: true,
    requiresPlay: false,
    expectedSlots: ["dropdown-menu"],
    expectedRoles: ["button", "menu"],
    interaction: "click-opens",
    mismatchRules: ["M6"],
  },
  calendar: {
    tier: "gold",
    compound: true,
    requiresRender: true,
    requiresPlay: true,
    expectedSlots: ["calendar"],
    expectedRoles: ["grid", "button"],
    interaction: "selection-changes",
    mismatchRules: ["M6"],
  },
  "toggle-group": {
    tier: "silver",
    compound: true,
    requiresRender: true,
    requiresPlay: false,
    expectedSlots: ["toggle-group"],
    expectedRoles: ["group", "button"],
    interaction: "click-toggles",
    mismatchRules: ["M6"],
  },
  "radio-group": {
    tier: "silver",
    compound: true,
    requiresRender: true,
    requiresPlay: false,
    expectedSlots: ["radio-group"],
    expectedRoles: ["radiogroup", "radio"],
    interaction: "selection-changes",
    mismatchRules: ["M6"],
  },
  toggle: {
    tier: "gold",
    compound: false,
    requiresRender: false,
    requiresPlay: true,
    expectedSlots: ["toggle"],
    expectedRoles: ["button"],
    interaction: "click-toggles",
    mismatchRules: ["M6"],
  },
};

function defaultSpec(slug: UiPrimitiveContractSlug): PrimitiveEvidenceSpec {
  const compound = COMPOUND_SET.has(slug);
  return {
    slug,
    tier: "bronze",
    compound,
    requiresRender: compound,
    requiresPlay: false,
    expectedSlots: [],
    expectedRoles: [],
    interaction: "none",
    mismatchRules: compound ? ["M6"] : [],
  };
}

function buildSpec(slug: UiPrimitiveContractSlug): PrimitiveEvidenceSpec {
  const override = EVIDENCE_OVERRIDES[slug];
  if (!override) {
    return defaultSpec(slug);
  }
  return { slug, ...override };
}

export const PRIMITIVE_EVIDENCE_REGISTRY: readonly PrimitiveEvidenceSpec[] =
  UI_PRIMITIVE_CONTRACT_SLUGS.map(buildSpec);

export function getEvidenceSpec(
  slug: string
): PrimitiveEvidenceSpec | undefined {
  return PRIMITIVE_EVIDENCE_REGISTRY.find((entry) => entry.slug === slug);
}

export function goldEvidenceSlugs(): readonly UiPrimitiveContractSlug[] {
  return PRIMITIVE_EVIDENCE_REGISTRY.filter(
    (entry) => entry.tier === "gold"
  ).map((entry) => entry.slug);
}

export function silverEvidenceSlugs(): readonly UiPrimitiveContractSlug[] {
  return PRIMITIVE_EVIDENCE_REGISTRY.filter(
    (entry) => entry.tier === "silver"
  ).map((entry) => entry.slug);
}

export function compoundEvidenceSlugs(): readonly UiPrimitiveContractSlug[] {
  return COMPOUND_PRIMITIVE_SLUGS;
}

export function slugsByTier(
  tier: PrimitiveEvidenceTier
): readonly UiPrimitiveContractSlug[] {
  return PRIMITIVE_EVIDENCE_REGISTRY.filter((entry) => entry.tier === tier).map(
    (entry) => entry.slug
  );
}
