#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  compareSyncedTargets,
  GENERATED_HEADER,
  LOCAL_SYNC_TARGETS,
  loadMergedEnv,
  resolveRepoRoot,
  SOURCE_FILES,
  serializeEnvFile,
  writeEnvTargets,
} from "./env-utils.mjs";

const VERCEL_ENV_TARGETS = ["production", "preview", "development"];

function parseArgs(argv) {
  const options = {
    check: false,
    vercel: false,
    vercelTargets: [...VERCEL_ENV_TARGETS],
    overlay: null,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--check") {
      options.check = true;
      continue;
    }

    if (arg === "--vercel") {
      options.vercel = true;
      continue;
    }

    if (arg.startsWith("--overlay=")) {
      options.overlay = arg.slice("--overlay=".length);
      continue;
    }

    if (arg === "--overlay") {
      options.overlay = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith("--environment=")) {
      options.vercelTargets = arg
        .slice("--environment=".length)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      continue;
    }

    if (arg === "--environment") {
      options.vercelTargets = (argv[index + 1] ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      index += 1;
      continue;
    }

    if (VERCEL_ENV_TARGETS.includes(arg)) {
      options.vercel = true;
      options.vercelTargets = [arg];
    }
  }

  return options;
}

function printHelp() {
  process.stdout.write(`Usage: pnpm env:sync [options]

Merge human-managed env sources into repo env targets.

Sources (in order):
  1. ${SOURCE_FILES.config}
  2. optional overlay (.env.config.local or .env.config.production)
  3. ${SOURCE_FILES.secret}

Local targets:
${LOCAL_SYNC_TARGETS.map((target) => `  - ${target}`).join("\n")}

Options:
  --check                     Verify synced files match sources; no writes
  --overlay <name>            Also merge .env.config.<name> (e.g. local, production)
  --vercel                    Push merged env to linked Vercel project
  --environment <a,b,c>       Vercel targets: production, preview, development
  production|preview|development   Shorthand for --vercel --environment <name>

Examples:
  pnpm env:sync
  pnpm env:sync -- --check
  pnpm env:sync -- --overlay production --vercel production
`);
}

function resolveOverlays(options) {
  const overlays = [];

  if (options.overlay) {
    overlays.push(`.env.config.${options.overlay}`);
    return overlays;
  }

  if (!options.vercel) {
    overlays.push(".env.config.local");
  }

  return overlays;
}

function assertSourcesExist(repoRoot) {
  const missing = Object.values(SOURCE_FILES).filter(
    (relativePath) => !existsSync(join(repoRoot, relativePath))
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required env source file(s): ${missing.join(", ")}`
    );
  }
}

function readVercelProject(repoRoot) {
  const projectFile = join(repoRoot, ".vercel", "project.json");

  if (!existsSync(projectFile)) {
    throw new Error(
      "Missing .vercel/project.json. Run `vercel link` in the repo root before pushing env vars."
    );
  }

  return JSON.parse(readFileSync(projectFile, "utf8"));
}

function buildVercelQuery(project) {
  const query = new URLSearchParams();

  if (project.orgId) {
    query.set("teamId", project.orgId);
  }

  return query;
}

function shouldSkipVercelEnvKey(key, value) {
  if (value === undefined || value === "") {
    return true;
  }

  return key.startsWith("VERCEL_") && key !== "VERCEL_PROJECT_PRODUCTION_URL";
}

function isVercelEnvUpToDate(current, value, targets) {
  return (
    current.value === value &&
    targets.every((target) => current.target?.includes(target))
  );
}

async function listVercelEnvVars(project, token) {
  const query = buildVercelQuery(project);
  const listResponse = await fetch(
    `https://api.vercel.com/v9/projects/${project.projectId}/env?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!listResponse.ok) {
    throw new Error(
      `Failed to list Vercel env vars (${listResponse.status}): ${await listResponse.text()}`
    );
  }

  const listPayload = await listResponse.json();

  return new Map((listPayload.envs ?? []).map((entry) => [entry.key, entry]));
}

async function patchVercelEnvVar(project, token, current, key, value, targets) {
  const patchQuery = buildVercelQuery(project);
  const patchResponse = await fetch(
    `https://api.vercel.com/v9/projects/${project.projectId}/env/${current.id}?${patchQuery.toString()}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        target: targets,
        type: current.type ?? "encrypted",
      }),
    }
  );

  if (!patchResponse.ok) {
    throw new Error(
      `Failed to update ${key} on Vercel (${patchResponse.status}): ${await patchResponse.text()}`
    );
  }
}

async function createVercelEnvVar(project, token, query, key, value, targets) {
  const createResponse = await fetch(
    `https://api.vercel.com/v10/projects/${project.projectId}/env?${query.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: targets,
      }),
    }
  );

  if (!createResponse.ok) {
    throw new Error(
      `Failed to create ${key} on Vercel (${createResponse.status}): ${await createResponse.text()}`
    );
  }
}

async function syncVercelEnvEntry({
  project,
  token,
  query,
  key,
  value,
  targets,
  existing,
}) {
  const current = existing.get(key);

  if (current && isVercelEnvUpToDate(current, value, targets)) {
    return "skipped";
  }

  if (current) {
    await patchVercelEnvVar(project, token, current, key, value, targets);
    return "updated";
  }

  await createVercelEnvVar(project, token, query, key, value, targets);
  return "created";
}

async function pushToVercel(repoRoot, merged, targets) {
  const project = readVercelProject(repoRoot);
  const token = merged.entries.get("VERCEL_TOKEN")?.trim();

  if (!token) {
    throw new Error(
      "VERCEL_TOKEN is required in .env.secret to push env vars to Vercel."
    );
  }

  const invalidTargets = targets.filter(
    (target) => !VERCEL_ENV_TARGETS.includes(target)
  );

  if (invalidTargets.length > 0) {
    throw new Error(
      `Invalid Vercel environment target(s): ${invalidTargets.join(", ")}`
    );
  }

  const query = buildVercelQuery(project);
  const existing = await listVercelEnvVars(project, token);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const key of merged.order) {
    const value = merged.entries.get(key);

    if (shouldSkipVercelEnvKey(key, value)) {
      skipped += 1;
      continue;
    }

    const result = await syncVercelEnvEntry({
      project,
      token,
      query,
      key,
      value,
      targets,
      existing,
    });

    if (result === "created") {
      created += 1;
    } else if (result === "updated") {
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  process.stdout.write(
    `Vercel env sync complete (${targets.join(", ")}): ${created} created, ${updated} updated, ${skipped} skipped.\n`
  );
}

async function syncLocal(repoRoot, expectedContent, options) {
  const stale = await compareSyncedTargets(
    repoRoot,
    expectedContent,
    LOCAL_SYNC_TARGETS
  );

  if (options.check) {
    if (stale.length === 0) {
      process.stdout.write("Local env targets are in sync.\n");
      return 0;
    }

    process.stderr.write(
      `Local env targets are out of sync:\n${stale
        .map((entry) => `  - ${entry.relativePath} (${entry.reason})`)
        .join("\n")}\n`
    );
    process.stderr.write(
      "Run `pnpm env:sync` to refresh generated env files.\n"
    );
    return 1;
  }

  const written = await writeEnvTargets(
    repoRoot,
    expectedContent,
    LOCAL_SYNC_TARGETS
  );

  process.stdout.write(
    `Synced ${written.length} local env target(s) from ${SOURCE_FILES.config} + ${SOURCE_FILES.secret}.\n`
  );

  return 0;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return 0;
  }

  const repoRoot = resolveRepoRoot();
  assertSourcesExist(repoRoot);

  const overlays = resolveOverlays(options).filter((relativePath) =>
    existsSync(join(repoRoot, relativePath))
  );
  const merged = loadMergedEnv(repoRoot, { overlays });
  const expectedContent = serializeEnvFile(merged, GENERATED_HEADER);

  if (options.vercel) {
    await pushToVercel(repoRoot, merged, options.vercelTargets);
  }

  return syncLocal(repoRoot, expectedContent, options);
}

main()
  .then((code) => {
    process.exit(code);
  })
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  });
