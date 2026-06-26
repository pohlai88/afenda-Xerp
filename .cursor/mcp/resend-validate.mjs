#!/usr/bin/env node
/**
 * Validate Resend account config (developer MCP + ERP cross-check).
 * Usage: pnpm resend:validate
 */
import {
  loadResendDevEnv,
  maskKey,
  RESEND_WEBHOOK_PATH,
  resendFetch,
  resolveErpOrigin,
} from "./resend-mcp-env.mjs";

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

const env = loadResendDevEnv();
const apiKey = env.RESEND_API_KEY?.trim() ?? "";
const devFrom = env.RESEND_FROM?.trim() ?? env.RESEND_MCP_FROM?.trim() ?? "";
const tenantFrom = env.AFENDA_AUTH_EMAIL_FROM?.trim() ?? "";
const tenantKeySet = Boolean(env.AFENDA_AUTH_EMAIL_API_KEY?.trim());
const productionOrigin = resolveErpOrigin(
  { ...env, BETTER_AUTH_URL: "https://www.nexuscanon.com" },
  "https://www.nexuscanon.com"
);
const expectedWebhook = productionOrigin
  ? `${productionOrigin}${RESEND_WEBHOOK_PATH}`
  : null;

printSection("MCP dev vs ERP tenant");
console.log(`RESEND_API_KEY (MCP):      ${apiKey ? maskKey(apiKey) : "MISSING"}`);
console.log(`RESEND_FROM (MCP):         ${devFrom || "(not set)"}`);
console.log(`AFENDA_AUTH_EMAIL_FROM:    ${tenantFrom || "(not set)"}`);
console.log(`AFENDA_AUTH_EMAIL_API_KEY: ${tenantKeySet ? "set (Vercel runtime)" : "not set"}`);
console.log(`Webhook ingress:           Vercel apps/erp → ${RESEND_WEBHOOK_PATH}`);

if (!apiKey) {
  console.error("\nCannot validate: add RESEND_API_KEY to .env.secret.");
  process.exit(1);
}

printSection("API key");
const keyCheck = await resendFetch(apiKey, "/domains");

if (keyCheck.status === 401 || keyCheck.status === 403) {
  console.log(`FAIL — HTTP ${keyCheck.status}: invalid or revoked API key`);
  process.exit(1);
}

console.log(keyCheck.ok ? "OK — API key accepted" : `WARN — HTTP ${keyCheck.status}`);

printSection("Domains");
const domains = keyCheck.ok ? keyCheck.body?.data ?? [] : [];

for (const domain of domains) {
  console.log(
    `- ${domain.name}: status=${domain.status}, region=${domain.region ?? "n/a"}`
  );
}

if (tenantFrom) {
  const tenantDomain = tenantFrom.split("@").pop()?.replace(/>.*$/, "") ?? "";
  const match = domains.find((d) => d.name === tenantDomain);

  printSection("Tenant sender cross-check");
  console.log(
    match
      ? `${tenantDomain}: verified (${match.status})`
      : `${tenantDomain}: NOT in Resend — check DNS`
  );
}

printSection("Webhooks");
const webhooks = await resendFetch(apiKey, "/webhooks");
const items = webhooks.ok ? webhooks.body?.data ?? [] : [];

if (!webhooks.ok) {
  console.log(`HTTP ${webhooks.status}`);
} else if (items.length === 0) {
  console.log("None configured.");
  if (expectedWebhook) {
    console.log(`Expected: ${expectedWebhook}`);
  }
} else {
  for (const hook of items) {
    const marker =
      expectedWebhook && hook.endpoint === expectedWebhook ? " ✓ production" : "";
    console.log(`- ${hook.endpoint} [${(hook.events ?? []).join(", ")}]${marker}`);
  }

  if (expectedWebhook) {
    const dupes = items.filter((hook) => hook.endpoint === expectedWebhook);

    if (dupes.length > 1) {
      console.log(
        `WARN — ${dupes.length} webhooks for ${expectedWebhook} → pnpm resend:webhook:cleanup`
      );
    }

    if (dupes.length === 0) {
      console.log(`WARN — missing ${expectedWebhook}`);
    }
  }
}

printSection("ERP webhook secret (local)");
console.log(
  env.AFENDA_RESEND_WEBHOOK_SECRET?.trim()
    ? "AFENDA_RESEND_WEBHOOK_SECRET: set"
    : "AFENDA_RESEND_WEBHOOK_SECRET: not in merged local env (may exist on Vercel only)"
);

printSection("Test send (delivered@resend.dev)");
const testFrom =
  devFrom.includes("resend.dev") || devFrom.includes("onboarding@")
    ? devFrom
    : "onboarding@resend.dev";

const send = await resendFetch(apiKey, "/emails", {
  method: "POST",
  body: JSON.stringify({
    from: testFrom,
    to: ["delivered@resend.dev"],
    subject: "Afenda Resend validation",
    html: "<p>Dev validation only.</p>",
  }),
});

console.log(
  send.ok
    ? `OK — ${send.body?.id ?? "sent"}`
    : `FAIL — HTTP ${send.status}: ${JSON.stringify(send.body)}`
);

console.log("\nDone.");
