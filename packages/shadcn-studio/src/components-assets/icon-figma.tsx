import type { AssetIconProps } from "./icon.types.js";

const FIGMA_BRAND_COLORS = [
  "#F24E1E",
  "#FF7262",
  "#A259FF",
  "#1ABCFE",
  "#0ACF83",
] as const;

const FIGMA_PATHS = [
  "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z",
  "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z",
  "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z",
  "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z",
  "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z",
] as const;

const FigmaIcon = ({ variant = "brand", ...props }: AssetIconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {FIGMA_PATHS.map((path, index) => (
      <path
        d={path}
        fill={variant === "brand" ? FIGMA_BRAND_COLORS[index] : "currentColor"}
        key={path}
      />
    ))}
  </svg>
);

export default FigmaIcon;
