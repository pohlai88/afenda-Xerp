import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const srcRoot = join(process.cwd(), "packages/shadcn-studio/src");
const svgSrc = join(srcRoot, "assets/svg");
const dest = join(srcRoot, "components-assets");
const map = [
  ["badge-check.tsx", "BadgeCheckIcon"],
  ["facebook-icon.tsx", "FacebookIcon"],
  ["figma-icon.tsx", "FigmaIcon"],
  ["instagram-icon.tsx", "InstagramIcon"],
  ["linkedin-icon.tsx", "LinkedinIcon"],
  ["twitter-icon.tsx", "TwitterIcon"],
  ["customers-card-svg.tsx", "CustomersCardSvg"],
  ["ratings-card-svg.tsx", "RatingsCardSvg"],
  ["session-card-svg.tsx", "SessionCardSvg"],
  ["total-orders-card-svg.tsx", "TotalOrdersCardSvg"],
  ["error-02-illustration.tsx", "Error02Illustration"],
  ["logo.tsx", "LogoSvg"],
  ["multi-step-01.tsx", "MultiStep01Illustration"],
];
mkdirSync(dest, { recursive: true });
for (const [file, name] of map) {
  copyFileSync(join(svgSrc, file), join(dest, file));
}
writeFileSync(
  join(dest, "index.ts"),
  map.map(([file, name]) => `export { default as ${name} } from "./${file.replace(".tsx", "")}.js";`).join("\n") + "\n"
);
copyFileSync(join(dest, "logo.tsx"), join(srcRoot, "components-layouts/logo.tsx"));
rmSync(join(srcRoot, "assets"), { recursive: true, force: true });
