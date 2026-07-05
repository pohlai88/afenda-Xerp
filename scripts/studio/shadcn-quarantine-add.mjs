#!/usr/bin/env node
/**
 * PAS-006 — Quarantine shadcn CLI wrapper for @afenda/shadcn-studio.
 *
 * Installs via components.json mirrored quarantine aliases. @ss-blocks registry
 * JSON may still write to legacy production targets — this
 * wrapper relocates into mirrored quarantine buckets after install.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import {
  CANONICAL_UTILS,
  LEGACY_BLOCKS_ROOT,
  LEGACY_COMPONENTS_ROOT,
  productionTargetForBlock,
  QUARANTINE_BLOCKS,
  QUARANTINE_COMPONENTS,
  QUARANTINE_LEGACY_UI,
  QUARANTINE_ROOT,
  REPO_ROOT,
  STRAY_LIB_UTILS,
  STUDIO_ROOT,
} from "./quarantine-paths.mjs";
import { resolveBlockIdFromRegistryArg } from "./registry-block-id-map.mjs";

const TSX_SUFFIX_RE = /\.tsx$/;
const TSX_FILE_RE = /\.tsx?$/;

const args = process.argv.slice(2);

if (args.length === 0) {
  process.stderr.write(
    "Usage: pnpm studio:shadcn:quarantine <shadcn-args...>\n" +
      "Example: pnpm studio:shadcn:quarantine add @ss-blocks/statistics-component-01 --overwrite --yes\n"
  );
  process.exit(1);
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function blockIdFromEntryName(entry) {
  return entry.replace(TSX_SUFFIX_RE, "");
}

function targetDirForBlock(_blockId) {
  return QUARANTINE_BLOCKS;
}

function relocateFile(sourcePath, targetPath) {
  ensureDir(join(targetPath, ".."));
  copyFileSync(sourcePath, targetPath);
  unlinkSync(sourcePath);
}

function relocateLegacyBlocks() {
  if (!existsSync(LEGACY_BLOCKS_ROOT)) {
    return [];
  }

  ensureDir(QUARANTINE_ROOT);
  const moved = [];

  for (const entry of readdirSync(LEGACY_BLOCKS_ROOT)) {
    const sourcePath = join(LEGACY_BLOCKS_ROOT, entry);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      const blockId = entry;
      const targetPath = join(targetDirForBlock(blockId), blockId);
      ensureDir(targetPath);
      for (const file of readdirSync(sourcePath)) {
        const innerSource = join(sourcePath, file);
        if (statSync(innerSource).isFile()) {
          relocateFile(innerSource, join(targetPath, file));
        }
      }
      rmSync(sourcePath, { recursive: true, force: true });
      moved.push(
        `components-quarantine/${basename(targetDirForBlock(blockId))}/${blockId}/`
      );
      continue;
    }

    if (!stat.isFile()) {
      continue;
    }

    const blockId = blockIdFromEntryName(entry);
    const targetPath = join(targetDirForBlock(blockId), entry);
    relocateFile(sourcePath, targetPath);
    moved.push(
      `components-quarantine/${basename(targetDirForBlock(blockId))}/${entry}`
    );
  }

  if (existsSync(LEGACY_COMPONENTS_ROOT)) {
    rmSync(LEGACY_COMPONENTS_ROOT, { recursive: true, force: true });
  }

  return moved;
}

function relocateFlatQuarantineRoot() {
  const moved = [];
  if (!existsSync(QUARANTINE_ROOT)) {
    return moved;
  }

  for (const entry of readdirSync(QUARANTINE_ROOT)) {
    if (!entry.endsWith(".tsx")) {
      continue;
    }

    const sourcePath = join(QUARANTINE_ROOT, entry);
    if (!statSync(sourcePath).isFile()) {
      continue;
    }

    const blockId = blockIdFromEntryName(entry);
    const targetPath = join(targetDirForBlock(blockId), entry);
    relocateFile(sourcePath, targetPath);
    moved.push(
      `components-quarantine/${basename(targetDirForBlock(blockId))}/${entry}`
    );
  }

  return moved;
}

function relocateLegacyUiFolder() {
  if (!existsSync(QUARANTINE_LEGACY_UI)) {
    return [];
  }

  ensureDir(QUARANTINE_COMPONENTS);
  const moved = [];

  for (const entry of readdirSync(QUARANTINE_LEGACY_UI)) {
    const sourcePath = join(QUARANTINE_LEGACY_UI, entry);
    if (!statSync(sourcePath).isFile() || entry === ".gitkeep") {
      continue;
    }

    const targetPath = join(QUARANTINE_COMPONENTS, entry);
    relocateFile(sourcePath, targetPath);
    moved.push(`components-quarantine/components/${entry}`);
  }

  rmSync(QUARANTINE_LEGACY_UI, { recursive: true, force: true });
  return moved;
}

function rewriteQuarantineImportsInTree(rootDir) {
  if (!existsSync(rootDir)) {
    return [];
  }

  const updated = [];
  const files = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (TSX_FILE_RE.test(entry)) {
        files.push(fullPath);
      }
    }
  };
  walk(rootDir);

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");
    const next = source
      .replaceAll(
        "@/components-quarantine/ui/",
        "@/components-quarantine/components/"
      )
      .replaceAll(
        '@/components-quarantine/ui"',
        '@/components-quarantine/components"'
      )
      .replaceAll(
        "@/components-quarantine/components-ui/",
        "@/components-quarantine/components/"
      )
      .replaceAll(
        "@/components-quarantine/components-layouts/",
        "@/components-quarantine/blocks/"
      )
      .replaceAll(
        "@/components-quarantine/components-auth-shell/",
        "@/components-quarantine/blocks/"
      )
      .replaceAll(
        '@/components-quarantine/components-ui"',
        '@/components-quarantine/components"'
      )
      .replaceAll(
        '@/components-quarantine/components-layouts"',
        '@/components-quarantine/blocks"'
      )
      .replaceAll(
        '@/components-quarantine/components-auth-shell"',
        '@/components-quarantine/blocks"'
      );
    if (next !== source) {
      writeFileSync(filePath, next, "utf8");
      updated.push(filePath);
    }
  }

  return updated;
}

function removeStrayLibUtils() {
  if (existsSync(STRAY_LIB_UTILS) && existsSync(CANONICAL_UTILS)) {
    unlinkSync(STRAY_LIB_UTILS);
    return true;
  }
  return false;
}

function warnOnProductionDuplicate(registryArg) {
  const blockId = resolveBlockIdFromRegistryArg(registryArg);
  if (!blockId) {
    return;
  }

  const target = productionTargetForBlock(blockId);
  const productionExists =
    existsSync(target.absolutePath) ||
    (target.directoryPath && existsSync(target.directoryPath));

  if (productionExists) {
    process.stdout.write(
      `studio:shadcn:quarantine: warning — production already has "${blockId}" (review_only inbox; use studio:promote --review-duplicate)\n`
    );
  }
}

function runRegistrySync() {
  const sync = spawnSync(
    "node",
    ["scripts/studio/sync-quarantine-registry.mjs"],
    {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: true,
    }
  );
  return (sync.status ?? 1) === 0;
}

const addIndex = args.indexOf("add");
const registryArg =
  addIndex >= 0 && args[addIndex + 1] ? args[addIndex + 1] : null;

if (registryArg) {
  warnOnProductionDuplicate(registryArg);
}

const result = spawnSync("pnpm", ["dlx", "shadcn@latest", ...args], {
  cwd: STUDIO_ROOT,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1);
}

const isAddCommand = args[0] === "add" || args.includes("add");
if (!isAddCommand) {
  process.exit(0);
}

const moved = [
  ...relocateLegacyBlocks(),
  ...relocateFlatQuarantineRoot(),
  ...relocateLegacyUiFolder(),
];
const removedStrayUtils = removeStrayLibUtils();

if (existsSync(LEGACY_BLOCKS_ROOT)) {
  process.stderr.write(
    "studio:shadcn:quarantine: FAIL — legacy path still exists after relocation:\n" +
      `  ${LEGACY_BLOCKS_ROOT}\n`
  );
  process.exit(1);
}

for (const path of moved) {
  process.stdout.write(`studio:shadcn:quarantine: relocated → ${path}\n`);
}

if (removedStrayUtils) {
  process.stdout.write(
    "studio:shadcn:quarantine: removed stray src/lib/utils.ts (canonical: src/utils/utils.ts)\n"
  );
}

const rewritten = rewriteQuarantineImportsInTree(QUARANTINE_ROOT);
for (const filePath of rewritten) {
  process.stdout.write(
    `studio:shadcn:quarantine: normalized import paths → ${filePath.replace(STUDIO_ROOT, "packages/shadcn-studio").replaceAll("\\", "/")}\n`
  );
}

if (!runRegistrySync()) {
  process.exit(1);
}

process.exit(0);
