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
  type AuthEmailDeliveryDeps,
  AuthEmailDeliveryError,
  type AuthEmailDeliveryResult,
  type AuthEmailResendClient,
  type AuthEmailUser,
  type AuthInvitationEmailDeliveryInput,
  type AuthInvitationEmailPayload,
  type AuthInvitationEmailUser,
  type AuthPasswordResetEmailPayload,
  type AuthTransactionalEmailDeliveryMetadata,
  type AuthTransactionalEmailKind,
  type AuthTransactionalEmailMessage,
  type AuthVerificationEmailPayload,
  buildAuthInvitationEmailMessage,
  buildAuthInvitationEmailTags,
  buildAuthInvitationSignUpUrl,
  buildAuthPasswordResetEmailMessage,
  buildAuthVerificationEmailMessage,
  createAuthPasswordResetEmailSender,
  createAuthVerificationEmailSender,
  deliverAuthInvitationEmail,
  deliverAuthTransactionalEmail,
  isAuthEmailDeliveryError,
} from "./auth.email.js";
export {
  handleResendWebhookEvent,
  parseResendWebhookEvent,
  type ResendEmailWebhookEventData,
  type ResendWebhookEvent,
  type ResendWebhookHeaders,
  ResendWebhookVerificationError,
  verifyResendWebhookSignature,
} from "./auth.email.resend.webhook.js";
export {
  AFENDA_AUTH_EMAIL_API_KEY_ENV,
  AFENDA_AUTH_EMAIL_FROM_ENV,
  AFENDA_OAUTH_GITHUB_CLIENT_ID_ENV,
  AFENDA_OAUTH_GITHUB_CLIENT_SECRET_ENV,
  AFENDA_OAUTH_GOOGLE_CLIENT_ID_ENV,
  AFENDA_OAUTH_GOOGLE_CLIENT_SECRET_ENV,
  AFENDA_RESEND_WEBHOOK_SECRET_ENV,
  AUTH_CHANGE_EMAIL_ENABLED,
  type BetterAuthSocialProviderConfig,
  type BetterAuthSocialProvidersConfig,
  getAuthEmailApiKey,
  getAuthEmailFromAddress,
  getBetterAuthSecret,
  getBetterAuthUrl,
  getResendWebhookSecret,
  hasBetterAuthConfig,
  isAuthChangeEmailEnabled,
  isAuthEmailDeliveryEnabled,
  isAuthShellV2Default,
  RESEND_WEBHOOK_PATH,
  resolveBetterAuthBaseUrl,
  resolveBetterAuthEmailVerificationRedirectPath,
  resolveBetterAuthSocialProviders,
  resolveOAuthClientSecretFromEnv,
  resolveResendWebhookEndpoint,
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
  createAfendaAuthInvitationBeforeHook,
  handleAfendaAuthInvitationBeforeHook,
} from "./auth.hooks.js";
export {
  type AuthInvitationDeps,
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
  getEffectiveMfaPolicy,
  getTenantMfaPolicy,
  isAuthUserMfaEnabled,
  isMfaPolicyBypassBlockedError,
  MfaPolicyBypassBlockedError,
  parseCompanyIdFromActiveWorkspaceId,
  type RequireAfendaAuthSessionOptions,
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
  AFENDA_AUTH_OAUTH_CALLBACK_PREFIX,
  AFENDA_GITHUB_OAUTH_PLACEHOLDER_EMAIL_DOMAIN,
  AFENDA_GITHUB_OAUTH_SCOPES,
  AuthOAuthInvitationRejectedError,
  assertOAuthSignUpInvitationAllowed,
  createAfendaGithubSocialProviderConfig,
  createAfendaGoogleSocialProviderConfig,
  createAfendaOAuthSocialProviderOptions,
  createAfendaOAuthUserCreateBeforeHook,
  handleAfendaOAuthUserCreateBeforeHook,
  isAfendaAuthOAuthCallbackPath,
  mapAfendaGithubProfileToUser,
  readOAuthProviderIdFromCallbackPath,
  resolveTenantIdForOAuthInvitationGate,
} from "./auth.oauth-policy.js";
export {
  AFENDA_AUTH_CREDENTIAL_TWO_FACTOR_ENFORCEMENT,
  AFENDA_AUTH_PASSKEY_SIGN_IN_PATH,
  AFENDA_AUTH_PASSWORDLESS_SIGN_IN_PATH_PREFIXES,
  AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR_ENV,
  type AfendaAuthCredentialTwoFactorEnforcement,
  type AfendaAuthPasswordlessTwoFactorMode,
  isAfendaAuthPasswordlessSignInPath,
  isAfendaAuthPasswordlessTwoFactorEnforcementActive,
  resolveAfendaAuthPasswordlessTwoFactorMode,
} from "./auth.passwordless-two-factor-policy.js";
export {
  getAfendaAuthSession,
  getAuth,
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
  type RevokeAuthSessionsForPlatformUserInput,
  revokeAuthSessionsForPlatformUser,
} from "./auth.session-revoke.js";
export {
  resolveSignInProviderSurface,
  type SignInProviderSurface,
} from "./auth.sign-in-surface.js";
export {
  AFENDA_AUTH_SOCIAL_PROVIDER_IDS,
  AFENDA_OAUTH_PROVIDER_IDS,
  type AfendaAuthSocialProviderId,
  isAfendaAuthSocialProviderId,
  SIGN_IN_SOCIAL_PROVIDER_IDS,
  type SignInSocialProviderId,
} from "./auth.social-providers.js";
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
  deactivatePlatformUser,
  deactivatePlatformUserWithSessionRevoke,
} from "./auth.user-lifecycle.js";
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
