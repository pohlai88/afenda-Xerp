import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const srcRoot = join(process.cwd(), "packages/shadcn-studio/src");
const svgSrc = join(srcRoot, "assets/svg");
const dest = join(srcRoot, "components-assets");
const map = [
  ["icon-badge-check.tsx", "BadgeCheckIcon"],
  ["icon-facebook.tsx", "FacebookIcon"],
  ["icon-figma.tsx", "FigmaIcon"],
  ["icon-instagram.tsx", "InstagramIcon"],
  ["icon-linkedin.tsx", "LinkedinIcon"],
  ["icon-twitter.tsx", "TwitterIcon"],
  ["illustration-error-02.tsx", "Error02Illustration"],
  ["icon-logo.tsx", "LogoSvg"],
  ["illustration-multi-step-01.tsx", "MultiStep01Illustration"],
];
mkdirSync(dest, { recursive: true });
for (const [file] of map) {
  copyFileSync(join(svgSrc, file), join(dest, file));
}
writeFileSync(
  join(dest, "index.ts"),
  `${map
    .map(
      ([file, name]) =>
        `export { default as ${name} } from "./${file.replace(".tsx", "")}.js";`
    )
    .join("\n")}\n`
);
rmSync(join(srcRoot, "assets"), { recursive: true, force: true });
