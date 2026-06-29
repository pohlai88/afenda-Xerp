#!/usr/bin/env tsx
/**
 * Repair accounting slice handoff blocks to KERNEL-style triple-backtick fences.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join("docs", "PAS", "ACCOUNTING-STANDARDS", "SLICE");
let fixed = 0;

for (const name of readdirSync(dir).filter((f) => /^b.*\.md$/.test(f))) {
  const path = join(dir, name);
  const original = readFileSync(path, "utf8");
  const handoffFrom = `Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/${name}`;

  const start = original.indexOf("## Handoff block");
  const end = original.indexOf("## DoD", start);
  if (start === -1 || end === -1) {
    continue;
  }

  const bodyStart = original.indexOf("\n1. Objective", start);
  if (bodyStart === -1) {
    continue;
  }

  const bodyEnd = original.lastIndexOf("9. Attestation", end);
  if (bodyEnd === -1) {
    continue;
  }
  const attestationLineEnd = original.indexOf("\n", bodyEnd);
  const body = original.slice(bodyStart + 1, attestationLineEnd).trimEnd();

const FENCE = "```";

  const repaired =
    original.slice(0, start) +
    "## Handoff block\n\n" +
    FENCE +
    "\n" +
    handoffFrom +
    "\n\n" +
    body +
    "\n" +
    FENCE +
    "\n\n" +
    original.slice(end);

  if (repaired !== original) {
    writeFileSync(path, repaired, "utf8");
    fixed++;
    console.log(`repaired: ${name}`);
  }
}

console.log(`repair-accounting-slice-handoffs: ${fixed} file(s)`);
