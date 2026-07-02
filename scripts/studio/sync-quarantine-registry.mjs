#!/usr/bin/env node
/**
 * Scan mirrored quarantine buckets and regenerate quarantine-inbox.registry.json.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative } from "node:path";
import {
  EMPTY_REGISTRY,
  PRODUCTION_UI,
  productionTargetForBlock,
  QUARANTINE_AUTH,
  QUARANTINE_LAYOUTS,
  QUARANTINE_REGISTRY,
  QUARANTINE_ROOT,
  QUARANTINE_UI,
  STUDIO_SRC,
} from "./quarantine-paths.mjs";
import { resolveSourceRegistry } from "./registry-block-id-map.mjs";

const TSX_SUFFIX_RE = /\.tsx$/;
const QUARANTINE_IMPORT_RE = /@\/components-quarantine\//;
const BLOCK_SLOT_MARKER_RE = /blockSlotDomMarkerProps/;
const UTILS_IMPORT_RE = /@\/utils\/utils/;

const MCP_SEED_BLOCK_IDS = new Set([
  "account-settings-01",
  "chart-earning-report",
  "chart-sales-metrics",
  "chart-total-revenue",
  "dashboard-dialog-03",
  "dashboard-dialog-09",
  "datatable-invoice",
  "datatable-product",
  "datatable-user",
  "dialog-activity",
  "dialog-search",
  "dropdown-language",
  "dropdown-notification",
  "dropdown-profile",
  "error-page-shell",
  "hero-section-01",
  "login-page-04",
  "menu-trigger",
  "sidebar-user-dropdown",
  "statistics-activity-card",
  "statistics-card-01",
  "statistics-card-02",
  "statistics-card-03",
  "statistics-card-04",
  "statistics-expense-card",
  "statistics-income-card",
  "statistics-leads-card",
  "statistics-line-trends-card",
  "statistics-orders-progress-card",
  "statistics-profile-traffic-card",
  "statistics-revenue-card",
  "statistics-sales-overview-card",
  "statistics-trend-card",
  "widget-payment-history",
  "widget-sales-by-countries",
  "widget-total-earning",
  "widget-transactions",
]);

function relStudioPath(absolutePath) {
  return relative(STUDIO_SRC, absolutePath).replaceAll("\\", "/");
}

function productionExistsForBlock(blockId) {
  const target = productionTargetForBlock(blockId);
  if (existsSync(target.absolutePath)) {
    return true;
  }
  if (target.directoryPath && existsSync(target.directoryPath)) {
    return true;
  }
  return false;
}

function collectPrimitiveDeps(source) {
  const deps = new Set();
  const patterns = [
    /from\s+["']@\/components-quarantine\/components-ui\/([^"']+)["']/g,
    /from\s+["']@\/components-quarantine\/ui\/([^"']+)["']/g,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(source);
    while (match) {
      deps.add(match[1].replace(TSX_SUFFIX_RE, ""));
      match = pattern.exec(source);
    }
  }

  return [...deps];
}

function readSourceAt(path) {
  if (!existsSync(path)) {
    return "";
  }
  if (statSync(path).isDirectory()) {
    const mainTsx = join(path, `${basename(path)}.tsx`);
    if (existsSync(mainTsx)) {
      return readFileSync(mainTsx, "utf8");
    }
    for (const entry of readdirSync(path)) {
      if (entry.endsWith(".tsx")) {
        return readFileSync(join(path, entry), "utf8");
      }
    }
    return "";
  }
  return readFileSync(path, "utf8");
}

function computeChecklist(blockId, source, productionExists) {
  return {
    importsUseProductionAliases: !QUARANTINE_IMPORT_RE.test(source),
    slotMarkersPresent: BLOCK_SLOT_MARKER_RE.test(source),
    utilsImportCanonical: !UTILS_IMPORT_RE.test(source),
    metaRegistryBlockKnown: MCP_SEED_BLOCK_IDS.has(blockId),
    barrelExportReady: productionExists,
  };
}

function promotionStatusFrom(checklist, productionExists) {
  if (productionExists) {
    return "review_only";
  }

  const ready =
    checklist.importsUseProductionAliases &&
    checklist.slotMarkersPresent &&
    checklist.utilsImportCanonical;

  return ready ? "ready" : "inbox";
}

function buildEntry(blockId, absolutePath, layout) {
  const stat = statSync(absolutePath);
  const quarantinePath = relStudioPath(absolutePath);
  const production = productionTargetForBlock(blockId);
  const source = readSourceAt(absolutePath);
  const productionExists = productionExistsForBlock(blockId);
  const checklist = computeChecklist(blockId, source, productionExists);

  return {
    id: blockId,
    kind: "block",
    layout,
    sourceRegistry: resolveSourceRegistry(blockId),
    installedAt: stat.mtime.toISOString(),
    installCommand: null,
    quarantinePath,
    productionTargetPath:
      layout === "flat"
        ? `${production.relativePath}.tsx`
        : production.relativePath,
    productionTargetBucket: production.bucket,
    productionExists,
    promotionStatus: promotionStatusFrom(checklist, productionExists),
    primitiveDeps: collectPrimitiveDeps(source).map((name) => ({
      name,
      productionPrimitiveExists: existsSync(
        join(PRODUCTION_UI, `${name}.contract.ts`)
      ),
      quarantinePath: relStudioPath(join(QUARANTINE_UI, `${name}.tsx`)),
    })),
    checklist,
    nextManualSteps: productionExists
      ? [`pnpm studio:quarantine discard --block ${blockId}`]
      : [
          `pnpm studio:promote --block ${blockId}`,
          `pnpm studio:promote --block ${blockId} --apply`,
        ],
  };
}

function scanBlockBucket(bucketRoot) {
  const entries = [];
  if (!existsSync(bucketRoot)) {
    return entries;
  }

  for (const entry of readdirSync(bucketRoot)) {
    const absolutePath = join(bucketRoot, entry);
    const stat = statSync(absolutePath);

    if (stat.isDirectory()) {
      entries.push(buildEntry(entry, absolutePath, "directory"));
      continue;
    }

    if (entry.endsWith(".tsx")) {
      entries.push(
        buildEntry(entry.replace(TSX_SUFFIX_RE, ""), absolutePath, "flat")
      );
    }
  }

  return entries;
}

function buildRegistry() {
  const entries = [
    ...scanBlockBucket(QUARANTINE_LAYOUTS),
    ...scanBlockBucket(QUARANTINE_AUTH),
  ];

  return {
    ...EMPTY_REGISTRY,
    generatedAt: new Date().toISOString(),
    entries: entries.sort((a, b) => a.id.localeCompare(b.id)),
  };
}

mkdirSync(QUARANTINE_ROOT, { recursive: true });
const registry = buildRegistry();
writeFileSync(
  QUARANTINE_REGISTRY,
  `${JSON.stringify(registry, null, 2)}\n`,
  "utf8"
);

process.stdout.write(
  `studio:quarantine:sync: wrote ${registry.entries.length} entr${registry.entries.length === 1 ? "y" : "ies"} → ${relative(process.cwd(), QUARANTINE_REGISTRY).replaceAll("\\", "/")}\n`
);
process.exit(0);
