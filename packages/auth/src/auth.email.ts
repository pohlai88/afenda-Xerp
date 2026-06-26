import type { AuthEventContext } from "./auth.contract.js";
import type {
  AuthEmailDeliveryDeps,
  AuthEmailDeliveryResult,
  AuthInvitationEmailDeliveryInput,
  AuthInvitationEmailPayload,
  AuthPasswordResetEmailPayload,
  AuthTransactionalEmailDeliveryMetadata,
  AuthTransactionalEmailMessage,
  AuthTwoFactorOtpEmailPayload,
  AuthVerificationEmailPayload,
} from "./auth.email.contract.js";
import { sendAuthEmailViaResend } from "./auth.email.resend.js";
import {
  getAuthEmailApiKey,
  getAuthEmailFromAddress,
  isAuthEmailDeliveryEnabled,
  resolveBetterAuthBaseUrl,
} from "./auth.env.js";
import {
  renderAuthInvitationEmailMessage,
  renderAuthPasswordResetEmailMessage,
  renderAuthTwoFactorOtpEmailMessage,
  renderAuthVerificationEmailMessage,
  resolveAuthEmailDisplayName,
} from "./emails/render.js";

export type {
  AuthEmailDeliveryDeps,
  AuthEmailDeliveryResult,
  AuthEmailResendClient,
  AuthEmailUser,
  AuthInvitationEmailDeliveryInput,
  AuthInvitationEmailPayload,
  AuthInvitationEmailUser,
  AuthPasswordResetEmailPayload,
  AuthTransactionalEmailDeliveryMetadata,
  AuthTransactionalEmailKind,
  AuthTransactionalEmailMessage,
  AuthTwoFactorOtpEmailPayload,
  AuthVerificationEmailPayload,
} from "./auth.email.contract.js";
export {
  AuthEmailDeliveryError,
  isAuthEmailDeliveryError,
} from "./auth.email.contract.js";

export function buildAuthInvitationSignUpUrl(
  payload: Pick<AuthInvitationEmailPayload, "token" | "user">,
  env: NodeJS.ProcessEnv = process.env
): string {
  const baseUrl = resolveBetterAuthBaseUrl(env);
  const encodedEmail = encodeURIComponent(payload.user.email);
  return `${baseUrl}/invite/accept?invitationToken=${payload.token}&email=${encodedEmail}`;
}

export async function buildAuthInvitationEmailMessage(
  payload: AuthInvitationEmailPayload,
  env: NodeJS.ProcessEnv = process.env
): Promise<AuthTransactionalEmailMessage> {
  const url = buildAuthInvitationSignUpUrl(payload, env);
  const name = resolveAuthEmailDisplayName(
    payload.user.email,
    payload.user.name
  );

  return renderAuthInvitationEmailMessage({
    to: payload.user.email,
    subject: "You are invited to Afenda ERP",
    name,
    url,
  });
}

export function buildAuthInvitationEmailTags(
  audit?: AuthEventContext
): Record<string, string> | undefined {
  if (!audit) {
    return;
  }

  const tags: Record<string, string> = {
    email_kind: "invite",
  };

  if (audit.correlationId !== undefined) {
    tags["correlation_id"] = audit.correlationId;
  }

  const tenantId = audit.tenantId;

  if (tenantId !== undefined) {
    tags["tenant_id"] = tenantId;
  }

  return tags;
}

export async function buildAuthVerificationEmailMessage(
  payload: AuthVerificationEmailPayload
): Promise<AuthTransactionalEmailMessage> {
  const name = resolveAuthEmailDisplayName(
    payload.user.email,
    payload.user.name
  );

  return renderAuthVerificationEmailMessage({
    to: payload.user.email,
    subject: "Verify your Afenda ERP email",
    name,
    url: payload.url,
  });
}

export async function buildAuthPasswordResetEmailMessage(
  payload: AuthPasswordResetEmailPayload
): Promise<AuthTransactionalEmailMessage> {
  const name = resolveAuthEmailDisplayName(
    payload.user.email,
    payload.user.name
  );

  return renderAuthPasswordResetEmailMessage({
    to: payload.user.email,
    subject: "Reset your Afenda ERP password",
    name,
    url: payload.url,
  });
}

export async function buildAuthTwoFactorOtpEmailMessage(
  payload: AuthTwoFactorOtpEmailPayload
): Promise<AuthTransactionalEmailMessage> {
  const name = resolveAuthEmailDisplayName(
    payload.user.email,
    payload.user.name
  );

  return renderAuthTwoFactorOtpEmailMessage({
    to: payload.user.email,
    subject: "Your Afenda ERP sign-in code",
    name,
    otp: payload.otp,
  });
}

/** Env-gated Resend delivery — no-op when API key or from-address is unset (dev-safe). */
export async function deliverAuthTransactionalEmail(
  message: AuthTransactionalEmailMessage,
  env: NodeJS.ProcessEnv = process.env,
  deps: AuthEmailDeliveryDeps = {},
  metadata?: AuthTransactionalEmailDeliveryMetadata
): Promise<AuthEmailDeliveryResult> {
  if (!isAuthEmailDeliveryEnabled(env)) {
    return { delivered: false, reason: "email_delivery_disabled" };
  }

  const apiKey = getAuthEmailApiKey(env);
  const from = getAuthEmailFromAddress(env);

  if (!(apiKey && from)) {
    return { delivered: false, reason: "email_not_configured" };
  }

  const { messageId } = await sendAuthEmailViaResend({
    apiKey,
    from,
    message,
    ...(deps.client === undefined ? {} : { client: deps.client }),
    ...(metadata?.idempotencyKey === undefined
      ? {}
      : { idempotencyKey: metadata.idempotencyKey }),
    ...(metadata?.tags === undefined ? {} : { tags: metadata.tags }),
  });

  return { delivered: true, messageId };
}

/** Delivers an invitation email with idempotency and correlation tags when audit context is present. */
export async function deliverAuthInvitationEmail(
  invitation: AuthInvitationEmailDeliveryInput,
  env: NodeJS.ProcessEnv = process.env,
  deps: AuthEmailDeliveryDeps = {},
  audit?: AuthEventContext
): Promise<AuthEmailDeliveryResult> {
  const tags = buildAuthInvitationEmailTags(audit);

  return deliverAuthTransactionalEmail(
    await buildAuthInvitationEmailMessage(
      {
        token: invitation.token,
        user: { email: invitation.email },
        invitationId: invitation.invitationId,
        ...(invitation.tenantId === undefined
          ? {}
          : { tenantId: invitation.tenantId }),
      },
      env
    ),
    env,
    deps,
    {
      emailKind: "invite",
      idempotencyKey: `auth/invite/${invitation.invitationId}`,
      ...(tags === undefined ? {} : { tags }),
    }
  );
}

export function createAuthVerificationEmailSender(
  env: NodeJS.ProcessEnv = process.env,
  deps: AuthEmailDeliveryDeps = {}
) {
  return async (
    payload: AuthVerificationEmailPayload,
    _request?: Request
  ): Promise<void> => {
    await deliverAuthTransactionalEmail(
      await buildAuthVerificationEmailMessage(payload),
      env,
      deps,
      {
        emailKind: "verify",
        idempotencyKey: `auth/verify/${payload.token}`,
        tags: { email_kind: "verify" },
      }
    );
  };
}

export function createAuthPasswordResetEmailSender(
  env: NodeJS.ProcessEnv = process.env,
  deps: AuthEmailDeliveryDeps = {}
) {
  return async (
    payload: AuthPasswordResetEmailPayload,
    _request?: Request
  ): Promise<void> => {
    await deliverAuthTransactionalEmail(
      await buildAuthPasswordResetEmailMessage(payload),
      env,
      deps,
      {
        emailKind: "reset",
        idempotencyKey: `auth/reset/${payload.token}`,
        tags: { email_kind: "reset" },
      }
    );
  };
}

/** Better Auth twoFactor `otpOptions.sendOTP` — Resend-backed when email is configured. */
export function createAuthTwoFactorOtpSender(
  env: NodeJS.ProcessEnv = process.env,
  deps: AuthEmailDeliveryDeps = {}
) {
  return async (payload: AuthTwoFactorOtpEmailPayload): Promise<void> => {
    await deliverAuthTransactionalEmail(
      await buildAuthTwoFactorOtpEmailMessage(payload),
      env,
      deps,
      {
        emailKind: "two-factor-otp",
        idempotencyKey: `auth/two-factor-otp/${payload.user.id}/${payload.otp}`,
        tags: { email_kind: "two-factor-otp" },
      }
    );
  };
}
