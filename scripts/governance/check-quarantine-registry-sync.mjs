#!/usr/bin/env node
/**
 * CI gate: quarantine disk state must match quarantine-inbox.registry.json.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALLOWED_QUARANTINE_ROOT_FILES,
  QUARANTINE_AUTH,
  QUARANTINE_LAYOUTS,
  QUARANTINE_REGISTRY,
  QUARANTINE_ROOT,
} from "../studio/quarantine-paths.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const violations = [];

function rel(path) {
  return relative(repoRoot, path).replaceAll("\\", "/");
}

function scanDiskBlockIds() {
  const ids = new Set();

  for (const bucket of [QUARANTINE_LAYOUTS, QUARANTINE_AUTH]) {
    if (!existsSync(bucket)) {
      continue;
    }

    for (const entry of readdirSync(bucket)) {
      if (entry === ".gitkeep") {
        continue;
      }

      const absolutePath = join(bucket, entry);
      const stat = statSync(absolutePath);

      if (stat.isDirectory()) {
        ids.add(entry);
      } else if (entry.endsWith(".tsx")) {
        ids.add(entry.replace(/\.tsx$/, ""));
      }
    }
  }

  return ids;
}

if (existsSync(QUARANTINE_REGISTRY)) {
  let registry;
  try {
    registry = JSON.parse(readFileSync(QUARANTINE_REGISTRY, "utf8"));
  } catch (error) {
    violations.push(`invalid registry JSON: ${error.message}`);
    registry = { entries: [] };
  }

  if (registry.schemaVersion !== 1) {
    violations.push(
      `registry schemaVersion must be 1, got ${registry.schemaVersion}`
    );
  }

  const diskIds = scanDiskBlockIds();
  const registryIds = new Set(registry.entries.map((entry) => entry.id));

  for (const id of diskIds) {
    if (!registryIds.has(id)) {
      violations.push(`orphan quarantine block on disk not in registry: ${id}`);
    }
  }

  for (const id of registryIds) {
    if (!diskIds.has(id)) {
      violations.push(`registry entry missing from disk: ${id}`);
    }
  }
} else {
  violations.push(
    "missing quarantine-inbox.registry.json — run pnpm studio:quarantine:sync"
  );
}

if (existsSync(QUARANTINE_ROOT)) {
  for (const entry of readdirSync(QUARANTINE_ROOT)) {
    const fullPath = join(QUARANTINE_ROOT, entry);
    const stat = statSync(fullPath);

    if (stat.isFile() && !ALLOWED_QUARANTINE_ROOT_FILES.has(entry)) {
      violations.push(
        `flat file forbidden at quarantine root: ${rel(fullPath)}`
      );
    }

    if (stat.isDirectory() && entry === "ui") {
      violations.push(
        `legacy ui/ folder forbidden — use components-ui/: ${rel(fullPath)}`
      );
    }
  }
}

if (violations.length > 0) {
  process.stderr.write("quarantine registry sync: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("quarantine registry sync: OK\n");
process.exit(0);
