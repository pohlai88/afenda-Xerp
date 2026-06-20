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

// ─── Axis → token category mapping ────────────────────────────────────────────

/**
 * Maps variant axes that do not share a name with their governing token
 * category to the correct category.
 *
 * `satisfies` verifies every value is a real TokenCategory at compile time.
 */
type MappableAxis = "tone" | "density" | "size" | "radius" | "shadow";

const AXIS_TO_TOKEN_CATEGORY = {
  tone: "statusTone",
  density: "density",
  size: "spacing",
  radius: "radius",
  shadow: "shadow",
} as const satisfies Record<MappableAxis, TokenCategory>;

interface AxisOptionType {
  readonly density: Density;
  readonly radius: GovernedRadius;
  readonly shadow: GovernedShadow;
  readonly size: GovernedSize;
  readonly tone: StatusTone;
}

/**
 * Generates `VariantDefinition` entries for a single axis from its governed
 * option array.
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

// ─── Registry ─────────────────────────────────────────────────────────────────

const variantDefinitions = [
  // ── Intent ─────────────────────────────────────────────────────────────────
  {
    axis: "intent" as const,
    option: VARIANT_INTENTS[0],
    meaning: "Main task action in a workflow.",
    allowedTokenCategories: ["color", "statusTone"] as const,
  },
  {
    axis: "intent" as const,
    option: VARIANT_INTENTS[1],
    meaning: "Alternative task action in a workflow.",
    allowedTokenCategories: ["color"] as const,
  },
  {
    axis: "intent" as const,
    option: VARIANT_INTENTS[2],
    meaning: "Low-emphasis utility action.",
    allowedTokenCategories: ["color"] as const,
  },
  {
    axis: "intent" as const,
    option: VARIANT_INTENTS[3],
    meaning: "Action that can remove or invalidate data.",
    allowedTokenCategories: ["statusTone"] as const,
  },
  // ── Emphasis ────────────────────────────────────────────────────────────────
  {
    axis: "emphasis" as const,
    option: VARIANT_EMPHASES[0],
    meaning: "Highest visual emphasis for the selected intent.",
    allowedTokenCategories: ["color", "statusTone"] as const,
  },
  {
    axis: "emphasis" as const,
    option: VARIANT_EMPHASES[1],
    meaning: "Readable low-chrome emphasis.",
    allowedTokenCategories: ["color", "statusTone"] as const,
  },
  {
    axis: "emphasis" as const,
    option: VARIANT_EMPHASES[2],
    meaning: "Border-led emphasis.",
    allowedTokenCategories: ["color", "statusTone"] as const,
  },
  {
    axis: "emphasis" as const,
    option: VARIANT_EMPHASES[3],
    meaning: "No container until interaction.",
    allowedTokenCategories: ["color"] as const,
  },
  // ── Enum-driven axes ────────────────────────────────────────────────────────
  ...mapOptions("tone", STATUS_TONES),
  ...mapOptions("density", DENSITIES),
  ...mapOptions("size", SIZES),
  ...mapOptions("radius", RADII),
  ...mapOptions("shadow", SHADOWS),
] as const satisfies readonly VariantDefinition[];

export const AFENDA_VARIANT_REGISTRY = {
  axes: VARIANT_AXES,
  variants: variantDefinitions,
} as const satisfies VariantRegistry;

/** All governed variant axes. */
export const AFENDA_VARIANT_AXES = VARIANT_AXES;

/** All governed variant options, flattened by axis. */
export const AFENDA_VARIANT_OPTIONS = {
  intent: VARIANT_INTENTS,
  emphasis: VARIANT_EMPHASES,
  tone: STATUS_TONES,
  density: DENSITIES,
  size: SIZES,
  radius: RADII,
  shadow: SHADOWS,
} as const;

/** @deprecated Use `AFENDA_VARIANT_REGISTRY` instead. */
export const variantRegistry = AFENDA_VARIANT_REGISTRY;
