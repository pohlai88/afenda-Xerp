import {
  DENSITIES,
  type Density,
  type GovernedRadius,
  type GovernedShadow,
  type GovernedSize,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  type StatusTone,
  type TokenCategory,
} from "../contracts/token.contract";
import {
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  type VariantDefinition,
  type VariantRegistry,
} from "../contracts/variant.contract";

/**
 * Maps variant axes that do not share a name with their governing token
 * category to the correct category.
 *
 * Key insight: the variant axis name ("tone", "size") is a UI concept, while
 * the token category name ("statusTone", "spacing") is a design-token concept.
 * This map is the canonical bridge between the two.
 *
 * `satisfies` verifies every value is a real TokenCategory at compile time —
 * adding an axis that maps to a non-existent category is a type error here.
 */
type MappableAxis = "tone" | "density" | "size" | "radius" | "shadow";

const AXIS_TO_TOKEN_CATEGORY = {
  tone: "statusTone",
  density: "density",
  size: "spacing", // size variants → spacing tokens (padding, gap, height)
  radius: "radius",
  shadow: "shadow",
} as const satisfies Record<MappableAxis, TokenCategory>;

/**
 * Maps each mappable axis to the type of its valid option values.
 * Used to constrain the `mapOptions` generic so that only governed option
 * values (e.g. `StatusTone` for "tone", `Density` for "density") can be
 * passed in — preventing accidental typos or unlisted values.
 */
interface AxisOptionType {
  readonly density: Density;
  readonly radius: GovernedRadius;
  readonly shadow: GovernedShadow;
  readonly size: GovernedSize;
  readonly tone: StatusTone;
}

/**
 * Generates `VariantDefinition` entries for a single axis from its governed
 * option array. The generic constraints ensure:
 *   1. `axis` must be a key in `AXIS_TO_TOKEN_CATEGORY` (a real mappable axis).
 *   2. `options` must be the exact governed type for that axis (e.g. StatusTone[]).
 * Both the axis→category mapping and the option types are validated at compile
 * time — a mismatch is a type error, not a runtime surprise.
 */
const mapOptions = <TAxis extends MappableAxis>(
  axis: TAxis,
  options: readonly AxisOptionType[TAxis][]
): readonly VariantDefinition[] =>
  options.map((option) => ({
    axis,
    option,
    meaning: `${axis}=${option} is governed by design-system tokens.`,
    allowedTokenCategories: [AXIS_TO_TOKEN_CATEGORY[axis]],
  }));

export const variantRegistry = {
  axes: VARIANT_AXES,
  variants: [
    // ── Intent ─────────────────────────────────────────────────────────────
    {
      axis: "intent",
      option: VARIANT_INTENTS[0], // "primary"
      meaning: "Main task action in a workflow.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "intent",
      option: VARIANT_INTENTS[1], // "secondary"
      meaning: "Alternative task action in a workflow.",
      allowedTokenCategories: ["color"],
    },
    {
      axis: "intent",
      option: VARIANT_INTENTS[2], // "quiet"
      meaning: "Low-emphasis utility action.",
      allowedTokenCategories: ["color"],
    },
    {
      axis: "intent",
      option: VARIANT_INTENTS[3], // "destructive"
      meaning: "Action that can remove or invalidate data.",
      allowedTokenCategories: ["statusTone"],
    },

    // ── Emphasis ────────────────────────────────────────────────────────────
    {
      axis: "emphasis",
      option: VARIANT_EMPHASES[0], // "solid"
      meaning: "Highest visual emphasis for the selected intent.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "emphasis",
      option: VARIANT_EMPHASES[1], // "soft"
      meaning: "Readable low-chrome emphasis.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "emphasis",
      option: VARIANT_EMPHASES[2], // "outline"
      meaning: "Border-led emphasis.",
      allowedTokenCategories: ["color", "statusTone"],
    },
    {
      axis: "emphasis",
      option: VARIANT_EMPHASES[3], // "ghost"
      meaning: "No container until interaction.",
      allowedTokenCategories: ["color"],
    },

    // ── Enum-driven axes (generated from governed option arrays) ────────────
    ...mapOptions("tone", STATUS_TONES),
    ...mapOptions("density", DENSITIES),
    ...mapOptions("size", SIZES),
    ...mapOptions("radius", RADII),
    ...mapOptions("shadow", SHADOWS),
  ],
} as const satisfies VariantRegistry;
