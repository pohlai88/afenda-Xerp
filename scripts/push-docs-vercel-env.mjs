#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isVercelEnvUpToDate,
  loadMergedEnv,
  mergeVercelEnvTargets,
  resolveRepoRoot,
} from "./env-utils.mjs";

const DOCS_VERCEL_KEYS = ["DOCS_GITHUB_APP_ID", "DOCS_GITHUB_APP_PRIVATE_KEY"];
const VERCEL_TARGETS = ["production", "preview"];

function readDocsVercelProject(repoRoot) {
  const projectFile = join(repoRoot, "apps/docs/.vercel/project.json");
  return JSON.parse(readFileSync(projectFile, "utf8"));
}

function buildVercelQuery(project) {
  const query = new URLSearchParams();
  if (project.orgId) {
    query.set("teamId", project.orgId);
  }
  return query;
}

async function listVercelEnvVars(project, token) {
  const query = buildVercelQuery(project);
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${project.projectId}/env?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to list Vercel env vars (${response.status}): ${await response.text()}`
    );
  }

  const payload = await response.json();
  return new Map((payload.envs ?? []).map((entry) => [entry.key, entry]));
}

async function patchVercelEnvVar(project, token, current, key, value, targets) {
  const query = buildVercelQuery(project);
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${project.projectId}/env/${current.id}?${query.toString()}`,
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

  if (!response.ok) {
    throw new Error(
      `Failed to update ${key} on Vercel (${response.status}): ${await response.text()}`
    );
  }
}

async function createVercelEnvVar(project, token, query, key, value, targets) {
  const response = await fetch(
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

  if (!response.ok) {
    throw new Error(
      `Failed to create ${key} on Vercel (${response.status}): ${await response.text()}`
    );
  }
}

function normalizePrivateKey(value) {
  let key = value.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  if (key.includes("\\\\n")) {
    key = key.replace(/\\\\n/g, "\n");
  }
  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }
  if (key.includes("\\\n")) {
    key = key.replace(/\\\n/g, "\n");
  }
  return key;
}

async function syncDocsKey({ project, token, query, key, value, existing }) {
  const current = existing.get(key);
  const targets = VERCEL_TARGETS;

  if (current && isVercelEnvUpToDate(current, value, targets)) {
    return "skipped";
  }

  if (current) {
    const mergedTargets = mergeVercelEnvTargets(current.target, targets);
    await patchVercelEnvVar(project, token, current, key, value, mergedTargets);
    return "updated";
  }

  await createVercelEnvVar(project, token, query, key, value, targets);
  return "created";
}

const repoRoot = resolveRepoRoot();
const merged = loadMergedEnv(repoRoot, {});
const token = merged.entries.get("VERCEL_TOKEN")?.trim();

if (!token) {
  console.error("[push-docs-vercel-env] Missing VERCEL_TOKEN in .env.secret");
  process.exit(1);
}

const project = readDocsVercelProject(repoRoot);
const query = buildVercelQuery(project);
const existing = await listVercelEnvVars(project, token);

for (const key of DOCS_VERCEL_KEYS) {
  const raw = merged.entries.get(key)?.trim();

  if (!raw) {
    console.error(`[push-docs-vercel-env] Missing ${key} in env sources`);
    process.exit(1);
  }

  const value =
    key === "DOCS_GITHUB_APP_PRIVATE_KEY" ? normalizePrivateKey(raw) : raw;

  const result = await syncDocsKey({
    project,
    token,
    query,
    key,
    value,
    existing,
  });

  console.log(`[push-docs-vercel-env] ${key}: ${result}`);
}

console.log(
  `[push-docs-vercel-env] Done — ${project.projectName} (${VERCEL_TARGETS.join(", ")})`
);
