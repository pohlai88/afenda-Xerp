#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const LINE_SPLIT_REGEX = /\r?\n/u;

function parseEnvFile(path) {
  const map = new Map();
  for (const line of readFileSync(path, "utf8").split(LINE_SPLIT_REGEX)) {
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
  return map;
}

const secret = parseEnvFile(resolve(ROOT, ".env.secret"));
const token = secret.get("VERCEL_TOKEN");
const projectId = "prj_rEu23fWSlpHD3C7FzPnsxfWQHBfm";

const res = await fetch(
  `https://api.vercel.com/v9/projects/${projectId}/env?decrypt=true&teamId=team_Ymg16AtjGxrKyjaZk5Z52IYc`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const body = await res.json();
if (!res.ok) {
  console.error(body);
  process.exit(1);
}

for (const key of [
  "TRIGGER_SECRET_KEY",
  "OUTBOX_SCHEDULER_REQUIRED",
  "WORKER_RELEASE_CHECK_REQUIRED",
]) {
  const row = (body.envs ?? []).find(
    (e) => e.key === key && e.target?.includes("production")
  );
  const value = row?.value ?? "(missing)";
  const preview =
    key.includes("SECRET") || key.includes("KEY")
      ? `${String(value).slice(0, 12)}…`
      : value;
  console.log(`${key} (production): ${preview}`);
}
