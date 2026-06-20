import type { BootstrapProfile, SeedProfile } from "./seed-types.js";

export class SeedSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SeedSafetyError";
  }
}

export class BootstrapSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BootstrapSafetyError";
  }
}

const UNSAFE_SEED_PROFILES = new Set<SeedProfile>([
  "demo",
  "dev",
  "preview",
  "test",
]);

const CONFIRM_ENV = "AFENDA_SEED_CONFIRM";
const BOOTSTRAP_CONFIRM_ENV = "AFENDA_BOOTSTRAP_CONFIRM";
const CONFIRM_VALUE = "yes";

/** Detects production-like runtime where unsafe seeds must be blocked. */
export function isProductionEnvironment(): boolean {
  const nodeEnv = process.env['NODE_ENV']?.trim().toLowerCase();
  const vercelEnv = process.env['VERCEL_ENV']?.trim().toLowerCase();
  const afendaEnv = process.env['AFENDA_ENV']?.trim().toLowerCase();

  return (
    nodeEnv === "production" ||
    vercelEnv === "production" ||
    afendaEnv === "production"
  );
}

function hasExplicitConfirmation(envKey: string): boolean {
  return process.env[envKey]?.trim().toLowerCase() === CONFIRM_VALUE;
}

/**
 * Blocks demo/dev/test seeds in production unless explicitly confirmed.
 * Platform seed may run in production only with `AFENDA_SEED_CONFIRM=yes`.
 */
export function assertSeedProfileAllowed(profile: SeedProfile): void {
  if (!isProductionEnvironment()) {
    return;
  }

  if (UNSAFE_SEED_PROFILES.has(profile)) {
    throw new SeedSafetyError(
      `Seed profile "${profile}" is blocked in production. Use platform seed only with explicit confirmation.`
    );
  }

  if (profile === "platform" && !hasExplicitConfirmation(CONFIRM_ENV)) {
    throw new SeedSafetyError(
      `Production platform seed requires ${CONFIRM_ENV}=${CONFIRM_VALUE}.`
    );
  }
}

/** Bootstrap never runs implicitly — production requires explicit confirmation. */
export function assertBootstrapAllowed(profile: BootstrapProfile): void {
  if (!isProductionEnvironment()) {
    return;
  }

  if (!hasExplicitConfirmation(BOOTSTRAP_CONFIRM_ENV)) {
    throw new BootstrapSafetyError(
      `Production bootstrap (${profile}) requires ${BOOTSTRAP_CONFIRM_ENV}=${CONFIRM_VALUE}.`
    );
  }
}
