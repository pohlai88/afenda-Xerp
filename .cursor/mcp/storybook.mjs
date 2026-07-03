#!/usr/bin/env node
/**
 * Cursor MCP bridge → Storybook addon-mcp HTTP endpoint.
 * Requires: pnpm storybook dev (http://127.0.0.1:6006/mcp)
 */
import { spawn } from "node:child_process";

const STORYBOOK_MCP_URL =
  process.env.STORYBOOK_MCP_URL ?? "http://127.0.0.1:6006/mcp";

console.error(
  `Storybook MCP bridge → ${STORYBOOK_MCP_URL}\n` +
    "Start the dev server first: pnpm storybook dev\n" +
    "Story tests are intentionally disabled in MCP; run pnpm test:storybook:run locally."
);

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(command, ["-y", "mcp-remote", STORYBOOK_MCP_URL], {
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
  console.error("Failed to start Storybook MCP bridge:", error.message);
  process.exit(1);
});
