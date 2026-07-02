#!/usr/bin/env node
/**
 * Human-readable quarantine inbox registry listing.
 */
import { existsSync, readFileSync } from "node:fs";
import { QUARANTINE_REGISTRY } from "./quarantine-paths.mjs";

const args = process.argv.slice(2);
const asJson = args.includes("--json");

if (!existsSync(QUARANTINE_REGISTRY)) {
  process.stderr.write(
    "studio:quarantine:list: registry missing — run pnpm studio:quarantine:sync\n"
  );
  process.exit(1);
}

const registry = JSON.parse(readFileSync(QUARANTINE_REGISTRY, "utf8"));

if (asJson) {
  process.stdout.write(`${JSON.stringify(registry, null, 2)}\n`);
  process.exit(0);
}

process.stdout.write(
  `Quarantine inbox (${registry.entries.length} entries) — generated ${registry.generatedAt ?? "unknown"}\n`
);
process.stdout.write(`${"-".repeat(72)}\n`);

if (registry.entries.length === 0) {
  process.stdout.write("(empty)\n");
  process.exit(0);
}

for (const entry of registry.entries) {
  process.stdout.write(
    `${entry.id.padEnd(28)} ${entry.promotionStatus.padEnd(14)} ${entry.quarantinePath}\n`
  );
}

process.exit(0);
