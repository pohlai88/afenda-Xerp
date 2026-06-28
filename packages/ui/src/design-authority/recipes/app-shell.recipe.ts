import type { RecipeDefinition } from "../contracts/recipe.contract";
import { commonProhibitedOverrides } from "./shared";

/** Visual authority for @afenda/appshell — structure hooks only, no React. */
export const appShellRecipe = {
  name: "app-shell",
  componentKind: "app-shell",
  description:
    "Governed application shell chrome for ERP navigation, context, and workspace switching.",
  variantAxes: ["density", "tone"],
  slots: [
    {
      name: "root",
      role: "root",
      required: true,
      ownsStructureOnly: true,
      description: "Application shell root boundary.",
    },
    {
      name: "sidebar",
      role: "content",
      required: true,
      ownsStructureOnly: true,
      description: "Primary navigation sidebar region.",
    },
    {
      name: "topbar",
      role: "header",
      required: true,
      ownsStructureOnly: true,
      description: "Sticky top bar with global actions.",
    },
    {
      name: "context-rail",
      role: "content",
      required: false,
      ownsStructureOnly: true,
      description: "Tenant / module context rail.",
    },
    {
      name: "command-center",
      role: "actions",
      required: false,
      ownsStructureOnly: true,
      description: "Command palette and search affordance region.",
    },
    {
      name: "utility-bar",
      role: "footer",
      required: false,
      ownsStructureOnly: true,
      description: "Secondary utility actions bar.",
    },
    {
      name: "navigation-item",
      role: "label",
      required: false,
      ownsStructureOnly: true,
      description: "Sidebar navigation item.",
    },
    {
      name: "active-item",
      role: "state",
      required: false,
      ownsStructureOnly: true,
      description: "Active navigation item indicator.",
    },
    {
      name: "workspace-switcher",
      role: "control",
      required: false,
      ownsStructureOnly: true,
      description: "Workspace / org switcher control.",
    },
    {
      name: "attention-item",
      role: "state",
      required: false,
      ownsStructureOnly: true,
      description: "Attention-required nav badge or marker.",
    },
  ],
  declarations: [
    { property: "background", token: "afenda.semantic.surface.canvas" },
    { property: "foreground", token: "afenda.semantic.text.primary" },
    { property: "border", token: "afenda.semantic.border.subtle" },
    { property: "padding", token: "afenda.density.standard.padding-x" },
    { property: "gap", token: "afenda.density.standard.gap" },
    { property: "radius", token: "afenda.semantic.radius.surface" },
    { property: "shadow", token: "afenda.semantic.elevation.flat" },
    { property: "focusRing", token: "afenda.semantic.focus.ring" },
    { property: "transition", token: "afenda.semantic.motion.intent.feedback" },
  ],
  prohibitedOverrides: commonProhibitedOverrides,
} as const satisfies RecipeDefinition;
