/** @afenda/auth — Better Auth foundation (TIP-004). */
export const PACKAGE_NAME = "@afenda/auth" as const;

export {
  type AuthAuditInsertPayload,
  buildAuthAuditPayload,
} from "./auth.audit.js";
export {
  type AfendaAuth,
  type CreateAuthOptions,
  createAuthConfig,
} from "./auth.config.js";
export {
  AFENDA_AUTH_EXTENSION_POINTS,
  type AfendaAuthExtensionPoints,
  type AfendaAuthIdentity,
  type AfendaAuthSession,
  type AfendaAuthSessionMetadata,
  type AfendaAuthUser,
  AUTH_EVENT,
  type AuthActorLinkStatus,
  type AuthAuditRecordInput,
  type AuthAuditResult,
  type AuthEventContext,
  type AuthEventName,
} from "./auth.contract.js";
export {
  getBetterAuthSecret,
  getBetterAuthUrl,
  hasBetterAuthConfig,
} from "./auth.env.js";
export {
  BETTER_AUTH_SECRET_ENV,
  BETTER_AUTH_URL_ENV,
  isUnauthenticatedError,
  isUnlinkedPlatformUserError,
  MissingBetterAuthSecretError,
  MissingBetterAuthUrlError,
  UnauthenticatedError,
  UnlinkedPlatformUserError,
} from "./auth.errors.js";
export {
  getAfendaAuthSession,
  getAuth,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "./auth.server.js";
export {
  isAfendaAuthSessionLinked,
  normalizeAfendaAuthSession,
  toAfendaAuthIdentity,
} from "./auth.session.js";
export {
  assertDevAuthBootstrapAllowed,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
} from "./bootstrap/dev-login.env.js";
export {
  DEV_AUTH_CREDENTIAL_PROVIDER_ID,
  DEV_LOGIN_DISPLAY_NAME,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_EMAIL_ENV,
  DEV_LOGIN_PASSWORD_ENV,
} from "./bootstrap/dev-login.fixture.js";
export {
  type EnsureDevAuthLoginResult,
  ensureDevAuthLogin,
  MissingPlatformUserError,
} from "./bootstrap/ensure-dev-auth-login.js";

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
