/** @afenda/auth — Better Auth foundation (TIP-004). */
export const PACKAGE_NAME = "@afenda/auth" as const;

// biome-ignore lint/performance/noBarrelFile: package public API entry point
export {
  type AuthAuditInsertPayload,
  type AuthAuditRecordInput,
  type AuthAuditResult,
  type AuthAuditWriter,
  buildAuthAuditPayload,
  createDatabaseAuthAuditWriter,
  recordAuthAuditEvent,
} from "./auth.audit.js";
export { type AfendaAuth, createAuthConfig } from "./auth.config.js";
export {
  BETTER_AUTH_SECRET_ENV,
  BETTER_AUTH_URL_ENV,
  getBetterAuthSecret,
  getBetterAuthUrl,
  hasBetterAuthConfig,
  MissingBetterAuthSecretError,
  MissingBetterAuthUrlError,
} from "./auth.env.js";
export {
  AUTH_EVENT,
  type AuthEventContext,
  type AuthEventName,
  createAuthCorrelationId,
} from "./auth.events.js";
export {
  getAfendaAuthSession,
  getAuth,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "./auth.server.js";
export {
  AFENDA_AUTH_EXTENSION_POINTS,
  type AfendaAuthExtensionPoints,
  type AfendaAuthIdentity,
  type AfendaAuthSession,
  type AfendaAuthSessionMetadata,
  type AfendaAuthUser,
  type BetterAuthSessionLike,
  isUnauthenticatedError,
  normalizeAfendaAuthSession,
  toAfendaAuthIdentity,
  UnauthenticatedError,
} from "./auth.types.js";

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
