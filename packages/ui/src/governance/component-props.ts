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
  readonly density?: Density;
  readonly emphasis?: VariantEmphasis;
  readonly intent?: VariantIntent;
  readonly presentation?: "default" | "icon";
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Badge.
 *
 * Presentation is intentionally excluded — it is a Button-only primitive dimension.
 * Badge styling is driven by tone, emphasis, density, and size only.
 */
export interface GovernedBadgeProps {
  readonly density?: Density;
  readonly emphasis?: VariantEmphasis;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
  readonly tone?: StatusTone;
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

/**
 * Governed variant props for Collapsible.
 *
 * Collapsible uses the surface recipe with no variant axes — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedCollapsibleProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Resizable panel groups.
 *
 * Resizable uses the surface recipe with no variant axes — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedResizableProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Sidebar provider and shell slots.
 *
 * Sidebar uses the surface recipe with slotKey-driven menu, inset, and rail
 * parts — collapse `data-state` on the body peer is separate from governed
 * interaction state on the provider root.
 */
export interface GovernedSidebarProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Combobox root.
 *
 * Combobox uses the surface recipe with slot-driven styling on trigger, content,
 * list, item, and chip primitives.
 */
export interface GovernedComboboxProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for ButtonGroup root.
 *
 * ButtonGroup uses the surface recipe with orientation slot keys — styling is
 * slot-driven through primitive governance.
 */
export interface GovernedButtonGroupProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Carousel root.
 *
 * Carousel uses the surface recipe with orientation slot keys — styling is
 * slot-driven through primitive governance.
 */
export interface GovernedCarouselProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Tabs.
 *
 * Tabs uses the surface recipe with no variant axes on root — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedTabsProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Breadcrumb root.
 *
 * Breadcrumb uses the surface recipe with no variant axes on root — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedBreadcrumbProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Calendar root.
 *
 * Calendar uses the surface recipe with DayPicker slot keys — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedCalendarProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Chart container root.
 *
 * Chart uses the surface recipe with slotKey-driven tooltip and legend parts —
 * styling is otherwise slot-driven through primitive governance.
 */
export interface GovernedChartProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Menubar root.
 *
 * Menubar uses the surface recipe with no variant axes on root — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedMenubarProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for NavigationMenu root.
 *
 * NavigationMenu uses the surface recipe with no variant axes on root — styling
 * is entirely slot-driven through primitive governance.
 */
export interface GovernedNavigationMenuProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Pagination root.
 *
 * Pagination uses the surface recipe with no variant axes on root — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedPaginationProps {
  readonly state?: GovernedState;
}

/** Alert dialog content size axis — maps to `data-size` on the panel root. */
export type GovernedAlertDialogContentSize = "default" | "sm";

/**
 * Governed variant props for AlertDialog content.
 *
 * AlertDialog uses the surface recipe with a single size axis — styling is
 * otherwise slot-driven through primitive governance.
 */
export interface GovernedAlertDialogProps {
  readonly size?: GovernedAlertDialogContentSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Dialog content.
 *
 * Dialog combines surface recipe axes (`density`, `radius`, `shadow`) on
 * `DialogContent`; `state` maps to governed interaction state on the panel root.
 */
export interface GovernedDialogProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Sheet content.
 *
 * Sheet combines surface recipe axes (`density`, `radius`, `shadow`) on
 * `SheetContent`; `state` maps to governed interaction state on the panel root.
 */
export interface GovernedSheetProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Drawer content.
 *
 * Drawer combines surface recipe axes (`density`, `radius`, `shadow`) on
 * `DrawerContent`; `state` maps to governed interaction state on the panel root.
 */
export interface GovernedDrawerProps {
  readonly state?: GovernedState;
}

/** Governed interaction state on the direction root shell. */
export interface GovernedDirectionProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Command.
 *
 * Command uses the surface recipe with no variant axes — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedCommandProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for ContextMenu root.
 *
 * ContextMenu uses the surface recipe with slotKey-driven parts — styling is
 * otherwise slot-driven through primitive governance.
 */
export interface GovernedContextMenuProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for DropdownMenu root.
 *
 * DropdownMenu uses the surface recipe with slotKey-driven parts — styling is
 * otherwise slot-driven through primitive governance.
 */
export interface GovernedDropdownMenuProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for AspectRatio.
 *
 * AspectRatio uses the surface recipe with no variant axes — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedAspectRatioProps {
  readonly state?: GovernedState;
}

/** Avatar root size axis — maps to `data-size` on the avatar root. */
export type GovernedAvatarSize = "default" | "sm" | "lg";

export const GOVERNED_AVATAR_SIZES = [
  "default",
  "sm",
  "lg",
] as const satisfies readonly GovernedAvatarSize[];

export function isGovernedAvatarSize(
  value: string
): value is GovernedAvatarSize {
  return (GOVERNED_AVATAR_SIZES as readonly string[]).includes(value);
}

/**
 * Governed variant props for Avatar.
 *
 * Avatar uses the form-control recipe with a structural size axis — styling is
 * otherwise slot-driven through primitive governance.
 */
export interface GovernedAvatarProps {
  readonly size?: GovernedAvatarSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for AvatarBadge.
 *
 * Presence and status dots use the tone axis; verified badges omit tone and
 * inherit the default primary badge surface.
 */
export interface GovernedAvatarBadgeProps {
  readonly state?: GovernedState;
  readonly tone?: StatusTone;
}

/** Governed variant props for status and alert presentation. */
export interface GovernedStatusProps {
  readonly density?: Density;
  readonly radius?: GovernedPanelRadius;
  readonly state?: GovernedState;
  readonly tone?: StatusTone;
}

/** Governed variant props for StatusIndicator — alias of {@link GovernedStatusProps}. */
export type GovernedStatusIndicatorProps = GovernedStatusProps;

/** Governed variant props for form field groups. */
export interface GovernedFormControlProps {
  readonly density?: Density | undefined;
  readonly size?: GovernedSize | undefined;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Switch root.
 *
 * Switch uses the form-control recipe with a binary `size` axis (`sm` | `md`).
 */
export type GovernedSwitchSize = "sm" | "md";

export const GOVERNED_SWITCH_SIZES = [
  "sm",
  "md",
] as const satisfies readonly GovernedSwitchSize[];

export function isGovernedSwitchSize(
  value: string
): value is GovernedSwitchSize {
  return (GOVERNED_SWITCH_SIZES as readonly string[]).includes(value);
}

export interface GovernedSwitchProps {
  readonly size?: GovernedSwitchSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for ScrollArea.
 *
 * ScrollArea uses the form-control recipe with no variant axes — styling is
 * entirely slot-driven through primitive governance.
 */
export interface GovernedScrollAreaProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Select root.
 *
 * Select uses the form-control recipe; `state` maps to governed interaction
 * state on the Radix root provider.
 */
export interface GovernedSelectProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Separator root.
 *
 * Separator uses the form-control recipe with orientation handled by Radix;
 * `state` maps to governed interaction state on the divider root.
 */
export interface GovernedSeparatorProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Spinner root.
 *
 * Spinner uses the form-control recipe; `size` controls icon dimensions and
 * `state` maps to governed interaction state on the loading indicator.
 */
export type GovernedSpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export const GOVERNED_SPINNER_SIZES = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies readonly GovernedSpinnerSize[];

export function isGovernedSpinnerSize(
  value: string
): value is GovernedSpinnerSize {
  return (GOVERNED_SPINNER_SIZES as readonly string[]).includes(value);
}

export interface GovernedSpinnerProps {
  readonly size?: GovernedSpinnerSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Toaster root.
 *
 * Toaster uses the surface recipe; `state` maps to governed interaction
 * state on the Sonner mount node.
 */
export interface GovernedToasterProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for HoverCard content.
 *
 * HoverCard combines surface recipe axes (`density`, `radius`, `shadow`) on
 * `HoverCardContent`; `state` maps to governed interaction state on the panel root.
 */
export interface GovernedHoverCardProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for InputGroup root.
 *
 * InputGroup uses the form-control recipe; `density` and `size` shape the
 * group shell, and `state` maps to governed interaction state on the root.
 */
export interface GovernedInputGroupProps {
  readonly density?: Density;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for InputOTP root.
 *
 * InputOTP uses the form-control recipe; `density` and `size` shape the OTP
 * shell, and `state` maps to governed interaction state on the hidden input root.
 */
export interface GovernedInputOtpProps {
  readonly density?: Density;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/**
 * Governed variant props for NativeSelect root.
 *
 * NativeSelect uses the form-control recipe with a native-specific `size` axis
 * (`"sm" | "default"`) on the wrapper and control — not `GovernedSize`.
 */
export interface GovernedNativeSelectProps {
  readonly state?: GovernedState;
}

/** Governed variant props for Popover root. */
export interface GovernedPopoverProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Tooltip root and content.
 *
 * Tooltip uses the surface recipe; `state` maps to governed interaction
 * state on the tooltip shell and content panel.
 */
export interface GovernedTooltipProps {
  readonly state?: GovernedState;
}

/** Governed variant props for data tables. */
export interface GovernedTableProps {
  readonly density?: Density;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/** Governed variant props for TanStack DataTable wrapper. */
export interface GovernedDataTableProps {
  readonly density?: Density;
  readonly size?: GovernedSize;
  readonly state?: GovernedState;
}

/** Toggle visual variant — stock shadcn parity, not a design-system recipe axis. */
export type GovernedToggleVariant = "default" | "outline";

/** Toggle size — stock shadcn parity, not a design-system GovernedSize axis. */
export type GovernedToggleSize = "default" | "sm" | "lg";

/** Governed variant props for ToggleGroup root. */
export interface GovernedToggleGroupProps {
  readonly state?: GovernedState;
}

/** Governed variant props for Toggle and ToggleGroup items. */
export interface GovernedToggleProps {
  readonly size?: GovernedToggleSize;
  readonly state?: GovernedState;
  readonly variant?: GovernedToggleVariant;
}

/** Governed variant props for Empty root. */
export interface GovernedEmptyProps {
  readonly state?: GovernedState;
}

/** Empty media presentation variant — stock shadcn parity. */
export type GovernedEmptyMediaVariant = "default" | "icon";

/** Item root presentation variant — stock shadcn parity. */
export type GovernedItemVariant = "default" | "outline" | "muted";

/** Item root size — stock shadcn parity. */
export type GovernedItemSize = "default" | "sm" | "xs";

/** Item media presentation variant — stock shadcn parity. */
export type GovernedItemMediaVariant = "default" | "icon" | "image";

/**
 * Governed variant props for Item root.
 *
 * Item uses the surface recipe; `variant` and `size` select the root slotKey,
 * and `state` maps to governed interaction state on the row shell.
 */
export interface GovernedItemProps {
  readonly size?: GovernedItemSize;
  readonly state?: GovernedState;
  readonly variant?: GovernedItemVariant;
}

/**
 * Governed variant props for Kbd root and KbdGroup.
 *
 * Kbd uses the form-control recipe as a presentational leaf; only `state` is
 * surfaced on the governed axis API.
 */
export interface GovernedKbdProps {
  readonly state?: GovernedState;
}

/**
 * Governed variant props for Skeleton.
 *
 * Skeleton uses the form-control recipe as a presentational loading leaf; only
 * `state` is surfaced on the governed axis API. Size shape is caller-owned via
 * inline `style` or layout wrappers — not governed variant axes.
 */
export interface GovernedSkeletonProps {
  readonly state?: GovernedState;
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
