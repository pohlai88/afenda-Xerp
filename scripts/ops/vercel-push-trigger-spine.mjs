#!/usr/bin/env node
/**
 * Push Trigger spine env keys to both Vercel production and preview targets.
 * Ensures OUTBOX_SCHEDULER_REQUIRED=true (via production overlay merge) reaches prod.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getVercelPushSkipReason,
  loadMergedEnv,
  mergeVercelEnvTargets,
  resolveRepoRoot,
} from "../env-utils.mjs";

const SPINE_KEYS = [
  "TRIGGER_PROJECT_REF",
  "TRIGGER_API_URL",
  "TRIGGER_SECRET_KEY",
  "OUTBOX_SCHEDULER_REQUIRED",
  "WORKER_RELEASE_CHECK_REQUIRED",
  "ALLOW_DEGRADED_EXECUTION",
];

function readVercelProject(repoRoot) {
  return JSON.parse(
    readFileSync(join(repoRoot, ".vercel", "project.json"), "utf8")
  );
}

async function listEnv(project, token) {
  const query = new URLSearchParams({ teamId: project.orgId });
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${project.projectId}/env?${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const body = await res.json();
  return body.envs ?? [];
}

async function upsertEnv(project, token, key, value, targets) {
  const query = new URLSearchParams({ teamId: project.orgId });
  const existing = (await listEnv(project, token)).filter((e) => e.key === key);
  const covered = new Set(existing.flatMap((e) => e.target ?? []));

  if (targets.every((t) => covered.has(t))) {
    const row = existing.find((e) =>
      targets.every((t) => e.target?.includes(t))
    );
    if (row && row.value === value) {
      return "skipped";
    }
  }

  const row = existing[0];
  if (row) {
    const mergedTargets = mergeVercelEnvTargets(row.target, targets);
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${project.projectId}/env/${row.id}?${query}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value,
          target: mergedTargets,
          type: row.type ?? "encrypted",
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`${key} patch: ${await res.text()}`);
    }
    return "updated";
  }

  const res = await fetch(
    `https://api.vercel.com/v10/projects/${project.projectId}/env?${query}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value, type: "encrypted", target: targets }),
    }
  );
  if (!res.ok) {
    throw new Error(`${key} create: ${await res.text()}`);
  }
  return "created";
}

const repoRoot = resolveRepoRoot();
const overlayPath = join(repoRoot, ".env.config.production");
const overlays = existsSync(overlayPath) ? [".env.config.production"] : [];
const merged = loadMergedEnv(repoRoot, { overlays });
const project = readVercelProject(repoRoot);
const token = merged.entries.get("VERCEL_TOKEN")?.trim();

if (!token) {
  console.error("VERCEL_TOKEN missing in .env.secret");
  process.exit(1);
}

const prodSecret = merged.entries.get("TRIGGER_SECRET_KEY_PROD")?.trim();
const devSecret = merged.entries.get("TRIGGER_SECRET_KEY")?.trim();
const productionTriggerKey = prodSecret || devSecret;

if (!productionTriggerKey?.startsWith("tr_prod_")) {
  console.warn(
    "Warning: production Trigger key is not tr_prod_* — prod spine API calls may fail until TRIGGER_SECRET_KEY_PROD is set in .env.secret."
  );
}

for (const key of SPINE_KEYS) {
  let value = merged.entries.get(key)?.trim();
  if (!value || getVercelPushSkipReason(key, value)) {
    continue;
  }
  if (key === "TRIGGER_SECRET_KEY") {
    value = productionTriggerKey;
  }
  const result = await upsertEnv(project, token, key, value, [
    "production",
    "preview",
  ]);
  console.log(`${key}: ${result} → production+preview`);
}

console.log(
  "Done. Redeploy ERP on Vercel to run instrumentation with updated env."
);
