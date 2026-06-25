#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  compareSyncedTargets,
  findDeprecatedSourceKeys,
  findEmptyTrackedKeys,
  findMissingRequiredKeys,
  findSupabaseConfigIssues,
  findSupabaseConnectionAdvisories,
  LOCAL_SYNC_TARGETS,
  loadMergedEnv,
  parseEnvFile,
  probeMigrationUrlFromMerged,
  readOptionalEnvFile,
  resolveRepoRoot,
  SOURCE_FILES,
  scanNextPublicViolations,
  serializeEnvFile,
} from "./env-utils.mjs";

function parseArgs(argv) {
  return {
    sourcesOnly: argv.includes("--sources-only"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function printHelp() {
  process.stdout.write(`Usage: pnpm env:doctor [options]

Validate human-managed env sources and generated repo env targets.

Options:
  --sources-only   Validate .env.config + .env.secret only (skip synced targets)
  --help           Show this help text
`);
}

function collectDeprecatedSourceWarnings(repoRoot) {
  const warnings = [];

  for (const relativePath of Object.values(SOURCE_FILES)) {
    const content = readOptionalEnvFile(repoRoot, relativePath);

    if (content === null) {
      continue;
    }

    const parsed = parseEnvFile(content);
    const deprecated = findDeprecatedSourceKeys(parsed.entries, relativePath);

    if (deprecated.length > 0) {
      warnings.push(
        `${relativePath}: remove deprecated key(s) (derived or duplicated elsewhere): ${deprecated.join(", ")}`
      );
    }
  }

  return warnings;
}

function collectMissingSourceErrors(repoRoot) {
  const errors = [];

  for (const relativePath of Object.values(SOURCE_FILES)) {
    if (!existsSync(join(repoRoot, relativePath))) {
      errors.push(`Missing source file: ${relativePath}`);
    }
  }

  return errors;
}

function collectMergedEnvDiagnostics(merged, expectedContent) {
  const errors = [];
  const warnings = [];

  const missingRequired = findMissingRequiredKeys(merged.entries);
  if (missingRequired.length > 0) {
    errors.push(
      `Missing required env key(s): ${missingRequired.join(", ")} (set directly or via NEON_DATABASE_URL alias)`
    );
  }

  const supabaseIssues = findSupabaseConfigIssues(merged.entries);

  if (supabaseIssues.length > 0) {
    errors.push(
      `Supabase env configuration issues:\n${supabaseIssues
        .map((issue) => `  - ${issue}`)
        .join("\n")}`
    );
  }

  const nextPublicViolations = scanNextPublicViolations(expectedContent);

  if (nextPublicViolations.length > 0) {
    errors.push(
      `Unsafe NEXT_PUBLIC_* values:\n${nextPublicViolations
        .map((violation) => `  - ${violation}`)
        .join("\n")}`
    );
  }

  const emptyKeys = findEmptyTrackedKeys(merged.entries, merged.order);
  if (emptyKeys.length > 0) {
    warnings.push(
      `Empty env value(s): ${emptyKeys.slice(0, 12).join(", ")}${
        emptyKeys.length > 12 ? ` (+${emptyKeys.length - 12} more)` : ""
      }`
    );
  }

  const migrationProbe = probeMigrationUrlFromMerged(merged.entries);

  if (!migrationProbe.resolvable) {
    warnings.push(
      `Migration database URL not derivable from merged sources — ${migrationProbe.hint}. Live DB gates will skip until resolved.`
    );
  }

  return { errors, warnings };
}

async function collectUpstashWarnings(merged) {
  const warnings = [];
  const upstashUrl = merged.entries.get("UPSTASH_REDIS_REST_URL")?.trim();
  const upstashToken = merged.entries.get("UPSTASH_REDIS_REST_TOKEN")?.trim();

  if (!(upstashUrl && upstashToken)) {
    return warnings;
  }

  try {
    const response = await fetch(`${upstashUrl}/ping`, {
      headers: { Authorization: `Bearer ${upstashToken}` },
    });

    if (!response.ok) {
      warnings.push(
        `Upstash Redis ping failed (HTTP ${response.status}) — verify UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN`
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown connectivity error";
    warnings.push(
      `Upstash Redis unreachable (${message}) — update UPSTASH_REDIS_REST_URL in .env.config with a valid REST endpoint from the Upstash console`
    );
  }

  return warnings;
}

async function collectStaleTargetErrors(repoRoot, expectedContent, options) {
  const errors = [];

  if (!options.sourcesOnly) {
    const stale = await compareSyncedTargets(
      repoRoot,
      expectedContent,
      LOCAL_SYNC_TARGETS
    );

    if (stale.length > 0) {
      errors.push(
        `Generated env targets are stale:\n${stale
          .map((entry) => `  - ${entry.relativePath} (${entry.reason})`)
          .join("\n")}\nRun \`pnpm env:sync\` to refresh them.`
      );
    }
  }

  return errors;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return 0;
  }

  const repoRoot = resolveRepoRoot();
  const errors = collectMissingSourceErrors(repoRoot);
  const warnings = collectDeprecatedSourceWarnings(repoRoot);

  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n")}\n`);
    return 1;
  }

  const merged = loadMergedEnv(repoRoot, {
    overlays: [".env.config.local"].filter((relativePath) =>
      existsSync(join(repoRoot, relativePath))
    ),
  });
  const expectedContent = serializeEnvFile(merged);
  const diagnostics = collectMergedEnvDiagnostics(merged, expectedContent);

  errors.push(...diagnostics.errors);
  warnings.push(...diagnostics.warnings);
  warnings.push(...(await collectUpstashWarnings(merged)));
  warnings.push(...findSupabaseConnectionAdvisories(merged.entries));
  errors.push(
    ...(await collectStaleTargetErrors(repoRoot, expectedContent, options))
  );

  if (warnings.length > 0) {
    process.stdout.write(`${warnings.join("\n")}\n`);
  }

  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n\n")}\n`);
    return 1;
  }

  process.stdout.write("Env doctor: all checks passed.\n");
  return 0;
}

main()
  .then((code) => {
    process.exit(code);
  })
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  });
