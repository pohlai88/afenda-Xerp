#!/usr/bin/env node
/**
 * One-shot: merge production + preview redirect URLs into Supabase Auth config.
 * Reads SUPABASE_ACCESS_TOKEN from .env.secret via dotenv.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const PROJECT_REF = "esxjzvcfqtaxmiwjntje";
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
const token = secret.get("SUPABASE_ACCESS_TOKEN");
if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN in .env.secret");
  process.exit(1);
}

const REQUIRED = [
  "https://www.nexuscanon.com/**",
  "https://*.nexuscanon.com/**",
  "https://*-jacks-projects-7b3cfe94.vercel.app/**",
  "http://localhost:3000/**",
  "http://localhost:3002/**",
];

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const getRes = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
  { headers }
);

if (!getRes.ok) {
  console.error("GET auth config failed:", getRes.status, await getRes.text());
  process.exit(1);
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

const patchRes = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
  { method: "PATCH", headers, body: JSON.stringify(patchBody) }
);

if (!patchRes.ok) {
  console.error(
    "PATCH auth config failed:",
    patchRes.status,
    await patchRes.text()
  );
  process.exit(1);
}

const updated = await patchRes.json();
console.log("Supabase auth redirect URLs updated.");
console.log("site_url:", updated.site_url);
console.log("uri_allow_list:", updated.uri_allow_list);
