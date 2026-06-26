/**
 * Package CSS dist sync policy — apps import CSS from package dist/, not src/.
 *
 * Keep in sync with:
 * - .cursor/hooks/package-css-dist-policy.mjs (re-export)
 * - .cursor/skills/package-css-dist-sync/SKILL.md
 * - .cursor/rules/package-css-dist-sync.mdc
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
    name: "@afenda/appshell",
    buildCommand: "pnpm --filter @afenda/appshell build",
    syncCommand: "pnpm sync:package-css-dist -- --package @afenda/appshell",
    sourcePathPrefix: "packages/appshell/src/styles/",
    pairs: [
      {
        src: "packages/appshell/src/styles/afenda-appshell.css",
        dist: "packages/appshell/dist/styles/afenda-appshell.css",
      },
      {
        src: "packages/appshell/src/styles/afenda-appshell-studio.css",
        dist: "packages/appshell/dist/styles/afenda-appshell-studio.css",
      },
    ],
  },
  {
    name: "@afenda/ui",
    buildCommand: "pnpm --filter @afenda/ui build",
    syncCommand: "pnpm sync:package-css-dist -- --package @afenda/ui",
    sourcePathPrefix: "packages/ui/src/styles/",
    pairs: [
      {
        src: "packages/ui/src/styles/afenda-ui.css",
        dist: "packages/ui/dist/styles/afenda-ui.css",
      },
    ],
  },
  {
    name: "@afenda/metadata-ui",
    buildCommand: "pnpm --filter @afenda/metadata-ui build",
    syncCommand: "pnpm sync:package-css-dist -- --package @afenda/metadata-ui",
    sourcePathPrefix: "packages/metadata-ui/src/",
    pairs: [
      {
        src: "packages/metadata-ui/src/afenda-metadata-ui.css",
        dist: "packages/metadata-ui/dist/afenda-metadata-ui.css",
      },
      {
        src: "packages/metadata-ui/src/fixtures/metadata-ui-fixtures.css",
        dist: "packages/metadata-ui/dist/fixtures/metadata-ui-fixtures.css",
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
