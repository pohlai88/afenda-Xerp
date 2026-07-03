import type { AssetIconProps } from "./asset-icon.types.js";
import { ASSET_BRAND_COLORS } from "./asset-brand-colors.registry.js";

const TailwindIcon = ({ variant = "brand", ...props }: AssetIconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565 1.087 2.288 1.98.896 1.093 1.934 2.36 4.188 2.36 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-1.087-2.288-1.98C15.293 5.667 14.255 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565 1.087 2.288 1.98C5.493 18.867 6.531 19.734 8.785 19.734c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-1.087-2.288-1.98C10.707 13.467 9.669 12.6 7.415 12.6h-.414z"
      fill={
        variant === "brand" ? ASSET_BRAND_COLORS.tailwindcss : "currentColor"
      }
    />
  </svg>
);

export default TailwindIcon;
