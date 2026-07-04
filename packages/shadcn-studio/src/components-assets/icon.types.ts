import type { SVGAttributes } from "react";

export type AssetIconVariant = "brand" | "monochrome";

export type AssetIconProps = SVGAttributes<SVGElement> & {
  readonly variant?: AssetIconVariant;
};
