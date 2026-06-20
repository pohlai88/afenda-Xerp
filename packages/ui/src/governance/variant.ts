import {
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  type VariantAxis,
  type VariantSelection,
} from "./design-system";

const isDevelopment = process.env["NODE_ENV"] !== "production";

const axisOptions = {
  intent: VARIANT_INTENTS,
  emphasis: VARIANT_EMPHASES,
  tone: STATUS_TONES,
  density: DENSITIES,
  size: SIZES,
  radius: RADII,
  shadow: SHADOWS,
} as const satisfies Record<VariantAxis, readonly string[]>;

const axisValueGetters = {
  intent: (selection: VariantSelection) => selection.intent,
  emphasis: (selection: VariantSelection) => selection.emphasis,
  tone: (selection: VariantSelection) => selection.tone,
  density: (selection: VariantSelection) => selection.density,
  size: (selection: VariantSelection) => selection.size,
  radius: (selection: VariantSelection) => selection.radius,
  shadow: (selection: VariantSelection) => selection.shadow,
} as const satisfies {
  readonly [K in VariantAxis]: (selection: VariantSelection) => string | undefined;
};

type MutableVariantSelection = {
  -readonly [K in keyof VariantSelection]: VariantSelection[K];
};

export const BUTTON_VARIANT_AXES = [
  "intent",
  "density",
  "size",
  "radius",
  "emphasis",
] as const satisfies readonly VariantAxis[];

export const BADGE_VARIANT_AXES = [
  "tone",
  "density",
  "size",
  "radius",
  "emphasis",
] as const satisfies readonly VariantAxis[];

export const CARD_VARIANT_AXES = [
  "density",
  "radius",
  "shadow",
] as const satisfies readonly VariantAxis[];

function isVariantAxis(value: string): value is VariantAxis {
  return (VARIANT_AXES as readonly string[]).includes(value);
}

function isAllowedOption(axis: VariantAxis, value: string): boolean {
  return (axisOptions[axis] as readonly string[]).includes(value);
}

function getProvidedAxes(selection: VariantSelection): readonly VariantAxis[] {
  return VARIANT_AXES.filter(
    (axis) => axisValueGetters[axis](selection) !== undefined
  );
}

function assertNoUnknownVariantKeys(selection: VariantSelection): void {
  if (!isDevelopment) {
    return;
  }

  const unknownKeys = Object.keys(selection).filter((key) => !isVariantAxis(key));

  if (unknownKeys.length > 0) {
    throw new Error(
      `TIP-004 variant policy violation. Unknown variant keys: ${unknownKeys.join(
        ", "
      )}. Use only governed variant axes: ${VARIANT_AXES.join(", ")}.`
    );
  }
}

function assertAllowedAxes(
  providedAxes: readonly VariantAxis[],
  allowedAxes: readonly VariantAxis[]
): void {
  if (!isDevelopment) {
    return;
  }

  const disallowedAxes = providedAxes.filter((axis) => !allowedAxes.includes(axis));

  if (disallowedAxes.length > 0) {
    throw new Error(
      `TIP-004 variant policy violation. Disallowed variant axes: ${disallowedAxes.join(
        ", "
      )}. Allowed for this component: ${allowedAxes.join(", ")}.`
    );
  }
}

function assignVariantValue(
  target: MutableVariantSelection,
  axis: VariantAxis,
  value: string
): void {
  switch (axis) {
    case "intent":
      target.intent = value as NonNullable<VariantSelection["intent"]>;
      return;
    case "emphasis":
      target.emphasis = value as NonNullable<VariantSelection["emphasis"]>;
      return;
    case "tone":
      target.tone = value as NonNullable<VariantSelection["tone"]>;
      return;
    case "density":
      target.density = value as NonNullable<VariantSelection["density"]>;
      return;
    case "size":
      target.size = value as NonNullable<VariantSelection["size"]>;
      return;
    case "radius":
      target.radius = value as NonNullable<VariantSelection["radius"]>;
      return;
    case "shadow":
      target.shadow = value as NonNullable<VariantSelection["shadow"]>;
      return;
  }
}

export function resolveGovernedVariant(
  selection: VariantSelection,
  allowedAxes?: readonly VariantAxis[]
): VariantSelection {
  assertNoUnknownVariantKeys(selection);

  const providedAxes = getProvidedAxes(selection);
  const axes = allowedAxes ?? providedAxes;

  if (allowedAxes) {
    assertAllowedAxes(providedAxes, allowedAxes);
  }

  const normalized: MutableVariantSelection = {};

  for (const axis of axes) {
    const value = axisValueGetters[axis](selection);

    if (value === undefined) {
      continue;
    }

    if (!isAllowedOption(axis, value)) {
      if (isDevelopment) {
        throw new Error(
          `TIP-004 variant policy violation. Unsupported ${axis} value "${value}". Allowed: ${axisOptions[
            axis
          ].join(", ")}.`
        );
      }

      continue;
    }

    assignVariantValue(normalized, axis, value);
  }

  return normalized;
}

export function resolveButtonVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, BUTTON_VARIANT_AXES);
}

export function resolveBadgeVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, BADGE_VARIANT_AXES);
}

export function resolveCardVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, CARD_VARIANT_AXES);
}
