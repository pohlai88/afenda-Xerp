/**
 * Package CSS dist sync policy — apps import CSS from package dist/, not src/.
 *
 * ADR-0027: legacy appshell/ui/metadata-ui/css-authority packages removed.
 * Presentation CSS sync: @afenda/shadcn-studio-v2.
 */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** @typedef {{ src: string; dist: string }} CssDistPair */

/** @typedef {{
 *   name: string;
 *   buildCommand: string;
 *   syncCommand: string;
 *   sourcePathPrefix: string;
 *   pairs: CssDistPair[];
 * }} PackageCssDistPackage */

/** @type {PackageCssDistPackage[]} */
export const PACKAGE_CSS_DIST_PACKAGES = [
  {
    name: "@afenda/shadcn-studio-v2",
    buildCommand: "pnpm --filter @afenda/shadcn-studio-v2 build",
    syncCommand:
      "pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2",
    sourcePathPrefix: "packages/shadcn-studio-v2/src/styles/",
    pairs: [
      {
        src: "packages/shadcn-studio-v2/src/styles/shadcn-default.css",
        dist: "packages/shadcn-studio-v2/dist/shadcn-default.css",
      },
      {
        src: "packages/shadcn-studio-v2/src/styles/swiss-noir.css",
        dist: "packages/shadcn-studio-v2/dist/themes/swiss-noir.css",
      },
      {
        src: "packages/shadcn-studio-v2/src/styles/verdant-noir.css",
        dist: "packages/shadcn-studio-v2/dist/themes/verdant-noir.css",
      },
      {
        src: "packages/shadcn-studio-v2/src/styles/afenda-brand.css",
        dist: "packages/shadcn-studio-v2/dist/themes/afenda-brand.css",
      },
    ],
  },
];

function normalizeRelativePath(relativePath) {
  return String(relativePath ?? "")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "");
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

/**
 * @param {string} relativePath
 * @returns {PackageCssDistPackage | null}
 */
export function findPackageForSourcePath(relativePath) {
  const normalized = normalizeRelativePath(relativePath);

  if (!normalized.endsWith(".css")) {
    return null;
  }

  return (
    PACKAGE_CSS_DIST_PACKAGES.find((pkg) =>
      normalized.startsWith(pkg.sourcePathPrefix)
    ) ?? null
  );
}

/**
 * @param {string} repoRoot
 * @param {CssDistPair} pair
 */
function describePairViolation(repoRoot, pair) {
  const srcAbs = join(repoRoot, pair.src);
  const distAbs = join(repoRoot, pair.dist);

  if (!existsSync(srcAbs)) {
    return `${pair.src} is missing (source CSS expected on disk)`;
  }

  if (!existsSync(distAbs)) {
    return `${pair.dist} is missing — run package build/sync after editing ${pair.src}`;
  }

  const srcHash = sha256(srcAbs);
  const distHash = sha256(distAbs);

  if (srcHash !== distHash) {
    return `${pair.dist} is stale — content differs from ${pair.src}`;
  }

  return null;
}

/**
 * @param {string} repoRoot
 * @param {string | undefined} packageName
 * @returns {{ ok: boolean; violations: string[] }}
 */
export function checkPackageCssDistSync(repoRoot, packageName) {
  const packages = packageName
    ? PACKAGE_CSS_DIST_PACKAGES.filter((pkg) => pkg.name === packageName)
    : PACKAGE_CSS_DIST_PACKAGES;

  if (packageName && packages.length === 0) {
    return {
      ok: false,
      violations: [`Unknown package: ${packageName}`],
    };
  }

  /** @type {string[]} */
  const violations = [];

  for (const pkg of packages) {
    for (const pair of pkg.pairs) {
      const violation = describePairViolation(repoRoot, pair);
      if (violation) {
        violations.push(`[${pkg.name}] ${violation}`);
      }
    }
  }

  return { ok: violations.length === 0, violations };
}

/**
 * @param {string} repoRoot
 * @param {string | undefined} packageName
 * @returns {string[]}
 */
export function syncPackageCssDist(repoRoot, packageName) {
  const packages = packageName
    ? PACKAGE_CSS_DIST_PACKAGES.filter((pkg) => pkg.name === packageName)
    : PACKAGE_CSS_DIST_PACKAGES;

  if (packageName && packages.length === 0) {
    throw new Error(`Unknown package: ${packageName}`);
  }

  /** @type {string[]} */
  const copied = [];

  for (const pkg of packages) {
    for (const pair of pkg.pairs) {
      const srcAbs = join(repoRoot, pair.src);
      const distAbs = join(repoRoot, pair.dist);

      if (!existsSync(srcAbs)) {
        throw new Error(`Source CSS missing: ${pair.src}`);
      }

      mkdirSync(dirname(distAbs), { recursive: true });
      copyFileSync(srcAbs, distAbs);
      copied.push(pair.dist);
    }
  }

  return copied;
}

/**
 * @param {string} relativePath
 * @returns {string | null}
 */
export function packageCssDistReminder(relativePath) {
  const pkg = findPackageForSourcePath(relativePath);

  if (!pkg) {
    return null;
  }

  return (
    `Package CSS source edited (${pkg.name}). Apps import CSS from dist/, not src/. ` +
    `Run \`${pkg.syncCommand}\` or \`${pkg.buildCommand}\` before verifying in apps/erp or Storybook. ` +
    "Gate: `pnpm check:package-css-dist-sync`."
  );
}
