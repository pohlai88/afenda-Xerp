import {
  DEV_AUTH_BOOTSTRAP_CONFIRM_ENV,
  DEV_AUTH_BOOTSTRAP_CONFIRM_VALUE,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_EMAIL_ENV,
  DEV_LOGIN_PASSWORD_ENV,
  DEV_VIEWER_LOGIN_PASSWORD_ENV,
  MIN_DEV_LOGIN_PASSWORD_LENGTH,
} from "./dev-login.fixture.js";

export class DevAuthBootstrapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DevAuthBootstrapError";
  }
}

export function isProductionLikeRuntime(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const nodeEnv = env["NODE_ENV"]?.trim().toLowerCase();
  const vercelEnv = env["VERCEL_ENV"]?.trim().toLowerCase();
  const afendaEnv = env["AFENDA_ENV"]?.trim().toLowerCase();

  return (
    nodeEnv === "production" ||
    vercelEnv === "production" ||
    afendaEnv === "production"
  );
}

export function assertDevAuthBootstrapAllowed(
  env: NodeJS.ProcessEnv = process.env
): void {
  if (!isProductionLikeRuntime(env)) {
    return;
  }

  if (
    env[DEV_AUTH_BOOTSTRAP_CONFIRM_ENV]?.trim().toLowerCase() !==
    DEV_AUTH_BOOTSTRAP_CONFIRM_VALUE
  ) {
    throw new DevAuthBootstrapError(
      `Dev auth bootstrap is blocked in production. Set ${DEV_AUTH_BOOTSTRAP_CONFIRM_ENV}=${DEV_AUTH_BOOTSTRAP_CONFIRM_VALUE} to override.`
    );
  }
}

export function resolveDevLoginEmail(
  env: NodeJS.ProcessEnv = process.env
): string {
  const configured = env[DEV_LOGIN_EMAIL_ENV]?.trim();
  return configured && configured.length > 0 ? configured : DEV_LOGIN_EMAIL;
}

export function resolveDevLoginPassword(
  env: NodeJS.ProcessEnv = process.env
): string {
  const password = env[DEV_LOGIN_PASSWORD_ENV]?.trim();

  if (!password || password.length < MIN_DEV_LOGIN_PASSWORD_LENGTH) {
    throw new DevAuthBootstrapError(
      `${DEV_LOGIN_PASSWORD_ENV} is required (minimum ${MIN_DEV_LOGIN_PASSWORD_LENGTH} characters). Add it to .env.secret and run pnpm env:sync.`
    );
  }

  return password;
}

function deriveDevViewerLoginPassword(adminPassword: string): string {
  return `${adminPassword}-viewer`;
}

export function resolveDevViewerLoginPassword(
  env: NodeJS.ProcessEnv = process.env
): string {
  const explicit = env[DEV_VIEWER_LOGIN_PASSWORD_ENV]?.trim();
  if (explicit && explicit.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH) {
    return explicit;
  }

  return deriveDevViewerLoginPassword(resolveDevLoginPassword(env));
}

export function hasDevViewerLoginCredentials(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const explicit = env[DEV_VIEWER_LOGIN_PASSWORD_ENV]?.trim();
  if (explicit && explicit.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH) {
    return true;
  }

  const adminPassword = env[DEV_LOGIN_PASSWORD_ENV]?.trim();
  return Boolean(
    adminPassword && adminPassword.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH
  );
}
