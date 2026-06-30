#!/usr/bin/env tsx
/** One-shot normalizer: PAS-003 slice handoff fences must use triple backticks. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const sliceDir = join(
  import.meta.dirname,
  "../../docs/PAS/ACCOUNTING-STANDARDS/SLICE"
);
const fence = "```";

for (const name of readdirSync(sliceDir)) {
  if (!/^b\d+.*\.md$/.test(name)) continue;
  const fp = join(sliceDir, name);
  const lines = readFileSync(fp, "utf8").split(/\r?\n/);
  const handoffIdx = lines.findIndex((l) => l.trim() === "## Handoff block");
  const dodIdx = lines.findIndex(
    (l, i) => i > handoffIdx && l.trim() === "## DoD"
  );
  if (handoffIdx === -1 || dodIdx === -1) continue;

  for (let i = handoffIdx + 1; i < dodIdx; i++) {
    if (lines[i] === "`") lines[i] = fence;
  }
  writeFileSync(fp, `${lines.join("\n")}\n`);
}

console.log("accounting-slice-handoff-fences: OK");
