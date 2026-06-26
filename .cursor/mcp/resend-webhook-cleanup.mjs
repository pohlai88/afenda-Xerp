#!/usr/bin/env node
/**
 * Remove duplicate Resend webhooks for the same ERP endpoint (keep newest).
 *
 * Usage:
 *   pnpm resend:webhook:cleanup -- --origin https://www.nexuscanon.com
 *   pnpm resend:webhook:cleanup -- --origin https://www.nexuscanon.com --dry-run
 */
import {
  loadResendDevEnv,
  requireResendApiKey,
  RESEND_WEBHOOK_PATH,
  resendFetch,
  resolveErpOrigin,
} from "./resend-mcp-env.mjs";

function readArg(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return;
  }

  return process.argv[index + 1];
}

const dryRun = process.argv.includes("--dry-run");
const env = loadResendDevEnv();
const apiKey = requireResendApiKey(env);
const origin = resolveErpOrigin(env, readArg("--origin"));

if (!origin) {
  console.error("Missing ERP origin. Pass --origin https://www.nexuscanon.com");
  process.exit(1);
}

const endpoint = `${origin}${RESEND_WEBHOOK_PATH}`;
const listed = await resendFetch(apiKey, "/webhooks");

if (!listed.ok) {
  console.error(`Failed to list webhooks: HTTP ${listed.status}`);
  console.error(JSON.stringify(listed.body, null, 2));
  process.exit(1);
}

const matches = (listed.body?.data ?? []).filter(
  (hook) => hook.endpoint === endpoint
);

console.log(`Endpoint: ${endpoint}`);
console.log(`Matching webhooks: ${matches.length}`);

if (matches.length <= 1) {
  console.log("Nothing to clean up.");
  process.exit(0);
}

const sorted = [...matches].sort((left, right) => {
  const leftTime = Date.parse(left.created_at ?? "") || 0;
  const rightTime = Date.parse(right.created_at ?? "") || 0;
  return rightTime - leftTime;
});

const [keep, ...remove] = sorted;

console.log(`Keep: ${keep.id} (newest)`);

for (const hook of remove) {
  console.log(`${dryRun ? "Would remove" : "Removing"}: ${hook.id}`);

  if (dryRun) {
    continue;
  }

  const deleted = await resendFetch(apiKey, `/webhooks/${hook.id}`, {
    method: "DELETE",
  });

  if (!deleted.ok) {
    console.error(`  FAIL HTTP ${deleted.status}: ${JSON.stringify(deleted.body)}`);
  }
}

if (dryRun) {
  console.log("Dry run complete.");
} else {
  console.log("Cleanup complete. AFENDA_RESEND_WEBHOOK_SECRET must match the kept webhook.");
}
