#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * One-shot GitHub Actions secret bootstrap for Vercel preview workflows.
 *
 * Requires a GitHub token with Actions secrets write on pohlai88/afenda-Xerp.
 * Loads GITHUB_TOKEN from .env.secret first; falls back to `gh auth token`
 * when the file token cannot access the secrets API.
 *
 * Usage:
 *   pnpm env:setup-github-vercel-secrets
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO = "pohlai88/afenda-Xerp";
const REPO_ROOT = join(import.meta.dirname, "..");

function readSecretKey(name) {
  const secretPath = join(REPO_ROOT, ".env.secret");
  const match = readFileSync(secretPath, "utf8").match(
    new RegExp(`^${name}=(.+)$`, "m")
  );
  return match?.[1]?.trim() ?? null;
}

async function canSetActionsSecrets(token) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO}/actions/secrets/public-key`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "afenda-env-setup-github-vercel-secrets",
      },
    }
  );

  return response.ok;
}

function readGhAuthToken() {
  const result = spawnSync("gh", ["auth", "token"], {
    encoding: "utf8",
    env: { ...process.env, GITHUB_TOKEN: undefined, GH_TOKEN: undefined },
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.trim() || null;
}

async function resolveGitHubToken() {
  const candidates = [
    {
      source: "GH_TOKEN/GITHUB_TOKEN env",
      token: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN,
    },
    {
      source: ".env.secret GITHUB_TOKEN",
      token: readSecretKey("GITHUB_TOKEN"),
    },
    { source: "gh auth token", token: readGhAuthToken() },
  ];

  for (const candidate of candidates) {
    if (!candidate.token) {
      continue;
    }

    if (await canSetActionsSecrets(candidate.token)) {
      return candidate;
    }

    process.stderr.write(
      `Skipping ${candidate.source}: cannot access Actions secrets API (403).\n`
    );
  }

  return null;
}

const secrets = {
  VERCEL_ORG_ID: "team_Ymg16AtjGxrKyjaZk5Z52IYc",
  VERCEL_PROJECT_ID: "prj_rEu23fWSlpHD3C7FzPnsxfWQHBfm",
  VERCEL_PROJECT_ID_DOCS: "prj_TdwsDOO3N598XUHtmspRhk2voRMm",
  VERCEL_TOKEN: readSecretKey("VERCEL_TOKEN"),
};

const resolved = await resolveGitHubToken();

if (!resolved) {
  process.stderr.write(
    "No token can write Actions secrets. Grant Actions → Secrets (read/write) on a fine-grained PAT in .env.secret, or run `gh auth login` with workflow scope.\n"
  );
  process.exit(1);
}

process.stdout.write(`Using GitHub token from: ${resolved.source}\n`);

if (!secrets.VERCEL_TOKEN) {
  process.stderr.write("VERCEL_TOKEN missing from .env.secret\n");
  process.exit(1);
}

const ghEnv = {
  ...process.env,
  GITHUB_TOKEN: undefined,
  GH_TOKEN: resolved.token,
};

let failed = 0;

for (const [name, value] of Object.entries(secrets)) {
  const result = spawnSync(
    "gh",
    ["secret", "set", name, "--body", value, "--repo", REPO],
    { stdio: "inherit", env: ghEnv }
  );

  if (result.status === 0) {
    process.stdout.write(`Set ${name}\n`);
  } else {
    failed += 1;
    process.stderr.write(`Failed to set ${name}\n`);
  }
}

process.exit(failed > 0 ? 1 : 0);
