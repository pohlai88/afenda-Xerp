#!/usr/bin/env node
/**
 * PAS-006 — quarantine inbox must not leak into production exports or imports.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const studioSrcRoot = join(repoRoot, "packages/shadcn-studio/src");
const indexPath = join(studioSrcRoot, "index.ts");

const PRODUCTION_ZONES = [
  "components-ui",
  "components-layouts",
  "components-auth-shell",
  "components-app-shell",
];

const QUARANTINE_IMPORT =
  /from\s+["']@\/components-quarantine(?:\/|["'])|from\s+["']@\/components-quarantine-ui(?:\/|["'])/;

function collectSourceFiles(directory, files = []) {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (entry === "components-quarantine" || entry === "__tests__") {
        continue;
      }
      collectSourceFiles(absolutePath, files);
      continue;
    }

    if (
      /\.(ts|tsx)$/.test(entry) &&
      !/\.(test|stories)\.(ts|tsx)$/.test(entry)
    ) {
      files.push(absolutePath);
    }
  }

  return files;
}

const violations = [];

if (existsSync(indexPath)) {
  const indexSource = readFileSync(indexPath, "utf8");
  if (/components-quarantine/.test(indexSource)) {
    violations.push(
      "packages/shadcn-studio/src/index.ts must not export from components-quarantine/"
    );
  }
}

for (const zone of PRODUCTION_ZONES) {
  const zoneRoot = join(studioSrcRoot, zone);
  if (!existsSync(zoneRoot)) {
    continue;
  }

  for (const filePath of collectSourceFiles(zoneRoot)) {
    const relFromSrc = relative(studioSrcRoot, filePath).replace(/\\/g, "/");
    const source = readFileSync(filePath, "utf8");
    const lines = source.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      if (QUARANTINE_IMPORT.test(lines[index])) {
        violations.push(
          `packages/shadcn-studio/src/${relFromSrc}:${index + 1} production bucket imports quarantine alias`
        );
      }
    }
  }
}

if (violations.length > 0) {
  process.stderr.write("studio quarantine isolation: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("studio quarantine isolation: OK\n");
process.exit(0);
