#!/usr/bin/env node
/**
 * Unified quarantine inbox CLI: sync | list | reset | discard
 *
 *   pnpm studio:quarantine sync
 *   pnpm studio:quarantine list [--json]
 *   pnpm studio:quarantine reset [--apply]
 *   pnpm studio:quarantine discard --block <id>
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, STUDIO_SRC } from "./quarantine-paths.mjs";
import {
  formatVerdictBanner,
  quarantineAbsolutePath,
  runPreflight,
  syncRegistry,
} from "./quarantine-preflight.mjs";

const args = process.argv.slice(2);
const verb = args[0];

function usage() {
  process.stderr.write(
    "Usage:\n" +
      "  pnpm studio:quarantine sync\n" +
      "  pnpm studio:quarantine list [--json]\n" +
      "  pnpm studio:quarantine reset [--apply]\n" +
      "  pnpm studio:quarantine discard --block <id>\n"
  );
}

function forward(scriptName, forwardArgs) {
  const result = spawnSync(
    "node",
    [`scripts/studio/${scriptName}`, ...forwardArgs],
    {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: true,
    }
  );
  process.exit(result.status ?? 0);
}

function discardBlock(blockId) {
  const preflight = runPreflight(blockId);

  if (!preflight.entry) {
    process.stderr.write(
      `studio:quarantine discard: block not in registry: ${blockId}\n`
    );
    process.exit(1);
  }

  process.stdout.write(`${formatVerdictBanner(preflight.verdict)}\n`);
  process.stdout.write(`  block: ${blockId}\n`);
  process.stdout.write(`  removing: ${preflight.entry.quarantinePath}\n`);

  const abs = quarantineAbsolutePath(preflight.entry);
  if (existsSync(abs)) {
    rmSync(abs, { recursive: true, force: true });
  }

  for (const dep of preflight.entry.primitiveDeps ?? []) {
    const depPath = join(STUDIO_SRC, dep.quarantinePath);
    if (existsSync(depPath)) {
      rmSync(depPath, { force: true });
    }
  }

  syncRegistry();
  process.stdout.write(
    `studio:quarantine discard: removed ${blockId} from inbox.\n`
  );
}

if (!verb || verb === "--help" || verb === "-h") {
  usage();
  process.exit(verb ? 0 : 1);
}

switch (verb) {
  case "sync":
    syncRegistry();
    process.stdout.write("studio:quarantine sync: OK\n");
    break;

  case "list":
    forward("list-quarantine-registry.mjs", args.slice(1));
    break;

  case "reset":
    forward("reset-quarantine.mjs", args.slice(1));
    break;

  case "discard": {
    const blockIndex = args.indexOf("--block");
    const blockId = blockIndex >= 0 ? args[blockIndex + 1] : null;
    if (!blockId) {
      usage();
      process.exit(1);
    }
    discardBlock(blockId);
    break;
  }

  default:
    usage();
    process.exit(1);
}
