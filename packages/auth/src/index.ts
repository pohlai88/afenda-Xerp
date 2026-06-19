/** @afenda/auth — Better Auth foundation (TIP-004). */
export const PACKAGE_NAME = "@afenda/auth" as const;

// biome-ignore lint/performance/noBarrelFile: package public API entry point
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
  MissingBetterAuthSecretError,
  MissingBetterAuthUrlError,
  UnauthenticatedError,
} from "./auth.errors.js";
export {
  getAfendaAuthSession,
  getAuth,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "./auth.server.js";
export {
  normalizeAfendaAuthSession,
  toAfendaAuthIdentity,
} from "./auth.session.js";

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
