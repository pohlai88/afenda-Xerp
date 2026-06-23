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
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  type VariantAxis,
  type VariantEmphasis,
  type VariantIntent,
  type VariantSelection,
} from "./design-system";
import { getGovernanceRuntimeMode, isDevelopment } from "./dev-env";
import {
  BADGE_VARIANT_AXES,
  BUTTON_VARIANT_AXES,
  CARD_VARIANT_AXES,
  FORM_CONTROL_VARIANT_AXES,
  STATUS_VARIANT_AXES,
  SURFACE_VARIANT_AXES,
  TABLE_VARIANT_AXES,
} from "./recipe-coverage";

export {
  BADGE_VARIANT_AXES,
  BUTTON_VARIANT_AXES,
  CARD_VARIANT_AXES,
  FORM_CONTROL_VARIANT_AXES,
  STATUS_VARIANT_AXES,
  SURFACE_VARIANT_AXES,
  TABLE_VARIANT_AXES,
} from "./recipe-coverage";

export interface VariantPolicyViolation {
  readonly axis?: string;
  readonly reason: "unknown-axis" | "disallowed-axis" | "unsupported-value";
  readonly value?: string;
}

export interface VariantPolicyResult {
  readonly valid: boolean;
  readonly violations: readonly VariantPolicyViolation[];
}

interface AxisOptionMap {
  density: Density;
  emphasis: VariantEmphasis;
  intent: VariantIntent;
  radius: GovernedRadius;
  shadow: GovernedShadow;
  size: GovernedSize;
  tone: StatusTone;
}

const axisOptions = {
  intent: VARIANT_INTENTS,
  emphasis: VARIANT_EMPHASES,
  tone: STATUS_TONES,
  density: DENSITIES,
  size: SIZES,
  radius: RADII,
  shadow: SHADOWS,
} as const satisfies {
  readonly [K in VariantAxis]: readonly AxisOptionMap[K][];
};

function isVariantAxis(value: string): value is VariantAxis {
  return (VARIANT_AXES as readonly string[]).includes(value);
}

function isAllowedOption<K extends VariantAxis>(
  axis: K,
  value: string
): value is AxisOptionMap[K] {
  return (axisOptions[axis] as readonly string[]).includes(value);
}

function readAxisValue<K extends VariantAxis>(
  selection: VariantSelection,
  axis: K
): AxisOptionMap[K] | undefined {
  return selection[axis] as AxisOptionMap[K] | undefined;
}

function getProvidedAxes(selection: VariantSelection): readonly VariantAxis[] {
  return VARIANT_AXES.filter(
    (axis) => readAxisValue(selection, axis) !== undefined
  );
}

function assignAxisValue<K extends VariantAxis>(
  target: VariantSelection,
  axis: K,
  value: AxisOptionMap[K]
): VariantSelection {
  return { ...target, [axis]: value };
}

export function validateGovernedVariant(
  selection: VariantSelection,
  allowedAxes?: readonly VariantAxis[]
): VariantPolicyResult {
  const violations: VariantPolicyViolation[] = [];

  for (const key of Object.keys(selection)) {
    if (!isVariantAxis(key)) {
      violations.push({
        axis: key,
        reason: "unknown-axis",
      });
      continue;
    }

    if (allowedAxes && !allowedAxes.includes(key)) {
      violations.push({
        axis: key,
        reason: "disallowed-axis",
      });
      continue;
    }

    const value = selection[key];

    if (value !== undefined && !isAllowedOption(key, String(value))) {
      violations.push({
        axis: key,
        value: String(value),
        reason: "unsupported-value",
      });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

function formatVariantPolicyViolation(
  result: VariantPolicyResult,
  allowedAxes?: readonly VariantAxis[]
): string {
  const details = result.violations
    .map((violation) => {
      if (violation.reason === "unknown-axis") {
        return `${violation.axis} (unknown axis)`;
      }

      if (violation.reason === "disallowed-axis") {
        return `${violation.axis} (disallowed for recipe)`;
      }

      return `${violation.axis}=${violation.value} (unsupported value)`;
    })
    .join(", ");

  const allowedAxisMessage = allowedAxes
    ? ` Allowed axes for this recipe: ${allowedAxes.join(", ")}.`
    : ` Allowed governed axes: ${VARIANT_AXES.join(", ")}.`;

  return `TIP-004 variant policy violation. ${details}.${allowedAxisMessage}`;
}

export function assertGovernedVariantStrict(
  selection: VariantSelection,
  allowedAxes?: readonly VariantAxis[]
): void {
  const result = validateGovernedVariant(selection, allowedAxes);

  if (!result.valid) {
    throw new Error(formatVariantPolicyViolation(result, allowedAxes));
  }
}

function assertGovernedVariantInDevelopment(
  selection: VariantSelection,
  allowedAxes?: readonly VariantAxis[]
): void {
  if (!isDevelopment || getGovernanceRuntimeMode() === "off") {
    return;
  }

  assertGovernedVariantStrict(selection, allowedAxes);
}

export function resolveGovernedVariant(
  selection: VariantSelection,
  allowedAxes?: readonly VariantAxis[]
): VariantSelection {
  assertGovernedVariantInDevelopment(selection, allowedAxes);

  const axes = allowedAxes ?? getProvidedAxes(selection);
  let normalized: VariantSelection = {};

  for (const axis of axes) {
    const value = readAxisValue(selection, axis);

    if (value === undefined) {
      continue;
    }

    if (!isAllowedOption(axis, value)) {
      continue;
    }

    normalized = assignAxisValue(normalized, axis, value);
  }

  return normalized;
}

export function resolveGovernedVariantStrict(
  selection: VariantSelection,
  allowedAxes?: readonly VariantAxis[]
): VariantSelection {
  assertGovernedVariantStrict(selection, allowedAxes);
  return resolveGovernedVariant(selection, allowedAxes);
}

export function resolveButtonVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, BUTTON_VARIANT_AXES);
}

export function resolveButtonVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, BUTTON_VARIANT_AXES);
}

export function resolveBadgeVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, BADGE_VARIANT_AXES);
}

export function resolveBadgeVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, BADGE_VARIANT_AXES);
}

export function resolveCardVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, CARD_VARIANT_AXES);
}

export function resolveCardVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, CARD_VARIANT_AXES);
}

export function resolveSurfaceVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, SURFACE_VARIANT_AXES);
}

export function resolveSurfaceVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, SURFACE_VARIANT_AXES);
}

export function resolveStatusVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, STATUS_VARIANT_AXES);
}

export function resolveStatusVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, STATUS_VARIANT_AXES);
}

export function resolveFormControlVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, FORM_CONTROL_VARIANT_AXES);
}

export function resolveFormControlVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, FORM_CONTROL_VARIANT_AXES);
}

export function resolveTableVariant(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariant(selection, TABLE_VARIANT_AXES);
}

export function resolveTableVariantStrict(
  selection: VariantSelection
): VariantSelection {
  return resolveGovernedVariantStrict(selection, TABLE_VARIANT_AXES);
}
