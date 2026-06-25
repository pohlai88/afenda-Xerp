/** @afenda/auth — Better Auth foundation (TIP-004). */
export const PACKAGE_NAME = "@afenda/auth" as const;

export {
  type AuthAuditInsertPayload,
  buildAuthAuditPayload,
  persistAuthAuditEvent,
} from "./auth.audit.js";
export type { AfendaAuthDeviceSession } from "./auth.client.contract.js";
export {
  isAfendaAuthDeviceSession,
  parseAfendaAuthDeviceSessions,
  readAfendaAuthSessionTwoFactorEnabled,
} from "./auth.client.contract.js";
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
  AUTH_CHANGE_EMAIL_ENABLED,
  getBetterAuthSecret,
  getBetterAuthUrl,
  hasBetterAuthConfig,
  isAuthChangeEmailEnabled,
  isAuthEmailDeliveryEnabled,
} from "./auth.env.js";
export {
  BETTER_AUTH_SECRET_ENV,
  BETTER_AUTH_URL_ENV,
  isMfaPolicyBypassBlockedError,
  isUnauthenticatedError,
  isUnlinkedPlatformUserError,
  MfaPolicyBypassBlockedError,
  MissingBetterAuthSecretError,
  MissingBetterAuthUrlError,
  UnauthenticatedError,
  UnlinkedPlatformUserError,
} from "./auth.errors.js";
export {
  createAfendaAuthInvitationBeforeHook,
  handleAfendaAuthInvitationBeforeHook,
} from "./auth.hooks.js";
export {
  type AuthInvitationRecord,
  AuthInvitationRejectedError,
  consumeAuthInvitation,
  isAuthInvitationGateEnabled,
  listPendingAuthInvitationsForTenant,
  type RegisterAuthInvitationInput,
  readInvitationTokenFromBody,
  registerAuthInvitation,
  resendAuthInvitationById,
  resetAuthInvitationStoreForTests,
  revokeAuthInvitation,
  revokeAuthInvitationById,
  type ValidateAuthInvitationInput,
  type ValidateAuthInvitationResult,
  validateAuthInvitation,
} from "./auth.invitation.js";
export {
  type AssertTenantMfaPolicyInput,
  assertTenantMfaPolicySatisfied,
  getTenantMfaPolicy,
  isAuthUserMfaEnabled,
  type TenantMfaPolicy,
  type TenantMfaPolicyDeps,
  type UpdateTenantMfaPolicyInput,
  updateTenantMfaPolicy,
} from "./auth.mfa-policy.js";
export {
  AFENDA_PLATFORM_MIRROR_PROVIDER_ID,
  AuthMirrorSyncConflictError,
  type SyncAuthMirrorUserInput,
  type SyncAuthMirrorUserOptions,
  type SyncAuthMirrorUserResult,
  syncAuthMirrorUser,
} from "./auth.mirror-sync.js";
export {
  getAfendaAuthSession,
  getAuth,
  type RequireAfendaAuthSessionOptions,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "./auth.server.js";
export {
  type BetterAuthSessionLike,
  isAfendaAuthSessionLinked,
  normalizeAfendaAuthSession,
  resolveActiveWorkspaceId,
  toAfendaAuthIdentity,
} from "./auth.session.js";
export {
  AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX,
  AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX,
  AuthSsoInvitationRejectedError,
  assertSsoSignUpInvitationAllowed,
  createAfendaSsoPluginOptions,
  isAfendaAuthSsoCallbackPath,
} from "./auth.sso-policy.js";
export {
  describeSyncTenantSsoProviderSkipReason,
  type SyncTenantSsoProviderInput,
  type SyncTenantSsoProviderResult,
  type SyncTenantSsoProviderSkipReason,
  syncTenantSsoProviderWithBetterAuth,
} from "./auth.sso-sync.js";
export {
  type PersistAuthSessionActiveWorkspaceIdInput,
  persistAuthSessionActiveWorkspaceId,
} from "./auth.workspace-session.js";
export {
  assertDevAuthBootstrapAllowed,
  hasDevViewerLoginCredentials,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
  resolveDevViewerLoginPassword,
} from "./bootstrap/dev-login.env.js";
export {
  DEV_AUTH_CREDENTIAL_PROVIDER_ID,
  DEV_LOGIN_DISPLAY_NAME,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_EMAIL_ENV,
  DEV_LOGIN_PASSWORD_ENV,
  DEV_VIEWER_LOGIN_DISPLAY_NAME,
  DEV_VIEWER_LOGIN_EMAIL,
  DEV_VIEWER_LOGIN_PASSWORD_ENV,
} from "./bootstrap/dev-login.fixture.js";
export {
  type EnsureDevAuthLoginResult,
  ensureDevAuthLogin,
  MissingPlatformUserError,
} from "./bootstrap/ensure-dev-auth-login.js";

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
