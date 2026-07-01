#!/usr/bin/env node
/**
 * PAS-006 — validate shadcn-studio tsconfig path alias SSOT.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FORBIDDEN_PHYSICAL_PATH_KEYS,
  LEGACY_COMPONENTS_DIR,
  REQUIRED_VIRTUAL_PATH_KEYS,
  STUDIO_PATHS_SSOT,
} from "./studio-import-path-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const studioRoot = join(repoRoot, "packages/shadcn-studio");
const pathsSsotPath = join(repoRoot, STUDIO_PATHS_SSOT);

const TSCONFIG_FILES = [
  "tsconfig.json",
  "tsconfig.stories.json",
  "tsconfig.vitest.json",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function pathsFrom(config) {
  return config.compilerOptions?.paths ?? {};
}

function assertRequiredKeys(label, paths, violations) {
  for (const key of REQUIRED_VIRTUAL_PATH_KEYS) {
    if (!(key in paths)) {
      violations.push(`${label}: missing required path key "${key}"`);
    }
  }
}

function assertNoForbiddenKeys(label, paths, violations) {
  for (const key of FORBIDDEN_PHYSICAL_PATH_KEYS) {
    if (key in paths) {
      violations.push(
        `${label}: forbidden physical alias "${key}" — use virtual MCP aliases only`
      );
    }
  }
}

function compareToSsot(label, paths, ssotPaths, violations) {
  for (const key of REQUIRED_VIRTUAL_PATH_KEYS) {
    const expected = JSON.stringify(ssotPaths[key]);
    const actual = JSON.stringify(paths[key]);
    if (expected !== actual) {
      violations.push(
        `${label}: path "${key}" drift — expected ${expected}, got ${actual ?? "undefined"}`
      );
    }
  }
}

const violations = [];

if (existsSync(pathsSsotPath)) {
  const ssotPaths = pathsFrom(readJson(pathsSsotPath));

  assertRequiredKeys(STUDIO_PATHS_SSOT, ssotPaths, violations);
  assertNoForbiddenKeys(STUDIO_PATHS_SSOT, ssotPaths, violations);

  for (const fileName of TSCONFIG_FILES) {
    const configPath = join(studioRoot, fileName);
    if (!existsSync(configPath)) {
      violations.push(`Missing ${fileName}`);
      continue;
    }

    const paths = pathsFrom(readJson(configPath));
    assertRequiredKeys(fileName, paths, violations);
    assertNoForbiddenKeys(fileName, paths, violations);
    compareToSsot(fileName, paths, ssotPaths, violations);
  }
} else {
  violations.push(`${STUDIO_PATHS_SSOT} is missing`);
}

if (existsSync(join(repoRoot, LEGACY_COMPONENTS_DIR))) {
  violations.push(
    `${LEGACY_COMPONENTS_DIR} still exists — delete legacy pre-ADR-0038 tree`
  );
}

if (violations.length > 0) {
  process.stderr.write("studio tsconfig paths: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("studio tsconfig paths: OK\n");
process.exit(0);
