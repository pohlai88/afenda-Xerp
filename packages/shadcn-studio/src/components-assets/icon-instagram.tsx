import { useId } from "react";

import type { AssetIconProps } from "./asset-icon.types.js";

const InstagramIcon = ({
  variant = "brand",
  ...props
}: AssetIconProps) => {
  const gradientId = useId();

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
    {variant === "brand" ? (
      <>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            x1="2"
            x2="22"
            y1="22"
            y2="2"
          >
            <stop stopColor="#FEDA75" />
            <stop offset="0.5" stopColor="#FA7E1E" />
            <stop offset="1" stopColor="#D62976" />
          </linearGradient>
        </defs>
        <rect
          fill={`url(#${gradientId})`}
          height="20"
          rx="5"
          ry="5"
          width="20"
          x="2"
          y="2"
        />
        <circle cx="12" cy="12" fill="none" r="4" stroke="#fff" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" fill="#fff" r="1.25" />
      </>
    ) : (
      <>
        <rect
          height="20"
          rx="5"
          ry="5"
          stroke="currentColor"
          strokeWidth="2"
          width="20"
          x="2"
          y="2"
        />
        <path
          d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          stroke="currentColor"
          strokeWidth="2"
          x1="17.5"
          x2="17.51"
          y1="6.5"
          y2="6.5"
        />
      </>
    )}
  </svg>
  );
};

export default InstagramIcon;
