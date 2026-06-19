import {
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
} from "../contracts/token.contract";
import {
  VARIANT_AXES,
  type VariantRegistry,
} from "../contracts/variant.contract";

const mapOptions = (
  axis: "tone" | "density" | "size" | "radius" | "shadow",
  options: readonly string[]
) =>
  options.map((option) => ({
    axis,
    option,
    meaning: `${axis}=${option} is governed by design-system tokens.`,
    allowedTokenCategories: [axis === "tone" ? "statusTone" : axis],
  }));

export const variantRegistry = {
  axes: VARIANT_AXES,
  variants: [
    {
      axis: "intent",
      option: "primary",
      meaning: "Main task action in a workflow.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "intent",
      option: "secondary",
      meaning: "Alternative task action in a workflow.",
      allowedTokenCategories: ["color"],
    },
    {
      axis: "intent",
      option: "quiet",
      meaning: "Low-emphasis utility action.",
      allowedTokenCategories: ["color"],
    },
    {
      axis: "intent",
      option: "destructive",
      meaning: "Action that can remove or invalidate data.",
      allowedTokenCategories: ["statusTone"],
    },
    {
      axis: "emphasis",
      option: "solid",
      meaning: "Highest visual emphasis for the selected intent.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "emphasis",
      option: "soft",
      meaning: "Readable low-chrome emphasis.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "emphasis",
      option: "outline",
      meaning: "Border-led emphasis.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "emphasis",
      option: "ghost",
      meaning: "No container until interaction.",
      allowedTokenCategories: ["color"],
    },
    ...mapOptions("tone", STATUS_TONES),
    ...mapOptions("density", DENSITIES),
    ...mapOptions("size", SIZES),
    ...mapOptions("radius", RADII),
    ...mapOptions("shadow", SHADOWS),
  ],
} as const satisfies VariantRegistry;
