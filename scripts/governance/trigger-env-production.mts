#!/usr/bin/env tsx
/**
 * Run Trigger.dev `env` CLI against prod with merged local credentials + project ref.
 *
 * Examples:
 *   pnpm trigger:env:list:production
 *   pnpm trigger:env:get:production BETTER_AUTH_URL
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadMergedEnv } from "../env-utils.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const executionDir = join(repoRoot, "packages/execution");

function applyMergedEnv(): void {
  const { entries } = loadMergedEnv(repoRoot);
  for (const [key, value] of entries) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function resolveProjectRef(): string {
  const projectRef = process.env["TRIGGER_PROJECT_REF"]?.trim();
  if (projectRef === undefined || projectRef.length === 0) {
    console.error(
      "TRIGGER_PROJECT_REF missing — add to .env.config / .env.secret and run pnpm env:sync."
    );
    process.exit(1);
  }
  return projectRef;
}

function main(): void {
  applyMergedEnv();

  const subcommand = process.argv[2];
  const subcommandArgs = process.argv.slice(3);

  if (subcommand !== "list" && subcommand !== "get") {
    console.error(
      "Usage: trigger-env-production.mts <list|get> [trigger env args...]"
    );
    process.exit(1);
  }

  if (subcommand === "get" && subcommandArgs.length === 0) {
    console.error("Usage: trigger-env-production.mts get <VAR_NAME>");
    process.exit(1);
  }

  const projectRef = resolveProjectRef();
  const hasProjectRefFlag = subcommandArgs.some(
    (arg, index) =>
      arg === "-p" ||
      arg === "--project-ref" ||
      arg.startsWith("--project-ref=") ||
      (index > 0 &&
        (subcommandArgs[index - 1] === "-p" ||
          subcommandArgs[index - 1] === "--project-ref"))
  );

  const cliArgs = [
    "exec",
    "trigger",
    "env",
    subcommand,
    ...subcommandArgs,
    "-e",
    "prod",
    ...(hasProjectRefFlag ? [] : ["-p", projectRef]),
  ];

  const result = spawnSync("pnpm", cliArgs, {
    cwd: executionDir,
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  process.exit(result.status ?? 1);
}

main();
