#!/usr/bin/env node
/**
 * Promote quarantine block → production.
 *
 * Default: full preflight (sync + verify + verdict label). No filesystem writes.
 * --apply: preflight must pass READY_TO_PROMOTE, then move + gates.
 *
 *   pnpm studio:promote --block <id>
 *   pnpm studio:promote --block <id> --apply
 *   pnpm studio:promote list [--json]
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import {
  AUTH_SHELL_BLOCK_IDS,
  productionTargetForBlock,
  REPO_ROOT,
  STUDIO_SRC,
} from "./quarantine-paths.mjs";
import {
  formatVerdictBanner,
  nextCommand,
  PROMOTE_VERDICT,
  quarantineAbsolutePath,
  runPreflight,
  syncRegistry,
} from "./quarantine-preflight.mjs";

const TS_TSX_FILE_RE = /\.(tsx?|ts)$/;
const NEWLINE_RE = /\r?\n/;

const args = process.argv.slice(2);

function usage() {
  process.stderr.write(
    "Usage:\n" +
      "  pnpm studio:promote --block <id>           # preflight (default)\n" +
      "  pnpm studio:promote --block <id> --apply   # promote when READY_TO_PROMOTE\n" +
      "  pnpm studio:promote list [--json]          # inbox table\n"
  );
}

function rewriteImports(source, blockId) {
  const promotedBlockAlias = AUTH_SHELL_BLOCK_IDS.has(blockId)
    ? "@/components-auth-shell/"
    : "@/components/shadcn-studio/";

  return source
    .split("@/components-quarantine/components/")
    .join("@/components/ui/")
    .split("@/components-quarantine/components-ui/")
    .join("@/components/ui/")
    .split("@/components-quarantine/ui/")
    .join("@/components/ui/")
    .split("@/components-quarantine/blocks/")
    .join(promotedBlockAlias)
    .split("@/components-quarantine/components-layouts/")
    .join(promotedBlockAlias)
    .split("@/components-quarantine/components-auth-shell/")
    .join(promotedBlockAlias)
    .split("@/utils/utils")
    .join("@/lib/utils");
}

function collectFilesRecursive(dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      collectFilesRecursive(fullPath, files);
    } else if (TS_TSX_FILE_RE.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

function simpleDiff(leftPath, rightPath) {
  if (!(existsSync(leftPath) && existsSync(rightPath))) {
    process.stdout.write("  (diff skipped — file missing on one side)\n");
    return;
  }

  const left = readFileSync(leftPath, "utf8").split(NEWLINE_RE);
  const right = readFileSync(rightPath, "utf8").split(NEWLINE_RE);
  const max = Math.max(left.length, right.length);
  let changes = 0;

  process.stdout.write(`\nDiff vs production (${basename(leftPath)}):\n`);
  for (let index = 0; index < max && changes < 24; index += 1) {
    const l = left[index];
    const r = right[index];
    if (l === r) {
      continue;
    }
    if (l !== undefined) {
      process.stdout.write(`- ${l}\n`);
    }
    if (r !== undefined) {
      process.stdout.write(`+ ${r}\n`);
    }
    changes += 1;
  }
  if (changes >= 24) {
    process.stdout.write("  … (truncated)\n");
  }
}

function printManualTail(blockId) {
  process.stdout.write(
    "\nAfter --apply (manual PAS-006B tail — not auto-run):\n"
  );
  process.stdout.write(
    "  • Restore blockSlotDomMarkerProps if MCP stripped them\n"
  );
  process.stdout.write(
    "  • Lifecycle: imported → normalized → stabilized → metadata-bound\n"
  );
  process.stdout.write(`  • Barrel export in src/index.ts for ${blockId}\n`);
  process.stdout.write("  • pnpm storybook generate\n");
}

function printPreflightReport(preflight, { showDiff = true } = {}) {
  const { entry, verdict, paths, syncLine } = preflight;

  process.stdout.write("studio:promote preflight\n");
  process.stdout.write(`${"=".repeat(48)}\n\n`);

  if (syncLine) {
    process.stdout.write(`[1/4] Registry sync: ${syncLine}\n`);
  }

  if (!entry) {
    process.stdout.write("[2/4] Block lookup: NOT FOUND\n");
    process.stdout.write(`\n${formatVerdictBanner(verdict)}\n`);
    for (const blocker of verdict.blockers) {
      process.stdout.write(`  • ${blocker}\n`);
    }
    process.stdout.write(
      `\nNext: ${nextCommand(args[args.indexOf("--block") + 1], verdict)}\n`
    );
    return { exitCode: 1, canApply: false };
  }

  process.stdout.write(`[2/4] Block lookup: ${entry.id}\n`);
  process.stdout.write("[3/4] Path verify:\n");
  process.stdout.write(
    `      quarantine:  ${paths.quarantine} ${paths.quarantineExists ? "OK" : "MISSING"}\n`
  );
  process.stdout.write(
    `      production:  ${paths.production} ${paths.productionExists ? "(exists)" : "(free)"}\n`
  );
  process.stdout.write(`      bucket:      ${entry.productionTargetBucket}\n`);

  process.stdout.write(`[4/4] Verdict: ${formatVerdictBanner(verdict)}\n`);
  if (verdict.blockers.length > 0) {
    for (const blocker of verdict.blockers) {
      process.stdout.write(`      • ${blocker}\n`);
    }
  }

  process.stdout.write("\nChecklist:\n");
  for (const [key, value] of Object.entries(entry.checklist)) {
    process.stdout.write(`  ${value ? "[x]" : "[ ]"} ${key}\n`);
  }

  if (showDiff && verdict.verdict === PROMOTE_VERDICT.BLOCKED_DUPLICATE) {
    const quarantinePath = quarantineAbsolutePath(entry);
    const production = productionTargetForBlock(entry.id);
    if (entry.layout === "directory") {
      const productionMainDir =
        production.directoryPath ?? dirname(production.absolutePath);
      simpleDiff(
        join(quarantinePath, `${entry.id}.tsx`),
        join(productionMainDir, `${entry.id}.tsx`)
      );
    } else {
      simpleDiff(quarantinePath, production.absolutePath);
    }
  }

  if (verdict.verdict === PROMOTE_VERDICT.READY_TO_PROMOTE) {
    const abs = quarantineAbsolutePath(entry);
    const files = statSync(abs).isDirectory()
      ? collectFilesRecursive(abs)
      : [abs];
    const rewrites = files.filter(
      (file) =>
        rewriteImports(readFileSync(file, "utf8"), entry.id) !==
        readFileSync(file, "utf8")
    );
    if (rewrites.length > 0) {
      process.stdout.write("\nImport rewrites on --apply:\n");
      for (const file of rewrites) {
        process.stdout.write(
          `  ${relative(REPO_ROOT, file).replaceAll("\\", "/")}\n`
        );
      }
    }
    printManualTail(entry.id);
  }

  process.stdout.write(`\nNext: ${nextCommand(entry.id, verdict)}\n`);

  if (!verdict.canApply) {
    process.stdout.write(
      "\n--apply is blocked until verdict is READY_TO_PROMOTE.\n"
    );
  }

  return { exitCode: verdict.canApply ? 0 : 1, canApply: verdict.canApply };
}

function copyWithRewrite(source, target, blockId) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    rewriteImports(readFileSync(source, "utf8"), blockId),
    "utf8"
  );
}

function copyTreeWithRewrite(sourceDir, targetDir, blockId) {
  mkdirSync(targetDir, { recursive: true });
  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = join(sourceDir, entry);
    const targetPath = join(targetDir, entry);
    if (statSync(sourcePath).isDirectory()) {
      copyTreeWithRewrite(sourcePath, targetPath, blockId);
    } else if (TS_TSX_FILE_RE.test(entry)) {
      copyWithRewrite(sourcePath, targetPath, blockId);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

function applyPromote(preflight) {
  const { entry, verdict } = preflight;

  if (!verdict.canApply) {
    process.stderr.write(
      `\nstudio:promote --apply: REFUSED — verdict is ${verdict.verdict}, not READY_TO_PROMOTE.\n`
    );
    printPreflightReport(preflight, { showDiff: true });
    process.exit(1);
  }

  process.stdout.write(`\nApplying promote: ${entry.id}\n`);

  const quarantinePath = quarantineAbsolutePath(entry);
  const production = productionTargetForBlock(entry.id);

  if (entry.layout === "directory") {
    const targetDir =
      production.directoryPath ?? dirname(production.absolutePath);
    copyTreeWithRewrite(quarantinePath, targetDir, entry.id);
    rmSync(quarantinePath, { recursive: true, force: true });
  } else {
    copyWithRewrite(quarantinePath, production.absolutePath, entry.id);
    rmSync(quarantinePath, { force: true });
  }

  for (const dep of entry.primitiveDeps ?? []) {
    if (dep.productionPrimitiveExists) {
      const depPath = join(STUDIO_SRC, dep.quarantinePath);
      if (existsSync(depPath)) {
        rmSync(depPath, { force: true });
      }
    }
  }

  syncRegistry();

  for (const gate of [
    "check:studio-import-zones",
    "check:studio-block-slot-markers",
    "check:studio-metadata-binding",
  ]) {
    const result = spawnSync("pnpm", [gate], {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: true,
    });
    if ((result.status ?? 1) !== 0) {
      process.exit(result.status ?? 1);
    }
  }

  process.stdout.write(
    `\nPROMOTED: ${entry.id} → ${entry.productionTargetPath}\n`
  );
  printManualTail(entry.id);
}

if (args[0] === "list" || args.includes("--list")) {
  const listArgs = args.filter((arg) => arg !== "list" && arg !== "--list");
  spawnSync(
    "node",
    ["scripts/studio/list-quarantine-registry.mjs", ...listArgs],
    {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: true,
    }
  );
  process.exit(0);
}

const blockIndex = args.indexOf("--block");
const blockId = blockIndex >= 0 ? args[blockIndex + 1] : null;

if (!blockId) {
  usage();
  process.exit(1);
}

const preflight = runPreflight(blockId);
const report = printPreflightReport(preflight);

if (args.includes("--apply")) {
  applyPromote(preflight);
  process.exit(0);
}

process.exit(report.exitCode);
