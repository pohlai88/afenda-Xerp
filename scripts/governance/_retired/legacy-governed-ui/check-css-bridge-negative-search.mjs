/**
 * Gate G — CSS bridge negative-search proof (9.5 acceptance attestation).
 *
 * Deterministic repo scans (no shell rg) for production leak/drift probes NS1–NS5.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkConsumerGateDPolicies,
  checkStudioBlockClassNamePolicy,
  checkStudioBlockIconImportPolicy,
} from "./governed-ui-consumption.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

/** Production packages — not packages/ui staging. */
const PRODUCTION_SCAN_ROOTS = [
  join(repoRoot, "apps", "erp", "src"),
  join(repoRoot, "apps", "docs", "src"),
  join(repoRoot, "packages", "appshell", "src"),
  join(repoRoot, "packages", "metadata-ui", "src"),
];

const SCAN_SKIP = [
  /node_modules/,
  /\/__tests__\//,
  /\\__tests__\\/,
  /\.test\.(ts|tsx)$/,
  /\.spec\.(ts|tsx)$/,
  /\.stories\.(ts|tsx)$/,
  /storybook/,
  /\.storybook/,
];

const NS1_STAGING_PATH_RE =
  /packages[/\\]ui[/\\]src[/\\]components[/\\]shadcn-studio/;

const NS2_FORBIDDEN_IMPORT_RES = [
  /\bfrom\s+["']#\/components\/shadcn-studio(?:\/[^"']*)?["']/,
  /\bfrom\s+["'][^"']*[/\\]packages[/\\]ui[/\\]src[/\\]components[/\\]shadcn-studio[^"']*["']/,
  /\bfrom\s+["']@afenda\/ui\/src\/components\/shadcn-studio[^"']*["']/,
  /\bfrom\s+["'][^"']*[/\\]shadcn-studio[/\\]primitives[^"']*["']/,
];

const MAP_STOCK_BUTTON_PROPS_RE = /\bmapStockButtonProps\b/;

/**
 * @param {string} normalizedPath  Repo-relative forward-slash path.
 */
export function isMapStockButtonPropsExemptPath(normalizedPath) {
  return (
    /(?:^|\/)__tests__(?:\/|$)/.test(normalizedPath) ||
    /\.(?:test|spec)\.(?:ts|tsx)$/.test(normalizedPath) ||
    /\.stories\.tsx$/.test(normalizedPath) ||
    /^scripts\/governance\/__tests__\//.test(normalizedPath)
  );
}

/**
 * @param {string} dir
 * @param {string[]} exts
 * @param {RegExp[]} skip
 * @returns {string[]}
 */
function collectFiles(dir, exts, skip = SCAN_SKIP) {
  const result = [];
  if (!existsSync(dir)) {
    return result;
  }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (skip.some((re) => re.test(full))) {
      continue;
    }
    const stat = statSync(full);
    if (stat.isDirectory()) {
      result.push(...collectFiles(full, exts, skip));
    } else if (exts.some((ext) => entry.endsWith(ext))) {
      result.push(full);
    }
  }
  return result;
}

/**
 * @param {string} filePath  Absolute path.
 * @returns {string}
 */
function relPath(filePath) {
  return relative(repoRoot, filePath).replace(/\\/g, "/");
}

/**
 * @param {string} content
 * @param {string} normalizedPath
 * @returns {string[]}
 */
export function probeNs1StagingRefs(content, normalizedPath) {
  if (!NS1_STAGING_PATH_RE.test(content)) {
    return [];
  }
  return [
    `${normalizedPath}: references packages/ui staging path (packages/ui/src/components/shadcn-studio)`,
  ];
}

/**
 * @param {string} content
 * @param {string} normalizedPath
 * @returns {string[]}
 */
export function probeNs2StagingImports(content, normalizedPath) {
  const hits = [];
  for (const pattern of NS2_FORBIDDEN_IMPORT_RES) {
    if (pattern.test(content)) {
      hits.push(
        `${normalizedPath}: forbidden shadcn-studio staging import — use @afenda/appshell production blocks`
      );
      break;
    }
  }
  return hits;
}

/**
 * @param {string} content
 * @param {string} normalizedPath
 * @returns {string[]}
 */
export function probeNs3BlockTailwind(content, normalizedPath) {
  if (
    !/(?:^|\/)packages\/appshell\/src\/shadcn-studio\/blocks\/[^/]+\.tsx$/.test(
      normalizedPath
    )
  ) {
    return [];
  }
  return checkStudioBlockClassNamePolicy(content).map(
    (v) => `${normalizedPath}: ${v}`
  );
}

/**
 * @param {string} content
 * @param {string} normalizedPath
 * @returns {string[]}
 */
export function probeNs4MapStockButtonProps(content, normalizedPath) {
  if (!MAP_STOCK_BUTTON_PROPS_RE.test(content)) {
    return [];
  }
  if (isMapStockButtonPropsExemptPath(normalizedPath)) {
    return [];
  }
  return [
    `${normalizedPath}: mapStockButtonProps in production — use governed intent/emphasis/size/presentation`,
  ];
}

/**
 * @param {string} content
 * @param {string} normalizedPath
 * @returns {string[]}
 */
export function probeNs5NonLucideIcons(content, normalizedPath) {
  if (
    !/(?:^|\/)packages\/appshell\/src\/shadcn-studio\/blocks\/[^/]+\.tsx$/.test(
      normalizedPath
    )
  ) {
    return [];
  }
  return checkStudioBlockIconImportPolicy(content).map(
    (v) => `${normalizedPath}: ${v}`
  );
}

/**
 * @param {string} [rootOverride]
 * @returns {{ pass: boolean, counts: Record<string, number>, violations: string[] }}
 */
export function checkCssBridgeNegativeSearch(rootOverride = repoRoot) {
  const violations = [];
  const counts = { NS1: 0, NS2: 0, NS3: 0, NS4: 0, NS5: 0 };

  const roots = PRODUCTION_SCAN_ROOTS.map((r) =>
    rootOverride === repoRoot ? r : r.replace(repoRoot, rootOverride)
  );

  const tsFiles = roots.flatMap((root) => collectFiles(root, [".ts", ".tsx"]));

  for (const file of tsFiles) {
    const normalized = relPath(file);
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    for (const v of probeNs1StagingRefs(content, normalized)) {
      counts.NS1 += 1;
      violations.push(v);
    }
    for (const v of probeNs2StagingImports(content, normalized)) {
      counts.NS2 += 1;
      violations.push(v);
    }
    for (const v of probeNs3BlockTailwind(content, normalized)) {
      counts.NS3 += 1;
      violations.push(v);
    }
    for (const v of probeNs4MapStockButtonProps(content, normalized)) {
      counts.NS4 += 1;
      violations.push(v);
    }
    for (const v of probeNs5NonLucideIcons(content, normalized)) {
      counts.NS5 += 1;
      violations.push(v);
    }

    // Gate D consumer policies (staging imports) — dedupe with NS2 where overlapping
    for (const v of checkConsumerGateDPolicies(content, normalized)) {
      if (
        (v.includes("Staging") || v.includes("shadcn-studio")) &&
        !violations.some((existing) => existing.startsWith(normalized))
      ) {
        counts.NS2 += 1;
        violations.push(`${normalized}: ${v}`);
      }
    }
  }

  const pass =
    counts.NS1 === 0 &&
    counts.NS2 === 0 &&
    counts.NS3 === 0 &&
    counts.NS4 === 0 &&
    counts.NS5 === 0;

  return { pass, counts, violations };
}

/**
 * @param {{ counts: Record<string, number> }} result
 * @returns {string}
 */
export function formatCssBridgeAttestation(result) {
  const { counts } = result;
  return [
    "CSS Bridge Negative Search — PASS",
    `  NS1 staging refs in production: ${counts.NS1}`,
    `  NS2 shadcn-studio imports in production: ${counts.NS2}`,
    `  NS3 raw Tailwind in block TSX: ${counts.NS3}`,
    `  NS4 mapStockButtonProps in production: ${counts.NS4} (tests exempt)`,
    `  NS5 non-Lucide icons in blocks: ${counts.NS5}`,
  ].join("\n");
}

/**
 * Run Gate G and print attestation or violations.
 *
 * @returns {{ ok: boolean, result: ReturnType<typeof checkCssBridgeNegativeSearch> }}
 */
export function runCssBridgeNegativeSearchGate() {
  const result = checkCssBridgeNegativeSearch();

  if (!result.pass) {
    console.error("\nCSS Bridge Negative Search — FAIL\n");
    for (const violation of result.violations) {
      console.error(`  • ${violation}`);
    }
    console.error(
      `\n${result.violations.length} violation(s). Fix before merge.\n`
    );
    return { ok: false, result };
  }

  console.log(`\n${formatCssBridgeAttestation(result)}\n`);
  return { ok: true, result };
}
