#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const LINE_SPLIT_REGEX = /\r?\n/u;
const LOCALHOST_WEBHOOK_URL_PATTERN = /localhost|127\.0\.0\.1/u;

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
const key = secret.get("STRIPE_SECRET_KEY");
if (!key) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const res = await fetch(
  "https://api.stripe.com/v1/webhook_endpoints?limit=20",
  {
    headers: { Authorization: `Bearer ${key}` },
  }
);
const body = await res.json();
if (!res.ok) {
  console.error("Stripe API error:", body);
  process.exit(1);
}

console.log("Existing webhook endpoints:");
for (const endpoint of body.data ?? []) {
  console.log(`- ${endpoint.id} | ${endpoint.url} | status=${endpoint.status}`);
}

const targetUrl = "https://www.nexuscanon.com/api/webhooks/stripe";
const existing = (body.data ?? []).find((e) => e.url === targetUrl);

if (existing) {
  console.log("\nProduction webhook already exists:", existing.id);
  process.exit(0);
}

const localhost = (body.data ?? []).filter((e) =>
  LOCALHOST_WEBHOOK_URL_PATTERN.test(e.url)
);
for (const endpoint of localhost) {
  const del = await fetch(
    `https://api.stripe.com/v1/webhook_endpoints/${endpoint.id}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${key}` } }
  );
  console.log(
    del.ok
      ? `Deleted localhost webhook ${endpoint.id} (${endpoint.url})`
      : `Failed to delete ${endpoint.id}`
  );
}

const create = await fetch("https://api.stripe.com/v1/webhook_endpoints", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    url: targetUrl,
    "enabled_events[0]": "checkout.session.completed",
    "enabled_events[1]": "customer.subscription.updated",
    "enabled_events[2]": "customer.subscription.deleted",
    "enabled_events[3]": "invoice.payment_failed",
  }),
});

const created = await create.json();
if (!create.ok) {
  console.error("Create webhook failed:", created);
  process.exit(1);
}

console.log("\nCreated production webhook:", created.id);
console.log("url:", created.url);
console.log("secret:", created.secret);
console.log(
  "\nUpdate STRIPE_WEBHOOK_SECRET in .env.secret, then run: pnpm env:console push production --yes && pnpm env:console push preview --yes"
);
