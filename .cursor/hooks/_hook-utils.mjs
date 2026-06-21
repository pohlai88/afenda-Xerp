/**
 * Shared helpers for afenda-Xerp Cursor hooks.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
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

// ── Gate debounce via pass-stamp files ──────────────────────────────────────

const STAMP_DIR = ".cursor/.gate-stamps";

function stampPath(repoRoot, gateKey) {
  const safeKey = gateKey.replace(/[^a-zA-Z0-9_-]/g, "_");
  return join(repoRoot, STAMP_DIR, `${safeKey}.stamp`);
}

/**
 * Returns true if any tracked-or-modified file under `scopePath` has an
 * mtime newer than the last pass stamp for `gateKey`.
 *
 * Falls back to `scopeChanged` when the stamp file doesn't exist yet
 * (first run).
 */
export function scopeChangedSinceLastPass(repoRoot, scopePath, gateKey) {
  if (!scopeChanged(repoRoot, scopePath)) {
    return false;
  }

  const stamp = stampPath(repoRoot, gateKey);
  let stampMtime;
  try {
    stampMtime = statSync(stamp).mtimeMs;
  } catch {
    return true;
  }

  const status = runGit(
    ["status", "--porcelain", "--", scopePath],
    repoRoot
  );
  if (!status.ok || status.stdout.length === 0) {
    return false;
  }

  const changedFiles = status.stdout
    .split("\n")
    .filter((line) => line.length >= 3)
    .filter((line) => {
      const xy = line.slice(0, 2);
      return !xy.includes("D");
    })
    .map((line) => {
      const raw = line.slice(3).trim();
      const arrowIdx = raw.indexOf(" -> ");
      return arrowIdx !== -1 ? raw.slice(arrowIdx + 4) : raw;
    })
    .filter((f) => f.length > 0);

  if (changedFiles.length === 0) {
    return false;
  }

  for (const file of changedFiles) {
    const abs = join(repoRoot, file);
    try {
      if (statSync(abs).mtimeMs > stampMtime) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

/**
 * Record that a gate passed — touch the stamp file.
 */
export function markGatePassed(repoRoot, gateKey) {
  const stamp = stampPath(repoRoot, gateKey);
  const dir = join(repoRoot, STAMP_DIR);
  try {
    mkdirSync(dir, { recursive: true });
  } catch {
    // already exists
  }
  try {
    writeFileSync(stamp, new Date().toISOString(), "utf8");
  } catch {
    // non-fatal
  }
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
    input.tool_name ?? input.toolName ?? input.name ?? input.mcp_tool ?? ""
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
