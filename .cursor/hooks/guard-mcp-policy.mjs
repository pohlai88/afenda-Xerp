#!/usr/bin/env node
/**
 * beforeMCPExecution — consolidated MCP policy for afenda-Xerp.
 */
import {
  allow,
  ask,
  deny,
  extractToolName,
  hasDrizzleWorkflow,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";

const TAG = "guard-mcp-policy";

const DEPLOY_TOOLS = /\bdeploy_to_vercel\b/i;

function checkVercelDeploy(input) {
  const toolName = extractToolName(input);
  const serverName = String(
    input.server ?? input.mcp_server ?? input.serverName ?? ""
  );
  const haystack = `${serverName} ${toolName} ${JSON.stringify(input.arguments ?? {})}`;

  if (!DEPLOY_TOOLS.test(haystack)) {
    return null;
  }

  return {
    kind: "ask",
    user_message:
      "Agent is about to deploy via Vercel MCP. Confirm deploy target (preview vs production) before continuing.",
    agent_message:
      "Vercel MCP deploy blocked pending approval. Pre-flight: pnpm check and pnpm --filter @afenda/erp build. After deploy use deployment logs MCP tools.",
  };
}

function checkDrizzleMigration(input, repoRoot) {
  if (!hasDrizzleWorkflow(repoRoot)) {
    return null;
  }

  const serverName = String(
    input.server ?? input.mcp_server ?? input.serverName ?? ""
  ).toLowerCase();
  const toolName = extractToolName(input).toLowerCase();

  if (toolName === "apply_migration") {
    return {
      kind: "deny",
      user_message:
        "Supabase MCP apply_migration is blocked. Use pnpm migrate so migrations run through the Drizzle workflow.",
      agent_message:
        "Blocked Supabase apply_migration. Use pnpm migrate or pnpm --filter @afenda/database db:migrate instead.",
    };
  }

  if (toolName === "execute_sql" && /supabase/.test(serverName)) {
    const args = input.arguments ?? input.args ?? {};
    const query = String(args.query ?? args.sql ?? "").toLowerCase();

    if (!query) {
      return null;
    }

    const migrationLedger =
      /__drizzle_migrations|drizzle\.__drizzle_migrations/.test(query);
    const ddl =
      /\b(create|alter|drop|truncate)\b[\s\S]*\b(table|schema|function|index|policy|trigger|type)\b/.test(
        query
      );

    if (migrationLedger || ddl) {
      return {
        kind: "deny",
        user_message:
          "Supabase MCP DDL is blocked. Use the repo Drizzle migration workflow instead.",
        agent_message:
          "Blocked Supabase execute_sql DDL. Use pnpm migrate or pnpm --filter @afenda/database db:migrate.",
      };
    }
  }

  return null;
}

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  allow();
}

const repoRoot = resolveRepoRoot();

for (const result of [
  checkVercelDeploy(input),
  checkDrizzleMigration(input, repoRoot),
]) {
  if (!result) {
    continue;
  }

  log(TAG, `matched MCP policy: ${result.kind}`);

  if (result.kind === "deny") {
    deny(result.user_message, result.agent_message);
  }

  ask(result.user_message, result.agent_message);
}

allow();
