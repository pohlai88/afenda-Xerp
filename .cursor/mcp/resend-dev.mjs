#!/usr/bin/env node
/**
 * Resend MCP — developer agent tooling only (not ERP tenant/auth mail).
 */
import { spawn } from "node:child_process";

import { loadResendDevEnv } from "./resend-mcp-env.mjs";

const env = loadResendDevEnv();
const apiKey = env.RESEND_API_KEY?.trim() ?? "";

if (!apiKey) {
  console.error(
    [
      "Resend dev MCP: missing RESEND_API_KEY.",
      "Add to .env.secret (developer tooling only — not tenant auth):",
      "  RESEND_API_KEY=re_xxxxxxxx",
      "Optional: RESEND_FROM=onboarding@resend.dev",
      "Then: pnpm env:sync",
    ].join("\n")
  );
  process.exit(1);
}

process.env.RESEND_API_KEY = apiKey;

const sender =
  env.RESEND_FROM?.trim() ?? env.RESEND_MCP_FROM?.trim() ?? "";

if (sender) {
  process.env.SENDER_EMAIL_ADDRESS = sender;
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(command, ["-y", "resend-mcp@latest"], {
  env: process.env,
  shell: true,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start resend-mcp:", error.message);
  process.exit(1);
});
