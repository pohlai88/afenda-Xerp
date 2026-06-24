/** @typedef {{ email: string; password: string }} E2EDevLoginCredentials */

const DEV_LOGIN_EMAIL = "dev-admin@localhost.afenda";
const DEV_LOGIN_EMAIL_ENV = "AFENDA_DEV_LOGIN_EMAIL";
const DEV_LOGIN_PASSWORD_ENV = "AFENDA_DEV_LOGIN_PASSWORD";
const DEV_VIEWER_LOGIN_EMAIL = "dev-viewer@localhost.afenda";
const DEV_VIEWER_LOGIN_PASSWORD_ENV = "AFENDA_E2E_VIEWER_LOGIN_PASSWORD";
const MIN_DEV_LOGIN_PASSWORD_LENGTH = 8;

/** @param {NodeJS.ProcessEnv} [env] */
function resolveAdminPassword(env = process.env) {
  const password = env[DEV_LOGIN_PASSWORD_ENV]?.trim();
  if (!password || password.length < MIN_DEV_LOGIN_PASSWORD_LENGTH) {
    return null;
  }
  return password;
}

export function hasE2EDevLoginCredentials() {
  return resolveAdminPassword() !== null;
}

export function resolveE2EDevLoginCredentials() {
  const password = resolveAdminPassword();
  if (!password) {
    throw new Error(
      `${DEV_LOGIN_PASSWORD_ENV} is required (minimum ${MIN_DEV_LOGIN_PASSWORD_LENGTH} characters). Add it to .env.secret and run pnpm env:sync.`
    );
  }

  const configuredEmail = process.env[DEV_LOGIN_EMAIL_ENV]?.trim();
  return {
    email:
      configuredEmail && configuredEmail.length > 0
        ? configuredEmail
        : DEV_LOGIN_EMAIL,
    password,
  };
}

export function hasE2EViewerLoginCredentials() {
  const explicit = process.env[DEV_VIEWER_LOGIN_PASSWORD_ENV]?.trim();
  if (explicit && explicit.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH) {
    return true;
  }
  return resolveAdminPassword() !== null;
}

export function resolveE2EViewerLoginCredentials() {
  const explicit = process.env[DEV_VIEWER_LOGIN_PASSWORD_ENV]?.trim();
  const adminPassword = resolveAdminPassword();
  if (!adminPassword) {
    throw new Error(
      `${DEV_LOGIN_PASSWORD_ENV} is required (minimum ${MIN_DEV_LOGIN_PASSWORD_LENGTH} characters). Add it to .env.secret and run pnpm env:sync.`
    );
  }

  const password =
    explicit && explicit.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH
      ? explicit
      : `${adminPassword}-viewer`;

  return {
    email: DEV_VIEWER_LOGIN_EMAIL,
    password,
  };
}

/** @param {import('@playwright/test').Page} page @param {E2EDevLoginCredentials} credentials */
export async function signInWithEmailPassword(page, credentials) {
  const signInResponse = await page.request.post("/api/auth/sign-in/email", {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  if (!signInResponse.ok()) {
    throw new Error(
      `Sign-in failed for ${credentials.email}: HTTP ${signInResponse.status()}`
    );
  }
}

export const E2E_DEV_FIXTURE_ANNOTATION = {
  type: "fixture",
  description:
    "Requires pnpm db:bootstrap:local && pnpm auth:bootstrap:dev (viewer defaults to AFENDA_DEV_LOGIN_PASSWORD-viewer)",
};
