#!/usr/bin/env node
/**
 * Ops-only: merge production + preview redirect URLs into Supabase GoTrue config.
 *
 * **Not ERP identity** — Better Auth is the application identity provider (ADR-004).
 * This script mutates Supabase Auth infrastructure redirect allowlists only.
 *
 * ARCH-SUPA-001 Slice 6 (P1 hardening).
 * Default: dry-run. Pass --apply to PATCH remote config.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { loadMergedEnv, resolveRepoRoot } from "../env-utils.mjs";

const LINE_SPLIT_REGEX = /\r?\n/u;

const REQUIRED = [
  "https://www.nexuscanon.com/**",
  "https://*.nexuscanon.com/**",
  "https://*-jacks-projects-7b3cfe94.vercel.app/**",
  "http://localhost:3000/**",
  "http://localhost:3002/**",
];

function parseArgs(argv) {
  return {
    apply: argv.includes("--apply"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function printHelp() {
  process.stdout.write(`Usage: node scripts/ops/supabase-auth-redirects.mjs [options]

Ops-only GoTrue redirect allowlist sync. Better Auth remains ERP identity.

Options:
  --apply   PATCH Supabase auth config (default is dry-run)
  --help    Show this help text
`);
}

function resolveProjectRef(repoRoot) {
  const merged = loadMergedEnv(repoRoot);
  const explicit = merged.entries.get("SUPABASE_PROJECT_REF")?.trim();
  if (explicit) {
    return explicit;
  }

  const publicUrl = merged.entries.get("NEXT_PUBLIC_SUPABASE_URL")?.trim();
  if (!publicUrl) {
    return null;
  }

  return new URL(publicUrl).hostname.split(".")[0] ?? null;
}

function readAccessToken(repoRoot) {
  const secretPath = resolve(repoRoot, ".env.secret");
  const map = new Map();

  for (const line of readFileSync(secretPath, "utf8").split(LINE_SPLIT_REGEX)) {
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
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return 0;
  }

  const repoRoot = resolveRepoRoot();
  const projectRef = resolveProjectRef(repoRoot);
  const token = readAccessToken(repoRoot);

  if (!token) {
    process.stderr.write("Missing SUPABASE_ACCESS_TOKEN in .env.secret\n");
    return 1;
  }

  if (!projectRef) {
    process.stderr.write(
      "Missing SUPABASE_PROJECT_REF — set NEXT_PUBLIC_SUPABASE_URL and run pnpm env:sync\n"
    );
    return 1;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const getRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    { headers }
  );

  if (!getRes.ok) {
    process.stderr.write(
      `GET auth config failed: ${getRes.status} ${await getRes.text()}\n`
    );
    return 1;
  }

  const current = await getRes.json();
  const existingList =
    typeof current.uri_allow_list === "string" && current.uri_allow_list.trim()
      ? current.uri_allow_list
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const merged = [...new Set([...existingList, ...REQUIRED])].sort();
  const patchBody = {
    site_url: "https://www.nexuscanon.com",
    uri_allow_list: merged.join(","),
  };

  if (!options.apply) {
    process.stdout.write(
      "Dry-run — Supabase GoTrue redirect patch (ops-only):\n"
    );
    process.stdout.write(`project_ref: ${projectRef}\n`);
    process.stdout.write(`site_url: ${patchBody.site_url}\n`);
    process.stdout.write(`uri_allow_list: ${patchBody.uri_allow_list}\n`);
    process.stdout.write("\nPass --apply to PATCH remote config.\n");
    return 0;
  }

  const patchRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    { method: "PATCH", headers, body: JSON.stringify(patchBody) }
  );

  if (!patchRes.ok) {
    process.stderr.write(
      `PATCH auth config failed: ${patchRes.status} ${await patchRes.text()}\n`
    );
    return 1;
  }

  const updated = await patchRes.json();
  process.stdout.write("Supabase auth redirect URLs updated (ops-only).\n");
  process.stdout.write(`site_url: ${updated.site_url}\n`);
  process.stdout.write(`uri_allow_list: ${updated.uri_allow_list}\n`);
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
