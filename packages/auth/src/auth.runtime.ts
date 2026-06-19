import { getBetterAuthSecret, getBetterAuthUrl } from "./auth.env.js";
import { BETTER_AUTH_SECRET_ENV, BETTER_AUTH_URL_ENV } from "./auth.errors.js";

function readAuthEnvSignature(env: NodeJS.ProcessEnv): string | undefined {
  try {
    const url = getBetterAuthUrl(env);
    const secret = getBetterAuthSecret(env);
    return `${url}|${secret}`;
  } catch {
    return;
  }
}

export function readAuthConfigFingerprint(env: NodeJS.ProcessEnv): string {
  const signature = readAuthEnvSignature(env);

  if (signature) {
    return signature;
  }

  const url = env[BETTER_AUTH_URL_ENV] ?? "";
  const secret = env[BETTER_AUTH_SECRET_ENV] ?? "";
  return `invalid:${url}|${secret}`;
}
