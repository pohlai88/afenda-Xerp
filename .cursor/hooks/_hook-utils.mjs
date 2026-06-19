/**
 * Shared helpers for afenda-Xerp Cursor hooks.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const MAX_OUTPUT_CHARS = 8000;

export const EDIT_TOOLS = new Set([
  "Write",
  "StrReplace",
  "Delete",
  "EditNotebook",
  "ApplyPatch",
]);

export function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

export function parseStdinJson() {
  const raw = readStdin();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function emit(result) {
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

export function allow() {
  emit({ permission: "allow" });
  process.exit(0);
}

export function ask(userMessage, agentMessage) {
  emit({
    permission: "ask",
    user_message: userMessage,
    agent_message: agentMessage,
  });
  process.exit(0);
}

export function deny(userMessage, agentMessage) {
  emit({
    permission: "deny",
    user_message: userMessage,
    agent_message: agentMessage,
  });
  process.exit(0);
}

export function log(tag, message) {
  process.stderr.write(`[${tag}] ${message}\n`);
}

export function runGit(args, cwd) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  if (result.error) {
    return { ok: false, stdout: "", stderr: String(result.error) };
  }

  return {
    ok: result.status === 0,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
  };
}

export function resolveRepoRoot(cwd = process.cwd()) {
  const fromGit = runGit(["rev-parse", "--show-toplevel"], cwd);

  if (fromGit.ok && fromGit.stdout) {
    return fromGit.stdout;
  }

  return cwd;
}

export function scopeChanged(repoRoot, scopePath) {
  const status = runGit(["status", "--porcelain", "--", scopePath], repoRoot);

  if (!status.ok) {
    return false;
  }

  return status.stdout.length > 0;
}

export function truncate(text, max = MAX_OUTPUT_CHARS) {
  if (text.length <= max) {
    return text;
  }

  const omitted = text.length - max;
  return `${text.slice(0, max)}\n\n… [truncated ${omitted} chars]`;
}

export function runShell(command, repoRoot) {
  return spawnSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
    env: process.env,
  });
}

export function extractCommand(input) {
  return typeof input.command === "string" ? input.command : "";
}

export function extractToolName(input) {
  return String(
    input.tool_name ??
      input.toolName ??
      input.name ??
      input.mcp_tool ??
      ""
  );
}

export function extractPath(input, repoRoot = "") {
  const toolInput = input.tool_input ?? input.arguments ?? input.input ?? {};

  if (typeof toolInput === "string") {
    return normalizePath(toolInput, repoRoot);
  }

  const candidates = [
    toolInput.path,
    toolInput.file_path,
    toolInput.target_notebook,
    toolInput.notebook_path,
    input.path,
    input.file_path,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) {
      return normalizePath(value, repoRoot);
    }
  }

  return "";
}

export function normalizePath(rawPath, repoRoot = "") {
  if (typeof rawPath !== "string" || rawPath.length === 0) {
    return "";
  }

  let normalized = rawPath.replace(/\\/g, "/");

  if (repoRoot) {
    const root = repoRoot.replace(/\\/g, "/").replace(/\/$/, "");
    if (normalized.startsWith(root)) {
      normalized = normalized.slice(root.length).replace(/^\//, "");
    }
  }

  return normalized.replace(/^\.\//, "");
}

export function hasEnvSyncWorkflow(repoRoot) {
  return (
    existsSync(join(repoRoot, "scripts/sync-env.mjs")) ||
    existsSync(join(repoRoot, ".env.config"))
  );
}

export function hasDrizzleWorkflow(repoRoot) {
  const databaseRoot = join(repoRoot, "packages/database");
  return (
    existsSync(join(databaseRoot, "drizzle.config.ts")) ||
    existsSync(join(databaseRoot, "drizzle.config.js")) ||
    existsSync(join(databaseRoot, "drizzle"))
  );
}
