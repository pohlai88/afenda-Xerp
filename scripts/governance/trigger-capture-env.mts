#!/usr/bin/env tsx
/**
 * Capture Trigger.dev prod worker env via CLI and align Afenda-owned keys with sources.
 *
 * - Pulls cloud prod vars (`trigger env pull`)
 * - Validates BETTER_AUTH_URL against `.env.config.production`
 * - Validates AFENDA_INTERNAL_S2S_SIGNING_SECRET against `.env.secret`
 * - Prints API key placement guidance (keys are not in cloud env — dashboard only)
 *
 * Usage: pnpm trigger:env:capture:production
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadMergedEnv } from "../env-utils.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const executionDir = join(repoRoot, "packages/execution");
const productionOverlayPath = join(repoRoot, ".env.config.production");

const AFENDA_MANAGED_TRIGGER_ENV_KEYS = [
  "AFENDA_INTERNAL_S2S_SIGNING_SECRET",
  "BETTER_AUTH_URL",
] as const;

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
      "TRIGGER_PROJECT_REF missing — set in .env.config and run pnpm env:sync."
    );
    process.exit(1);
  }
  return projectRef;
}

function parseEnvFile(content: string): Map<string, string> {
  const entries = new Map<string, string>();

  for (const line of content.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries.set(key, value);
  }

  return entries;
}

function readSourceValue(filePath: string, key: string): string | undefined {
  if (!existsSync(filePath)) {
    return undefined;
  }

  return parseEnvFile(readFileSync(filePath, "utf8")).get(key)?.trim();
}

function pullTriggerProdEnv(projectRef: string): Map<string, string> {
  const outputPath = join(
    repoRoot,
    "packages/execution/.trigger-prod-pulled.env"
  );

  if (existsSync(outputPath)) {
    unlinkSync(outputPath);
  }

  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "trigger",
      "env",
      "pull",
      "-e",
      "prod",
      "-p",
      projectRef,
      "-o",
      outputPath,
      "--force",
    ],
    {
      cwd: executionDir,
      env: process.env,
      encoding: "utf8",
      shell: true,
    }
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "trigger env pull failed");
    process.exit(result.status ?? 1);
  }

  const pulled = parseEnvFile(readFileSync(outputPath, "utf8"));
  unlinkSync(outputPath);
  return pulled;
}

function main(): void {
  applyMergedEnv();
  const projectRef = resolveProjectRef();

  console.log(`Capturing Trigger prod env for ${projectRef}...`);
  const pulled = pullTriggerProdEnv(projectRef);

  let failed = false;

  for (const key of AFENDA_MANAGED_TRIGGER_ENV_KEYS) {
    const cloudValue = pulled.get(key)?.trim();
    if (cloudValue === undefined || cloudValue.length === 0) {
      console.error(`Missing on Trigger prod: ${key}`);
      failed = true;
      continue;
    }

    if (key === "BETTER_AUTH_URL") {
      const overlayValue = readSourceValue(productionOverlayPath, key);
      if (overlayValue === cloudValue) {
        console.log(`OK  ${key} matches .env.config.production`);
      } else {
        console.error(
          `DRIFT ${key}: cloud=${cloudValue} overlay=${overlayValue ?? "(missing)"}`
        );
        failed = true;
      }
      continue;
    }

    const secretValue = readSourceValue(join(repoRoot, ".env.secret"), key);
    if (secretValue === cloudValue) {
      console.log(`OK  ${key} matches .env.secret`);
    } else {
      console.error(
        `DRIFT ${key}: cloud differs from .env.secret — update .env.secret then pnpm trigger:deploy:production`
      );
      failed = true;
    }
  }

  const devKey = readSourceValue(join(repoRoot, ".env.secret"), "TRIGGER_SECRET_KEY");
  const prodKey = readSourceValue(
    join(repoRoot, ".env.secret"),
    "TRIGGER_SECRET_KEY_PROD"
  );

  console.log("");
  console.log("API keys (dashboard only — not in trigger env pull):");
  console.log(
    `  TRIGGER_SECRET_KEY      → .env.secret (${devKey?.startsWith("tr_dev_") ? "tr_dev_*" : "set tr_dev_*"})`
  );
  console.log(
    `  TRIGGER_SECRET_KEY_PROD → .env.secret (${prodKey?.startsWith("tr_prod_") ? "tr_prod_*" : "set tr_prod_*"})`
  );
  console.log(
    `  TRIGGER_PROJECT_REF     → .env.config (${process.env["TRIGGER_PROJECT_REF"]})`
  );
  console.log(
    `  TRIGGER_API_URL         → .env.config (${process.env["TRIGGER_API_URL"] ?? "https://api.trigger.dev"})`
  );

  if (failed) {
    process.exit(1);
  }

  console.log("");
  console.log("Trigger prod env aligned with Afenda sources.");
}

main();
