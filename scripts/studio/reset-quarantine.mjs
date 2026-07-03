#!/usr/bin/env node
/**
 * Reset quarantine inbox to origin empty state (dry-run default).
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  ALLOWED_QUARANTINE_ROOT_FILES,
  CANONICAL_UTILS,
  EMPTY_REGISTRY,
  LEGACY_BLOCKS_ROOT,
  LEGACY_COMPONENTS_ROOT,
  MIRRORED_BUCKET_DIRS,
  QUARANTINE_LEGACY_UI,
  QUARANTINE_README,
  QUARANTINE_REGISTRY,
  QUARANTINE_ROOT,
  STRAY_LIB_UTILS,
} from "./quarantine-paths.mjs";

const args = process.argv.slice(2);
const apply = args.includes("--apply");

function rel(path) {
  return relative(process.cwd(), path).replaceAll("\\", "/");
}

function collectTreePaths(rootDir) {
  if (!existsSync(rootDir)) {
    return [];
  }

  const paths = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else {
        paths.push(fullPath);
      }
    }
  };
  walk(rootDir);
  return paths;
}

function collectQuarantineDeletions() {
  const toDelete = [];
  if (!existsSync(QUARANTINE_ROOT)) {
    return toDelete;
  }

  for (const entry of readdirSync(QUARANTINE_ROOT)) {
    const fullPath = join(QUARANTINE_ROOT, entry);
    const stat = statSync(fullPath);

    if (stat.isFile() && !ALLOWED_QUARANTINE_ROOT_FILES.has(entry)) {
      toDelete.push(fullPath);
      continue;
    }

    if (!stat.isDirectory()) {
      continue;
    }

    if (entry === "ui") {
      toDelete.push(...collectTreePaths(fullPath));
      toDelete.push(fullPath);
      continue;
    }

    if (
      entry === "blocks" ||
      entry === "components" ||
      entry === "components-layouts" ||
      entry === "components-ui" ||
      entry === "components-auth-shell"
    ) {
      toDelete.push(...collectTreePaths(fullPath));
      continue;
    }

    toDelete.push(...collectTreePaths(fullPath));
    toDelete.push(fullPath);
  }

  return [...new Set(toDelete)].sort();
}

function collectInstallLeakDeletions() {
  const toDelete = [];

  if (existsSync(LEGACY_BLOCKS_ROOT)) {
    toDelete.push(...collectTreePaths(LEGACY_BLOCKS_ROOT));
    toDelete.push(LEGACY_BLOCKS_ROOT);
  }

  if (existsSync(LEGACY_COMPONENTS_ROOT)) {
    const legacyFiles = collectTreePaths(LEGACY_COMPONENTS_ROOT);
    if (legacyFiles.length > 0) {
      toDelete.push(...legacyFiles);
      toDelete.push(LEGACY_COMPONENTS_ROOT);
    }
  }

  if (existsSync(STRAY_LIB_UTILS) && existsSync(CANONICAL_UTILS)) {
    toDelete.push(STRAY_LIB_UTILS);
  }

  if (existsSync(QUARANTINE_LEGACY_UI)) {
    for (const path of collectTreePaths(QUARANTINE_LEGACY_UI)) {
      if (!toDelete.includes(path)) {
        toDelete.push(path);
      }
    }
  }

  return [...new Set(toDelete)].sort();
}

function plannedRestores() {
  return {
    registry: {
      path: QUARANTINE_REGISTRY,
      content: {
        ...EMPTY_REGISTRY,
        generatedAt: new Date().toISOString(),
      },
    },
    gitkeeps: MIRRORED_BUCKET_DIRS.map((dir) => join(dir, ".gitkeep")),
    preserve: [QUARANTINE_README],
  };
}

function printReport(deletions, restores) {
  process.stdout.write("studio:quarantine:reset — dry-run report\n");
  process.stdout.write(`${"=".repeat(48)}\n\n`);
  process.stdout.write(
    `Mode: ${apply ? "APPLY (destructive)" : "DRY-RUN (no writes)"}\n\n`
  );

  process.stdout.write("Preserve:\n");
  for (const path of restores.preserve) {
    const label = existsSync(path) ? "keep" : "missing (will not create)";
    process.stdout.write(`  [${label}] ${rel(path)}\n`);
  }
  process.stdout.write("\n");

  process.stdout.write("Delete:\n");
  if (deletions.length === 0) {
    process.stdout.write("  (none)\n");
  } else {
    for (const path of deletions) {
      process.stdout.write(`  [-] ${rel(path)}\n`);
    }
  }
  process.stdout.write("\n");

  process.stdout.write("Restore after reset:\n");
  process.stdout.write(`  [write] ${rel(restores.registry.path)}\n`);
  for (const gitkeep of restores.gitkeeps) {
    process.stdout.write(`  [write] ${rel(gitkeep)}\n`);
  }
  process.stdout.write("\n");

  process.stdout.write("Summary:\n");
  process.stdout.write(`  files/dirs to delete: ${deletions.length}\n`);
  process.stdout.write(
    `  mirrored buckets:     ${restores.gitkeeps.length}\n\n`
  );

  if (!apply) {
    process.stdout.write(
      "No changes made. Re-run with --apply to execute reset.\n"
    );
  }
}

async function applyReset(deletions, restores) {
  const { mkdirSync, rmSync, writeFileSync } = await import("node:fs");

  for (const path of [...deletions].sort((a, b) => b.length - a.length)) {
    if (!existsSync(path)) {
      continue;
    }
    rmSync(path, { recursive: true, force: true });
  }

  for (const gitkeep of restores.gitkeeps) {
    mkdirSync(join(gitkeep, ".."), { recursive: true });
    writeFileSync(gitkeep, "", "utf8");
  }

  writeFileSync(
    restores.registry.path,
    `${JSON.stringify(restores.registry.content, null, 2)}\n`,
    "utf8"
  );

  process.stdout.write(
    `studio:quarantine:reset --apply: deleted ${deletions.length} path(s); restored origin inbox.\n`
  );
}

const deletions = [
  ...collectQuarantineDeletions(),
  ...collectInstallLeakDeletions(),
].sort();
const restores = plannedRestores();

printReport(deletions, restores);

if (apply) {
  await applyReset(deletions, restores);
}
