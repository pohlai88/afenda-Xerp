#!/usr/bin/env node
/**
 * Supabase preview branch ops — ARCH-SUPA-001 Slice 3 (P1 hardening).
 *
 * Documents Vercel preview ↔ Supabase branch alignment. Default is dry-run.
 * Requires SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF in merged env sources.
 */
import { loadMergedEnv, resolveRepoRoot } from "../env-utils.mjs";

function parseArgs(argv) {
  return {
    apply: argv.includes("--apply"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function printHelp() {
  process.stdout.write(`Usage: node scripts/ops/supabase-preview-branch.mjs [options]

Print Supabase preview branch workflow steps for Vercel preview deployments.

Options:
  --apply   Reserved — prints MCP/API steps only (no auto branch mutation in v1)
  --help    Show this help text

Requires SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF (via pnpm env:sync).
`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return 0;
  }

  const repoRoot = resolveRepoRoot();
  const merged = loadMergedEnv(repoRoot);
  const token = merged.entries.get("SUPABASE_ACCESS_TOKEN")?.trim();
  const projectRef =
    merged.entries.get("SUPABASE_PROJECT_REF")?.trim() ??
    merged.entries.get("NEXT_PUBLIC_SUPABASE_URL")?.trim();

  if (!token) {
    process.stderr.write(
      "Missing SUPABASE_ACCESS_TOKEN in .env.secret — required for preview branch ops.\n"
    );
    return 1;
  }

  if (!projectRef) {
    process.stderr.write(
      "Missing SUPABASE_PROJECT_REF — run pnpm env:sync after setting NEXT_PUBLIC_SUPABASE_URL.\n"
    );
    return 1;
  }

  const ref = projectRef.startsWith("http")
    ? new URL(projectRef).hostname.split(".")[0]
    : projectRef;

  process.stdout.write("Supabase preview branch workflow (dry-run)\n");
  process.stdout.write(`Project ref: ${ref}\n`);
  process.stdout.write("\nSteps:\n");
  process.stdout.write(
    `1. MCP: create_branch for Vercel preview ${process.env.VERCEL_GIT_COMMIT_REF ?? "<preview-branch>"}\n`
  );
  process.stdout.write(
    "2. Point preview DATABASE_URL_* at branch connection string\n"
  );
  process.stdout.write(
    "3. Run pnpm quality:migrations against preview branch\n"
  );
  process.stdout.write("4. MCP: merge_branch after preview validation\n");
  process.stdout.write(
    "\nP1: Complete before production 9.5 unless waived (ARCH-SUPA-001 Slice 3).\n"
  );

  if (options.apply) {
    process.stdout.write(
      "\nNote: --apply does not mutate branches in v1 — use Supabase MCP or Dashboard.\n"
    );
  }

  return 0;
}

process.exit(main());
