import type { RecipeRegistry } from "../contracts/recipe.contract";

const commonProhibitedOverrides = [
  "raw color classes",
  "raw radius classes",
  "raw shadow classes",
  "raw motion classes",
  "component-specific visual hacks",
] as const;

export const AFENDA_RECIPE_REGISTRY = {
  recipes: [
    {
      name: "button",
      componentKind: "button",
      description: "Governed action control for ERP workflows.",
      variantAxes: ["intent", "density", "size", "radius", "emphasis"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Semantic button or link wrapper.",
        },
        {
          name: "icon",
          role: "icon",
          required: false,
          ownsStructureOnly: true,
          description: "Optional leading or trailing icon slot.",
        },
        {
          name: "label",
          role: "label",
          required: true,
          ownsStructureOnly: true,
          description: "Visible command label.",
        },
        {
          name: "state",
          role: "state",
          required: false,
          ownsStructureOnly: true,
          description: "Loading or disabled state indicator.",
        },
      ],
      declarations: [
        {
          property: "font-size",
          token: "afenda.typography.font-size.label.md",
        },
        {
          property: "line-height",
          token: "afenda.typography.line-height.label.md",
        },
        {
          property: "font-weight",
          token: "afenda.typography.font-weight.label.md",
        },
        { property: "padding", token: "afenda.spacing.3" },
        { property: "gap", token: "afenda.spacing.2" },
        { property: "radius", token: "afenda.radius.md" },
        { property: "focusRing", token: "afenda.color.focus.ring" },
        { property: "transition", token: "afenda.motion.duration.fast" },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
    {
      name: "badge",
      componentKind: "badge",
      description: "Governed compact metadata and status indicator.",
      variantAxes: ["tone", "density", "size", "radius", "emphasis"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Inline status container.",
        },
        {
          name: "icon",
          role: "icon",
          required: false,
          ownsStructureOnly: true,
          description: "Optional status icon.",
        },
        {
          name: "label",
          role: "label",
          required: true,
          ownsStructureOnly: true,
          description: "Short readable status text.",
        },
      ],
      declarations: [
        { property: "background", token: "afenda.status-tone.neutral.surface" },
        {
          property: "foreground",
          token: "afenda.status-tone.neutral.foreground",
        },
        { property: "border", token: "afenda.status-tone.neutral.border" },
        { property: "font-size", token: "afenda.typography.font-size.body.sm" },
        {
          property: "line-height",
          token: "afenda.typography.line-height.body.sm",
        },
        {
          property: "font-weight",
          token: "afenda.typography.font-weight.body.sm",
        },
        { property: "padding", token: "afenda.spacing.2" },
        { property: "radius", token: "afenda.radius.sm" },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
    {
      name: "card",
      componentKind: "card",
      description: "Governed content panel for grouped ERP information.",
      variantAxes: ["density", "radius", "shadow"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Panel boundary.",
        },
        {
          name: "header",
          role: "header",
          required: false,
          ownsStructureOnly: true,
          description: "Optional heading and actions region.",
        },
        {
          name: "body",
          role: "body",
          required: true,
          ownsStructureOnly: true,
          description: "Main panel content.",
        },
        {
          name: "footer",
          role: "footer",
          required: false,
          ownsStructureOnly: true,
          description: "Optional footer with summary or actions.",
        },
        {
          name: "actions",
          role: "actions",
          required: false,
          ownsStructureOnly: true,
          description: "Action buttons area.",
        },
      ],
      declarations: [
        { property: "background", token: "afenda.color.surface.card" },
        { property: "foreground", token: "afenda.color.text.default" },
        { property: "border", token: "afenda.color.border.default" },
        { property: "padding", token: "afenda.spacing.4" },
        { property: "radius", token: "afenda.radius.md" },
        { property: "shadow", token: "afenda.shadow.raised" },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
    {
      name: "surface",
      componentKind: "card",
      description: "Governed full-bleed surface for page-level backgrounds.",
      variantAxes: ["density", "radius", "shadow"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Surface boundary.",
        },
        {
          name: "content",
          role: "content",
          required: true,
          ownsStructureOnly: true,
          description: "Main surface content.",
        },
      ],
      declarations: [
        { property: "background", token: "afenda.color.surface.canvas" },
        { property: "foreground", token: "afenda.color.text.default" },
        { property: "padding", token: "afenda.spacing.4" },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
    {
      name: "status",
      componentKind: "status",
      description:
        "Governed loading, empty, error, forbidden, invalid, and ready presentation.",
      variantAxes: ["tone", "density", "radius"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "State boundary with appropriate live region behavior.",
        },
        {
          name: "content",
          role: "content",
          required: true,
          ownsStructureOnly: true,
          description: "State copy and supporting actions.",
        },
      ],
      declarations: [
        { property: "background", token: "afenda.status-tone.info.surface" },
        { property: "foreground", token: "afenda.status-tone.info.foreground" },
        { property: "padding", token: "afenda.spacing.4" },
        { property: "radius", token: "afenda.radius.md" },
        { property: "font-size", token: "afenda.typography.font-size.body.sm" },
        {
          property: "line-height",
          token: "afenda.typography.line-height.body.sm",
        },
        {
          property: "font-weight",
          token: "afenda.typography.font-weight.body.sm",
        },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
    {
      name: "form-control",
      componentKind: "form",
      description: "Governed input grouping with validation states.",
      variantAxes: ["density", "size"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Field group boundary.",
        },
        {
          name: "label",
          role: "label",
          required: true,
          ownsStructureOnly: true,
          description: "Programmatic input label.",
        },
        {
          name: "control",
          role: "control",
          required: true,
          ownsStructureOnly: true,
          description: "Input, select, textarea, or composed control.",
        },
        {
          name: "state",
          role: "state",
          required: false,
          ownsStructureOnly: true,
          description: "Validation or helper message.",
        },
      ],
      declarations: [
        { property: "gap", token: "afenda.spacing.2" },
        { property: "border", token: "afenda.color.border.default" },
        { property: "focusRing", token: "afenda.color.focus.ring" },
        { property: "font-size", token: "afenda.typography.font-size.body.sm" },
        {
          property: "line-height",
          token: "afenda.typography.line-height.body.sm",
        },
        {
          property: "font-weight",
          token: "afenda.typography.font-weight.body.sm",
        },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
    {
      name: "table",
      componentKind: "table",
      description: "Governed data grid presentation for ERP records.",
      variantAxes: ["density", "size"],
      slots: [
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Semantic table or grid boundary.",
        },
        {
          name: "header",
          role: "header",
          required: true,
          ownsStructureOnly: true,
          description: "Column labels and sort affordances.",
        },
        {
          name: "body",
          role: "body",
          required: true,
          ownsStructureOnly: true,
          description: "Record rows.",
        },
      ],
      declarations: [
        { property: "background", token: "afenda.color.surface.card" },
        { property: "border", token: "afenda.color.border.default" },
        { property: "font-size", token: "afenda.typography.font-size.body.sm" },
        {
          property: "line-height",
          token: "afenda.typography.line-height.body.sm",
        },
        {
          property: "font-weight",
          token: "afenda.typography.font-weight.body.sm",
        },
        { property: "padding", token: "afenda.spacing.3" },
      ],
      prohibitedOverrides: commonProhibitedOverrides,
    },
  ],
} as const satisfies RecipeRegistry;

/** @deprecated Use `AFENDA_RECIPE_REGISTRY` instead. */
export const recipeRegistry = AFENDA_RECIPE_REGISTRY;
