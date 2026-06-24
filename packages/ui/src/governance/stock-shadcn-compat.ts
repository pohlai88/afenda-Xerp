import type { GovernedButtonProps } from "./component-props";
import type { GovernedSize } from "./design-system";

/**
 * Temporary stock shadcn Button visual variants.
 *
 * This exists only for components listed in STOCK_SHADCN_PENDING while they are
 * migrated to governed primitive props. Do not expose this as public component API.
 */
export type StockButtonVisual =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

/**
 * Temporary stock shadcn Button size variants.
 *
 * Governed Button uses size + presentation instead of stock icon size variants.
 */
export type StockButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

function assertNever(value: never, context: string): never {
  throw new Error(`${context}: ${String(value)}`);
}

/**
 * @deprecated Production consumers must use governed Button props
 * (intent, emphasis, size, presentation) directly.
 * Retained only for legacy policy tests until fixture cleanup.
 * Gate D pass 7 fails all production usages.
 */
export function mapStockButtonSize(
  size: StockButtonSize = "default"
): Pick<GovernedButtonProps, "size" | "presentation"> {
  switch (size) {
    case "default":
      return { size: "md", presentation: "default" };
    case "xs":
    case "sm":
    case "lg":
      return { size, presentation: "default" };
    case "icon":
      return { size: "md", presentation: "icon" };
    case "icon-xs":
      return { size: "xs", presentation: "icon" };
    case "icon-sm":
      return { size: "sm", presentation: "icon" };
    case "icon-lg":
      return { size: "lg", presentation: "icon" };
    default:
      return assertNever(size, "Unhandled stock button size");
  }
}

/**
 * @deprecated Production consumers must use governed Button props
 * (intent, emphasis, size, presentation) directly.
 * Retained only for legacy policy tests until fixture cleanup.
 * Gate D pass 7 fails all production usages.
 */
export function mapStockButtonVisualToGoverned(
  visual: StockButtonVisual = "default",
  size: GovernedSize = "md"
): GovernedButtonProps {
  switch (visual) {
    case "default":
      return { intent: "primary", emphasis: "solid", size };
    case "outline":
      return { intent: "primary", emphasis: "outline", size };
    case "secondary":
      return { intent: "secondary", emphasis: "solid", size };
    case "ghost":
      return { intent: "quiet", emphasis: "ghost", size };
    case "destructive":
      return { intent: "destructive", emphasis: "solid", size };
    case "link":
      /**
       * Temporary compatibility downgrade.
       * Do not introduce a governed "link" emphasis only for stock shadcn parity.
       */
      return { intent: "primary", emphasis: "ghost", size };
    default:
      return assertNever(visual, "Unhandled stock button visual");
  }
}

/**
 * @deprecated Production consumers must use governed Button props
 * (intent, emphasis, size, presentation) directly.
 * Retained only for legacy policy tests until fixture cleanup.
 * Gate D pass 7 fails all production usages.
 */
export function mapStockButtonProps(
  visual: StockButtonVisual = "default",
  size: StockButtonSize = "default"
): GovernedButtonProps {
  const sizeProps = mapStockButtonSize(size);

  return {
    ...mapStockButtonVisualToGoverned(visual, sizeProps.size ?? "md"),
    ...sizeProps,
  };
}
