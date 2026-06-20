import type {
  Density,
  GovernedSize,
  GovernedState,
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
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Badge.
 *
 * Presentation is intentionally excluded — it is a Button-only primitive dimension.
 * Badge styling is driven by tone, emphasis, density, and size only.
 */
export interface GovernedBadgeProps {
  readonly tone?: StatusTone;
  readonly emphasis?: VariantEmphasis;
  readonly density?: Density;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/** Governed variant props for Card. */
export type GovernedCardLayoutSize = "default" | "sm";

export const GOVERNED_CARD_LAYOUT_SIZES = [
  "default",
  "sm",
] as const satisfies readonly GovernedCardLayoutSize[];

export function isGovernedCardLayoutSize(
  value: string
): value is GovernedCardLayoutSize {
  return (GOVERNED_CARD_LAYOUT_SIZES as readonly string[]).includes(value);
}

/**
 * Governed variant props for Card.
 *
 * Presentation is intentionally excluded — it is a Button-only primitive dimension.
 * Card `size` is a structural layout dimension for slot group-data selectors, not a
 * design-system recipe variant axis.
 */
export interface GovernedCardProps {
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
  readonly shadow?: GovernedPanelShadow;
  readonly size?: GovernedCardLayoutSize;
  readonly state?: GovernedState;
}

/** Governed variant props for page-level and overlay surfaces. */
export interface GovernedSurfaceProps {
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
  readonly shadow?: GovernedPanelShadow;
}

/**
 * Governed variant props for Accordion.
 *
 * Accordion uses the surface recipe with no variant axes — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedAccordionProps {
  readonly state?: GovernedState;
}

/** Governed variant props for status and alert presentation. */
export interface GovernedStatusProps {
  readonly tone?: StatusTone;
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
  readonly state?: GovernedState;
}

/** Governed variant props for form field groups. */
export interface GovernedFormControlProps {
  readonly density?: Density | undefined;
  readonly size?: GovernedSize | undefined;
  readonly state?: GovernedState;
}

/** Governed variant props for data tables. */
export interface GovernedTableProps {
  readonly density?: Density;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/** Toggle visual variant — stock shadcn parity, not a design-system recipe axis. */
export type GovernedToggleVariant = "default" | "outline";

/** Toggle size — stock shadcn parity, not a design-system GovernedSize axis. */
export type GovernedToggleSize = "default" | "sm" | "lg";

/** Governed variant props for Toggle and ToggleGroup items. */
export interface GovernedToggleProps {
  readonly variant?: GovernedToggleVariant;
  readonly size?: GovernedToggleSize;
  readonly state?: GovernedState;
}

/** Empty media presentation variant — stock shadcn parity. */
export type GovernedEmptyMediaVariant = "default" | "icon";

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
