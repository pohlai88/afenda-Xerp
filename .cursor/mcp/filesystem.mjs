#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(
  command,
  ["-y", "@modelcontextprotocol/server-filesystem", repoRoot],
  {
    env: process.env,
    shell: true,
    stdio: "inherit",
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start filesystem MCP:", error.message);
  process.exit(1);
});
