import {
  tokenNameToCssVariable,
  type AfendaTokenName,
} from "./design-system";

function cssVar(token: AfendaTokenName): string {
  return `var(${tokenNameToCssVariable(token)})`;
}

function bgToken(token: AfendaTokenName): string {
  return `bg-[${cssVar(token)}]`;
}

function textToken(token: AfendaTokenName): string {
  return `text-[${cssVar(token)}]`;
}

function borderToken(token: AfendaTokenName): string {
  return `border-[${cssVar(token)}]`;
}

function gapToken(token: AfendaTokenName): string {
  return `gap-[${cssVar(token)}]`;
}

function paddingXToken(token: AfendaTokenName): string {
  return `px-[${cssVar(token)}]`;
}

function radiusToken(token: AfendaTokenName): string {
  return `rounded-[${cssVar(token)}]`;
}

function shadowToken(token: AfendaTokenName): string {
  return `shadow-[${cssVar(token)}]`;
}

const appShellRootClasses = [
  "group/app-shell",
  "min-h-dvh",
  bgToken("afenda.semantic.surface.canvas"),
  textToken("afenda.semantic.text.primary"),
  borderToken("afenda.semantic.border.subtle"),
  paddingXToken("afenda.density.standard.padding-x"),
  gapToken("afenda.density.standard.gap"),
  radiusToken("afenda.semantic.radius.surface"),
  shadowToken("afenda.semantic.elevation.flat"),
].join(" ");

const metadataUiRootClasses = [
  "group/metadata-ui",
  bgToken("afenda.semantic.surface.card"),
  textToken("afenda.semantic.text.primary"),
  borderToken("afenda.semantic.border.subtle"),
  paddingXToken("afenda.density.standard.padding-x"),
  gapToken("afenda.density.standard.section-gap"),
  radiusToken("afenda.semantic.radius.card"),
  "text-[length:var(--afenda-semantic-type-body-sm)]",
  "leading-[var(--afenda-typography-line-height-body-sm)]",
].join(" ");

export const APP_SHELL_RECIPE_SLOTS = [
  "root",
  "sidebar",
  "topbar",
  "context-rail",
  "command-center",
  "utility-bar",
  "navigation-item",
  "active-item",
  "workspace-switcher",
  "attention-item",
] as const;

export const METADATA_UI_RECIPE_SLOTS = [
  "container",
  "surface",
  "layout",
  "section",
  "section-header",
  "action-bar",
  "state",
  "diagnostics",
  "numeric",
  "readonly",
  "disabled",
] as const;

export type AppShellRecipeSlot = (typeof APP_SHELL_RECIPE_SLOTS)[number];
export type MetadataUiRecipeSlot = (typeof METADATA_UI_RECIPE_SLOTS)[number];

export const APP_SHELL_SLOT_CLASS_NAMES: Readonly<
  Record<AppShellRecipeSlot, string>
> = {
  root: appShellRootClasses,
  sidebar: [
    "group/app-shell-sidebar",
    bgToken("afenda.semantic.surface.sunken"),
    borderToken("afenda.semantic.border.subtle"),
  ].join(" "),
  topbar: [
    "group/app-shell-topbar",
    bgToken("afenda.semantic.surface.card"),
    borderToken("afenda.semantic.border.subtle"),
  ].join(" "),
  "context-rail": [
    "group/app-shell-context-rail",
    bgToken("afenda.semantic.surface.muted"),
    borderToken("afenda.semantic.border.subtle"),
  ].join(" "),
  "command-center": "group/app-shell-command-center min-w-0",
  "utility-bar": [
    "group/app-shell-utility-bar",
    borderToken("afenda.semantic.border.subtle"),
  ].join(" "),
  "navigation-item": [
    "group/app-shell-navigation-item",
    textToken("afenda.semantic.text.secondary"),
  ].join(" "),
  "active-item": [
    "group/app-shell-active-item",
    bgToken("afenda.semantic.surface.selected"),
    textToken("afenda.semantic.text.primary"),
  ].join(" "),
  "workspace-switcher": "group/app-shell-workspace-switcher min-w-0",
  "attention-item": [
    "group/app-shell-attention-item",
    textToken("afenda.status-tone.danger.foreground"),
  ].join(" "),
};

export const METADATA_UI_SLOT_CLASS_NAMES: Readonly<
  Record<MetadataUiRecipeSlot, string>
> = {
  container: metadataUiRootClasses,
  surface: [
    "group/metadata-ui-surface",
    bgToken("afenda.semantic.surface.card"),
    borderToken("afenda.semantic.border.subtle"),
    gapToken("afenda.density.standard.section-gap"),
  ].join(" "),
  layout: [
    "group/metadata-ui-layout",
    gapToken("afenda.density.standard.section-gap"),
  ].join(" "),
  section: [
    "group/metadata-ui-section",
    gapToken("afenda.density.standard.section-gap"),
  ].join(" "),
  "section-header": [
    "group/metadata-ui-section-header",
    textToken("afenda.semantic.text.primary"),
  ].join(" "),
  "action-bar": "group/metadata-ui-action-bar min-w-0",
  state: [
    "group/metadata-ui-state",
    bgToken("afenda.semantic.surface.muted"),
    textToken("afenda.semantic.text.secondary"),
  ].join(" "),
  diagnostics: [
    "group/metadata-ui-diagnostics",
    bgToken("afenda.semantic.surface.sunken"),
    borderToken("afenda.semantic.border.subtle"),
  ].join(" "),
  numeric: "group/metadata-ui-numeric tabular-nums",
  readonly: [
    "group/metadata-ui-readonly",
    textToken("afenda.semantic.text.tertiary"),
  ].join(" "),
  disabled: "group/metadata-ui-disabled opacity-60",
};
