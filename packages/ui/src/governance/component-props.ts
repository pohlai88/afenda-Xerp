import type {
  Density,
  GovernedSize,
  StatusTone,
  VariantEmphasis,
  VariantIntent,
} from "./design-system";

/**
 * Governed panel radius subset used by card-like and surface-like recipes.
 *
 * This is intentionally narrower than the full design-system radius registry.
 * Components must not invent local radius values.
 */
export type GovernedPanelRadius = "none" | "sm" | "md" | "lg";

/**
 * Governed panel shadow subset used by card-like and surface-like recipes.
 *
 * This is intentionally narrower than the full design-system shadow registry.
 * Components must not invent local shadow values.
 */
export type GovernedPanelShadow = "none" | "raised" | "overlay";

export const GOVERNED_PANEL_RADII = [
  "none",
  "sm",
  "md",
  "lg",
] as const satisfies readonly GovernedPanelRadius[];

export const GOVERNED_PANEL_SHADOWS = [
  "none",
  "raised",
  "overlay",
] as const satisfies readonly GovernedPanelShadow[];

export function isGovernedPanelRadius(
  value: string
): value is GovernedPanelRadius {
  return (GOVERNED_PANEL_RADII as readonly string[]).includes(value);
}

export function isGovernedPanelShadow(
  value: string
): value is GovernedPanelShadow {
  return (GOVERNED_PANEL_SHADOWS as readonly string[]).includes(value);
}

/** Governed variant props for Button. */
export interface GovernedButtonProps {
  readonly intent?: VariantIntent;
  readonly emphasis?: VariantEmphasis;
  readonly size?: GovernedSize;
  readonly density?: Density;
  readonly presentation?: "default" | "icon";
}

/** Governed variant props for Badge. */
export interface GovernedBadgeProps {
  readonly tone?: StatusTone;
  readonly emphasis?: VariantEmphasis;
  readonly density?: Density;
  readonly size?: GovernedSize;
}

/** Governed variant props for Card. */
export interface GovernedCardProps {
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
  readonly shadow?: GovernedPanelShadow;
}

/** Governed variant props for page-level and overlay surfaces. */
export interface GovernedSurfaceProps {
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
  readonly shadow?: GovernedPanelShadow;
}

/** Governed variant props for status and alert presentation. */
export interface GovernedStatusProps {
  readonly tone?: StatusTone;
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
}

/** Governed variant props for form field groups. */
export interface GovernedFormControlProps {
  readonly density?: Density | undefined;
  readonly size?: GovernedSize | undefined;
}

/** Governed variant props for data tables. */
export interface GovernedTableProps {
  readonly density?: Density;
  readonly size?: GovernedSize;
}

/**
 * @deprecated Use GovernedPanelRadius.
 * Kept temporarily for migration compatibility only.
 */
export type GovernedCardRadius = GovernedPanelRadius;

/**
 * @deprecated Use GovernedPanelShadow.
 * Kept temporarily for migration compatibility only.
 */
export type GovernedCardShadow = GovernedPanelShadow;

/**
 * @deprecated Use GOVERNED_PANEL_RADII.
 * Kept temporarily for migration compatibility only.
 */
export const GOVERNED_CARD_RADII = GOVERNED_PANEL_RADII;

/**
 * @deprecated Use GOVERNED_PANEL_SHADOWS.
 * Kept temporarily for migration compatibility only.
 */
export const GOVERNED_CARD_SHADOWS = GOVERNED_PANEL_SHADOWS;

/**
 * @deprecated Use isGovernedPanelRadius.
 * Kept temporarily for migration compatibility only.
 */
export const isGovernedCardRadius = isGovernedPanelRadius;

/**
 * @deprecated Use isGovernedPanelShadow.
 * Kept temporarily for migration compatibility only.
 */
export const isGovernedCardShadow = isGovernedPanelShadow;

/** @deprecated Use GovernedButtonProps. */
export type AfendaButtonProps = GovernedButtonProps;

/** @deprecated Use GovernedBadgeProps. */
export type AfendaBadgeProps = GovernedBadgeProps;

/** @deprecated Use GovernedCardProps. */
export type AfendaCardProps = GovernedCardProps;
