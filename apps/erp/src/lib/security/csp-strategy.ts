import { isDevHarnessRoute, isPublicRoute } from "@/lib/auth/public-routes";
import type { EnvReaderSource } from "@/lib/env/env-reader-source";
import { readRuntimeEnvSource } from "@/lib/env/env-reader-source";

export const ERP_CSP_STRATEGY_ENV = "ERP_CSP_STRATEGY" as const;

export type CspStrategy = "nonce" | "sri" | "hybrid";

export type CspPolicyMode = "nonce" | "sri";

const CSP_STRATEGY_LOOKUP: Readonly<Record<CspStrategy, true>> = {
  nonce: true,
  sri: true,
  hybrid: true,
};

function isCspStrategy(value: string): value is CspStrategy {
  return Object.hasOwn(CSP_STRATEGY_LOOKUP, value);
}

export function getCspStrategy(
  env: EnvReaderSource = readRuntimeEnvSource()
): CspStrategy {
  const raw = env[ERP_CSP_STRATEGY_ENV]?.trim().toLowerCase();

  if (raw && isCspStrategy(raw)) {
    return raw;
  }

  return "hybrid";
}

export function resolveCspPolicyMode(
  pathname: string,
  env: EnvReaderSource = readRuntimeEnvSource(),
  isDevelopment = env["NODE_ENV"] === "development"
): CspPolicyMode {
  const strategy = getCspStrategy(env);

  if (strategy === "nonce") {
    return "nonce";
  }

  // Next.js dev bootstrap requires nonce or unsafe-inline on every route.
  if (isDevelopment) {
    return "nonce";
  }

  if (strategy === "sri") {
    return "sri";
  }

  if (isDevHarnessRoute(pathname)) {
    return "nonce";
  }

  return isPublicRoute(pathname) ? "sri" : "nonce";
}

export function shouldOptIntoRequestBoundRendering(
  pathname: string,
  env: EnvReaderSource = readRuntimeEnvSource()
): boolean {
  return resolveCspPolicyMode(pathname, env) === "nonce";
}

/** Protected layouts always use nonce CSP unless the deployment opts into full SRI. */
export function requiresProtectedLayoutConnection(
  env: EnvReaderSource = readRuntimeEnvSource()
): boolean {
  return getCspStrategy(env) !== "sri";
}
