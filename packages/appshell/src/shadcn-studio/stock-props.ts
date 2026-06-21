import type { GovernedButtonProps } from "@afenda/ui/governance";
import {
  mapStockButtonSize,
  mapStockButtonVisualToGoverned,
  type StockButtonSize,
  type StockButtonVisual,
} from "@afenda/ui/governance";

export function resolveStockButtonProps(options: {
  readonly variant?: StockButtonVisual;
  readonly size?: StockButtonSize;
}): GovernedButtonProps {
  const sizeProps = mapStockButtonSize(options.size ?? "default");
  const visualProps = mapStockButtonVisualToGoverned(
    options.variant ?? "default",
    sizeProps.size
  );

  return {
    ...visualProps,
    ...sizeProps,
  };
}
