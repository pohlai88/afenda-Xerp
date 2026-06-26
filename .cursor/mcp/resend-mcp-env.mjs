import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const RESEND_API_BASE = "https://api.resend.com";
export const RESEND_WEBHOOK_PATH = "/api/webhooks/resend";

const ENV_FILES = [".env", ".env.local", ".env.secret", ".env.config"];

export function applyEnvLine(line, target) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex <= 0) {
    return;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (target[key] === undefined) {
    target[key] = value;
  }
}

export function loadResendDevEnv() {
  const env = { ...process.env };

  for (const relativePath of ENV_FILES) {
    const absolutePath = join(REPO_ROOT, relativePath);

    if (!existsSync(absolutePath)) {
      continue;
    }

    for (const line of readFileSync(absolutePath, "utf8").split(/\r?\n/)) {
      applyEnvLine(line, env);
    }
  }

  return env;
}

export function requireResendApiKey(env = loadResendDevEnv()) {
  const apiKey = env.RESEND_API_KEY?.trim() ?? "";

  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY in .env.secret (developer MCP key — not AFENDA_AUTH_EMAIL_*)."
    );
  }

  return apiKey;
}

export function resolveErpOrigin(env, cliOrigin) {
  const explicit = cliOrigin?.trim();

  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercelUrl = env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  const betterAuthUrl = env.BETTER_AUTH_URL?.trim();

  if (betterAuthUrl) {
    return betterAuthUrl.replace(/\/$/, "");
  }

  return null;
}

export async function resendFetch(apiKey, path, init = {}) {
  const response = await fetch(`${RESEND_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const text = await response.text();
  let body;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { ok: response.ok, status: response.status, body };
}

export function maskKey(key) {
  if (!key || key.length < 12) {
    return "(invalid or too short)";
  }

  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}
