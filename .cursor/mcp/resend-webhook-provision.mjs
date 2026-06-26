#!/usr/bin/env node
/**
 * Register Resend webhook for ERP bounce/complaint ingress (Vercel / apps/erp).
 *
 * Usage:
 *   pnpm resend:webhook:provision -- --origin https://www.nexuscanon.com
 *   pnpm resend:webhook:provision -- --dry-run
 */
import {
  loadResendDevEnv,
  requireResendApiKey,
  RESEND_WEBHOOK_PATH,
  resendFetch,
  resolveErpOrigin,
} from "./resend-mcp-env.mjs";

const WEBHOOK_EVENTS = ["email.bounced", "email.complained"];

function readArg(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return;
  }

  return process.argv[index + 1];
}

const dryRun = process.argv.includes("--dry-run");
const env = loadResendDevEnv();
const origin = resolveErpOrigin(env, readArg("--origin"));

if (!origin) {
  console.error(
    "Missing ERP origin. Pass --origin https://www.nexuscanon.com or set BETTER_AUTH_URL."
  );
  process.exit(1);
}

const endpoint = `${origin}${RESEND_WEBHOOK_PATH}`;

console.log(`Target webhook endpoint: ${endpoint}`);
console.log(`Events: ${WEBHOOK_EVENTS.join(", ")}`);
console.log("Runtime: Vercel → apps/erp (not Supabase Edge)");

if (dryRun) {
  console.log("Dry run — no API calls made.");
  process.exit(0);
}

const apiKey = requireResendApiKey(env);

if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
  console.error(
    "Resend cannot reach localhost. Use a public Vercel origin or a tunnel."
  );
  process.exit(1);
}

const existing = await resendFetch(apiKey, "/webhooks");

if (!existing.ok) {
  console.error(`Failed to list webhooks: HTTP ${existing.status}`);
  console.error(JSON.stringify(existing.body, null, 2));
  process.exit(1);
}

const hooks = existing.body?.data ?? [];
const match = hooks.find((hook) => hook.endpoint === endpoint);

if (match) {
  console.log(`Webhook already registered (id=${match.id}).`);
  console.log(
    "Use pnpm resend:webhook:cleanup if duplicates exist. Signing secret is shown only at creation."
  );
  process.exit(0);
}

const created = await resendFetch(apiKey, "/webhooks", {
  method: "POST",
  body: JSON.stringify({
    endpoint,
    events: WEBHOOK_EVENTS,
  }),
});

if (!created.ok) {
  console.error(`Failed to create webhook: HTTP ${created.status}`);
  console.error(JSON.stringify(created.body, null, 2));
  process.exit(1);
}

const signingSecret =
  created.body?.signing_secret ??
  created.body?.secret ??
  created.body?.data?.signing_secret;

console.log("Webhook created.");
console.log(`Webhook id: ${created.body?.id ?? created.body?.data?.id ?? "unknown"}`);

if (signingSecret) {
  console.log("\nAdd to .env.secret:");
  console.log(`AFENDA_RESEND_WEBHOOK_SECRET=${signingSecret}`);
  console.log("\nThen: pnpm env:sync -- --overlay production && pnpm env:console push production --yes");
} else {
  console.log(
    "\nCopy whsec_… from Resend dashboard → Webhooks into AFENDA_RESEND_WEBHOOK_SECRET."
  );
}
