/**
 * Third-party brand hex SSOT for `components-assets/` (Simple Icons slugs).
 * Afenda semantic UI colors remain in Figma → shadcn-studio.css — not here.
 *
 * @see https://simpleicons.org/
 */
export const ASSET_BRAND_COLORS = {
  facebook: "#1877F2",
  figma: ["#F24E1E", "#FF7262", "#A259FF", "#1ABCFE", "#0ACF83"] as const,
  google: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"] as const,
  github: "#181717",
  instagram: ["#FEDA75", "#FA7E1E", "#D62976"] as const,
  linkedin: "#0A66C2",
  nextjs: "#000000",
  shadcn: "#000000",
  slack: "#4A154B",
  tailwindcss: "#06B6D4",
  x: { light: "#14171A", dark: "#FFFFFF" } as const,
} as const;

export type AssetBrandColorKey = keyof typeof ASSET_BRAND_COLORS;
