#!/usr/bin/env tsx
/**
 * PAS-005 B30 — verify runtime bridge is generator-synced and ui import chain uses css-authority.
 * PAS-005B — design-system package removed; no shim file checks.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");

const bridgePath = join(
  repoRoot,
  "packages/css-authority/src/css/afenda-runtime-bridge.css"
);
const uiCssPath = join(repoRoot, "packages/ui/src/styles/afenda-ui.css");

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
const uiCss = existsSync(uiCssPath) ? read(uiCssPath) : "";

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

if (uiCss.length > 0) {
  if (!uiCss.includes("@afenda/css-authority/css/afenda-tokens.css")) {
    errors.push(
      "afenda-ui.css: must import @afenda/css-authority/css/afenda-tokens.css"
    );
  }
  if (!uiCss.includes("@afenda/css-authority/css/afenda-css-authority.css")) {
    errors.push(
      "afenda-ui.css: must import @afenda/css-authority/css/afenda-css-authority.css"
    );
  }
  if (uiCss.includes("@afenda/design-system/")) {
    errors.push(
      "afenda-ui.css: must not import @afenda/design-system (retired — PAS-005B)"
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
