import type { RecipeDefinition } from "../contracts/recipe.contract";
import { commonProhibitedOverrides } from "./shared";

/** Visual authority for @afenda/metadata-ui structural hooks — no React, no metadata-ui imports. */
export const metadataUiRecipe = {
  name: "metadata-ui",
  componentKind: "metadata-ui",
  description:
    "Governed metadata surface styling for layouts, sections, states, and diagnostics.",
  variantAxes: ["density", "tone"],
  slots: [
    {
      name: "container",
      role: "root",
      required: true,
      ownsStructureOnly: true,
      description: "Metadata container root (.metadata-container).",
    },
    {
      name: "surface",
      role: "content",
      required: false,
      ownsStructureOnly: true,
      description: "Metadata surface region (.metadata-surface).",
    },
    {
      name: "layout",
      role: "body",
      required: false,
      ownsStructureOnly: true,
      description: "Metadata layout stack (.metadata-layout).",
    },
    {
      name: "section",
      role: "content",
      required: false,
      ownsStructureOnly: true,
      description: "Metadata section block (.metadata-section).",
    },
    {
      name: "section-header",
      role: "header",
      required: false,
      ownsStructureOnly: true,
      description: "Section header row (.metadata-section-header).",
    },
    {
      name: "action-bar",
      role: "actions",
      required: false,
      ownsStructureOnly: true,
      description: "Section action bar (.metadata-action-bar).",
    },
    {
      name: "state",
      role: "state",
      required: false,
      ownsStructureOnly: true,
      description: "Empty / error / loading state (.metadata-state).",
    },
    {
      name: "diagnostics",
      role: "content",
      required: false,
      ownsStructureOnly: true,
      description: "Diagnostics panel (.metadata-diagnostics-panel).",
    },
    {
      name: "numeric",
      role: "label",
      required: false,
      ownsStructureOnly: true,
      description: "Tabular numeric cells (.metadata-numeric).",
    },
    {
      name: "readonly",
      role: "state",
      required: false,
      ownsStructureOnly: true,
      description: "Read-only surface modifier.",
    },
    {
      name: "disabled",
      role: "state",
      required: false,
      ownsStructureOnly: true,
      description: "Disabled surface modifier.",
    },
  ],
  declarations: [
    { property: "background", token: "afenda.semantic.surface.card" },
    { property: "foreground", token: "afenda.semantic.text.primary" },
    { property: "border", token: "afenda.semantic.border.subtle" },
    { property: "padding", token: "afenda.density.standard.padding-x" },
    { property: "gap", token: "afenda.density.standard.section-gap" },
    { property: "radius", token: "afenda.semantic.radius.card" },
    { property: "font-size", token: "afenda.semantic.type.body-sm" },
    { property: "line-height", token: "afenda.typography.line-height.body.sm" },
    { property: "focusRing", token: "afenda.semantic.focus.ring" },
  ],
  prohibitedOverrides: commonProhibitedOverrides,
} as const satisfies RecipeDefinition;
