/**
 * Third-party brand hex SSOT for `components-assets/` (Simple Icons slugs).
 * Afenda semantic UI colors remain in Figma → shadcn-default.css — not here.
 *
 * @see https://simpleicons.org/
 */
interface AssetBrandColorRegistry {
  facebook: string;
  figma: readonly [string, string, string, string, string];
  github: string;
  google: readonly [string, string, string, string];
  instagram: readonly [string, string, string];
  linkedin: string;
  nextjs: string;
  shadcn: string;
  slack: string;
  tailwindcss: string;
  x: {
    readonly light: string;
    readonly dark: string;
  };
}

export const ASSET_BRAND_COLORS = {
  facebook: "#1877F2",
  figma: ["#F24E1E", "#FF7262", "#A259FF", "#1ABCFE", "#0ACF83"],
  google: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
  github: "#181717",
  instagram: ["#FEDA75", "#FA7E1E", "#D62976"],
  linkedin: "#0A66C2",
  nextjs: "#000000",
  shadcn: "#000000",
  slack: "#4A154B",
  tailwindcss: "#06B6D4",
  x: { light: "#14171A", dark: "#FFFFFF" },
} satisfies AssetBrandColorRegistry;

export type AssetBrandColorKey = keyof typeof ASSET_BRAND_COLORS;
