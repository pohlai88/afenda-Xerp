#!/usr/bin/env node
/**
 * PAS-006 — validate components.json install aliases match quarantine policy.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  COMPONENTS_JSON_INSTALL_ALIASES,
  STUDIO_PACKAGE_ROOT,
} from "./studio-import-path-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const componentsJsonPath = join(
  repoRoot,
  STUDIO_PACKAGE_ROOT,
  "components.json"
);

const violations = [];

if (!existsSync(componentsJsonPath)) {
  process.stderr.write("studio install paths: FAIL\n");
  process.stderr.write(`- Missing ${STUDIO_PACKAGE_ROOT}/components.json\n`);
  process.exit(1);
}

const componentsJson = JSON.parse(readFileSync(componentsJsonPath, "utf8"));
const aliases = componentsJson.aliases ?? {};

for (const [key, expected] of Object.entries(COMPONENTS_JSON_INSTALL_ALIASES)) {
  const actual = aliases[key];
  if (actual !== expected) {
    violations.push(
      `components.json aliases.${key}: expected "${expected}", got "${actual ?? "undefined"}"`
    );
  }
}

const forbiddenProductionTargets = [
  ["components", "@/components/shadcn-studio"],
  ["ui", "@/components/ui"],
];

for (const [key, forbidden] of forbiddenProductionTargets) {
  if (aliases[key] === forbidden) {
    violations.push(
      `components.json aliases.${key} still targets production "${forbidden}" — use quarantine install aliases`
    );
  }
}

if (violations.length > 0) {
  process.stderr.write("studio install paths: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("studio install paths: OK\n");
process.exit(0);
