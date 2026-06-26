#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadMergedEnv, resolveRepoRoot } from "./env-utils.mjs";

const repoRoot = resolveRepoRoot();
const merged = loadMergedEnv(repoRoot, {});
const token = merged.entries.get("VERCEL_TOKEN")?.trim();

if (!token) {
  console.error("[redeploy-docs-vercel] Missing VERCEL_TOKEN");
  process.exit(1);
}

const project = JSON.parse(
  readFileSync(join(repoRoot, "apps/docs/.vercel/project.json"), "utf8")
);

const query = new URLSearchParams();
if (project.orgId) {
  query.set("teamId", project.orgId);
}

const target = process.argv.includes("--preview") ? "preview" : "production";

const response = await fetch(
  `https://api.vercel.com/v13/deployments?${query.toString()}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: project.projectName,
      project: project.projectId,
      target,
      gitSource: {
        type: "github",
        org: "pohlai88",
        repo: "afenda-Xerp",
        ref: "main",
        repoId: 1_274_585_617,
      },
    }),
  }
);

const payload = await response.json();

if (!response.ok) {
  console.error(
    `[redeploy-docs-vercel] Failed (${response.status}):`,
    JSON.stringify(payload, null, 2)
  );
  process.exit(1);
}

console.log(
  `[redeploy-docs-vercel] ${target} deployment:`,
  payload.url ?? payload.alias?.[0] ?? payload.id
);
console.log(
  `[redeploy-docs-vercel] inspect: https://vercel.com/${payload.creator?.username ?? "deployments"}/${project.projectName}/${payload.id}`
);
