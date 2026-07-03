/**
 * L2 brand SVG barrel — Storybook gallery SSOT (`Shadcn Studio/Assets`).
 * L4 default: not re-exported from `@afenda/shadcn-studio` root unless ERP needs a public asset.
 * After adding icons: `pnpm storybook:generate`
 *
 * @see AGENTS.md § L2 assets pipeline
 */

export type { AssetBrandColorKey } from "./asset-brand-colors.registry.js";
export { ASSET_BRAND_COLORS } from "./asset-brand-colors.registry.js";
export type {
  AssetIconProps,
  AssetIconVariant,
} from "./asset-icon.types.js";

export { default as FacebookIcon } from "./icon-facebook.js";
export { default as FigmaIcon } from "./icon-figma.js";
export { default as GitHubIcon } from "./icon-github.js";
export { default as GoogleIcon } from "./icon-google.js";
export { default as InstagramIcon } from "./icon-instagram.js";
export { default as LinkedinIcon } from "./icon-linkedin.js";
export { default as LogoSvg } from "./icon-logo.js";
export { default as MicrosoftIcon } from "./icon-microsoft.js";
export { default as NextjsIcon } from "./icon-nextjs.js";
export { default as ShadcnIcon } from "./icon-shadcn.js";
export { default as SlackIcon } from "./icon-slack.js";
export { default as TailwindIcon } from "./icon-tailwind.js";
export { default as XIcon } from "./icon-x.js";
