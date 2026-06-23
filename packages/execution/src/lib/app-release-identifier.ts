import { parseEnvBoolean } from "./env-boolean.js";

const RELEASE_SHA_ENV_KEYS = [
  "AFENDA_RELEASE_SHA",
  "VERCEL_GIT_COMMIT_SHA",
  "GIT_COMMIT_SHA",
] as const;

export function readAppReleaseIdentifier(
  env: NodeJS.ProcessEnv = process.env
): string | null {
  for (const key of RELEASE_SHA_ENV_KEYS) {
    const value = env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

export function readWorkerReleaseCheckRequired(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const explicit = env["WORKER_RELEASE_CHECK_REQUIRED"];

  if (explicit !== undefined && explicit.trim() !== "") {
    return parseEnvBoolean(explicit, false);
  }

  return parseEnvBoolean(env["OUTBOX_SCHEDULER_REQUIRED"], false);
}
