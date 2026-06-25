#!/usr/bin/env node
/**
 * Supabase advisor governance gate — ARCH-SUPA-001 Slice 9.
 *
 * Fetches security + performance advisors via Supabase Management API when
 * SUPABASE_ACCESS_TOKEN is configured. Satisfies SUPA-P1-ADVISORS-001 operator
 * runbook automation path (release evidence via --report).
 *
 * Default: exit 1 on ERROR/CRITICAL advisor lints.
 * --skip-missing-token: exit 0 when token/project ref absent (local dev).
 * --report: print JSON summary to stdout for release evidence.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { resolveRepoRoot } from "../env-utils.mjs";
import { runSupabaseAdvisorScan } from "./supabase-advisors-governance.mjs";

const LINE_SPLIT_REGEX = /\r?\n/u;

function parseArgs(argv) {
  return {
    help: argv.includes("--help") || argv.includes("-h"),
    report: argv.includes("--report"),
    skipMissingToken: argv.includes("--skip-missing-token"),
  };
}

function printHelp() {
  process.stdout.write(`Usage: pnpm check:supabase-advisors [options]

Fetch Supabase security + performance advisors via Management API.

Options:
  --report               Print JSON scan summary (release evidence)
  --skip-missing-token   Exit 0 when SUPABASE_ACCESS_TOKEN is absent
  --help                 Show this help text

Requires SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF (or NEXT_PUBLIC_SUPABASE_URL).
`);
}

function readAccessTokenFromSecret(repoRoot) {
  const secretPath = resolve(repoRoot, ".env.secret");

  try {
    const map = new Map();

    for (const line of readFileSync(secretPath, "utf8").split(
      LINE_SPLIT_REGEX
    )) {
      if (!line || line.startsWith("#")) {
        continue;
      }
      const idx = line.indexOf("=");
      if (idx === -1) {
        continue;
      }
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      map.set(key, value);
    }

    return map.get("SUPABASE_ACCESS_TOKEN") ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return 0;
  }

  const repoRoot = resolveRepoRoot();
  const result = await runSupabaseAdvisorScan({
    repoRoot,
    readAccessToken: readAccessTokenFromSecret,
  });

  if (result.status === "skipped") {
    const message = `check:supabase-advisors skipped (${result.reason}). Run with credentials before production cutover.\n`;

    if (options.skipMissingToken) {
      process.stdout.write(message);
      return 0;
    }

    process.stderr.write(message);
    return 1;
  }

  if (options.report) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(
      `Supabase advisors scan (${result.projectRef}): blocking=${result.summary.blocking.length}, warn=${result.summary.warnCount}\n`
    );

    for (const lint of result.summary.blocking) {
      process.stdout.write(
        `[${lint.kind}] ${lint.level ?? "ERROR"} ${lint.title ?? lint.name ?? "advisor"}: ${lint.detail ?? ""}\n`
      );
    }
  }

  return result.status === "pass" ? 0 : 1;
}

main()
  .then((code) => {
    if (code !== 0) {
      process.exitCode = code;
    }
  })
  .catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`
    );
    process.exitCode = 1;
  });
