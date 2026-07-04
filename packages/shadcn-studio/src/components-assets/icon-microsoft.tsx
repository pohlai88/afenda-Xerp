import type { AssetIconProps } from "./icon.types.js";

const MicrosoftIcon = ({ variant = "brand", ...props }: AssetIconProps) => {
  const colors =
    variant === "brand"
      ? {
          primary: "#0078D4",
          green: "#7FBA00",
          red: "#F25022",
          blue: "#00A4EF",
        }
      : {
          primary: "currentColor",
          green: "currentColor",
          red: "currentColor",
          blue: "currentColor",
        };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 1h10v10H1z" fill={colors.red} />
      <path d="M13 1h10v10H13z" fill={colors.green} />
      <path d="M1 13h10v10H1z" fill={colors.primary} />
      <path d="M13 13h10v10H13z" fill={colors.blue} />
    </svg>
  );
};

export default MicrosoftIcon;
