#!/usr/bin/env tsx
/**
 * PAS-005 B30 — verify runtime bridge is generator-synced and design-system shim is active.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");

const bridgePath = join(
  repoRoot,
  "packages/css-authority/src/css/afenda-runtime-bridge.css"
);
const shimPath = join(
  repoRoot,
  "packages/design-system/src/css/afenda-design-system.css"
);

const errors: string[] = [];

function read(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch {
    errors.push(`missing file: ${path.replace(`${repoRoot}/`, "")}`);
    return "";
  }
}

const bridge = read(bridgePath);
const shim = read(shimPath);

if (bridge.length > 0) {
  if (!bridge.includes("@generated")) {
    errors.push("afenda-runtime-bridge.css: missing @generated header");
  }
  if (!bridge.includes("PAS-005 B30")) {
    errors.push("afenda-runtime-bridge.css: missing PAS-005 B30 sync marker");
  }
  if (!bridge.includes("@custom-variant dark")) {
    errors.push("afenda-runtime-bridge.css: missing Part B dark variant");
  }
  if (!bridge.includes("@theme inline")) {
    errors.push("afenda-runtime-bridge.css: missing @theme inline block");
  }
  if (bridge.includes("/* ── Part A:")) {
    errors.push(
      "afenda-runtime-bridge.css: must not contain Part A tokens (tokens live in afenda-tokens.css)"
    );
  }

  // PAS-005 R6: Part F density hooks must use single-line var() so css-governance R6 exemption applies
  const partFMatch = bridge.match(
    /\/\* ── Part F: Density attribute hooks[\s\S]*$/
  );
  if (partFMatch !== null) {
    const partF = partFMatch[0];
    for (const line of partF.split("\n")) {
      if (!/^\s*--afenda-density-[\w-]+\s*:/.test(line)) {
        continue;
      }
      if (!/:\s*var\(--afenda-[^)]+\)\s*;/.test(line)) {
        errors.push(
          `afenda-runtime-bridge.css: Part F density alias must be single-line var(--afenda-*): ${line.trim()}`
        );
      }
    }
  }
}

if (shim.length > 0) {
  if (!shim.includes("@deprecated")) {
    errors.push(
      "afenda-design-system.css: must be B30 deprecation shim (@deprecated)"
    );
  }
  if (!shim.includes("@afenda/css-authority/css/afenda-css-authority.css")) {
    errors.push(
      "afenda-design-system.css: shim must import @afenda/css-authority/css/afenda-css-authority.css"
    );
  }
  if (/@theme\s*(inline)?\s*\{/.test(shim)) {
    errors.push(
      "afenda-design-system.css: shim must not embed @theme (authority lives in css-authority)"
    );
  }
}

if (errors.length > 0) {
  process.stderr.write("css-authority-bridge-sync: FAIL\n");
  for (const error of errors) {
    process.stderr.write(`  - ${error}\n`);
  }
  process.exit(1);
}

process.stdout.write("css-authority-bridge-sync: PASS\n");
