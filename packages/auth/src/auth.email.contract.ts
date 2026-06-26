/** Serializable outbound auth email — safe for audit/logging (no secrets). */
export interface AuthTransactionalEmailMessage {
  readonly html: string;
  readonly subject: string;
  readonly text?: string;
  readonly to: string;
}

export interface AuthEmailUser {
  readonly email: string;
  readonly id: string;
  readonly name: string;
}

export interface AuthVerificationEmailPayload {
  readonly token: string;
  readonly url: string;
  readonly user: AuthEmailUser;
}

export interface AuthPasswordResetEmailPayload {
  readonly token: string;
  readonly url: string;
  readonly user: AuthEmailUser;
}

export interface AuthInvitationEmailUser {
  readonly email: string;
  readonly name?: string;
}

export interface AuthInvitationEmailPayload {
  readonly invitationId?: string;
  readonly tenantId?: string;
  readonly token: string;
  readonly user: AuthInvitationEmailUser;
}

export type AuthTransactionalEmailKind =
  | "invite"
  | "reset"
  | "two-factor-otp"
  | "verify";

export interface AuthTwoFactorOtpEmailPayload {
  readonly otp: string;
  readonly user: AuthEmailUser;
}

export interface AuthTransactionalEmailDeliveryMetadata {
  readonly emailKind: AuthTransactionalEmailKind;
  readonly idempotencyKey?: string;
  readonly tags?: Readonly<Record<string, string>>;
}

export type AuthEmailDeliveryResult =
  | {
      readonly delivered: false;
      readonly reason: "email_delivery_disabled" | "email_not_configured";
    }
  | { readonly delivered: true; readonly messageId: string };

export interface AuthInvitationEmailDeliveryInput {
  readonly email: string;
  readonly invitationId: string;
  readonly tenantId?: string;
  readonly token: string;
}

/** Minimal Resend send seam — public contract stays free of `resend` package types. */
export interface AuthEmailResendSendPayload {
  readonly from: string;
  readonly html: string;
  readonly idempotencyKey?: string;
  readonly subject: string;
  readonly tags?: readonly { readonly name: string; readonly value: string }[];
  readonly text?: string;
  readonly to: readonly string[];
}

export interface AuthEmailResendSendResponse {
  readonly data: { readonly id?: string } | null;
  readonly error: { readonly message: string; readonly name?: string } | null;
}

export interface AuthEmailResendClient {
  readonly emails: {
    send(
      payload: AuthEmailResendSendPayload
    ): Promise<AuthEmailResendSendResponse>;
  };
}

export interface AuthEmailDeliveryDeps {
  readonly client?: AuthEmailResendClient;
}

export interface SendAuthEmailViaResendInput {
  readonly apiKey: string;
  readonly client?: AuthEmailResendClient;
  readonly from: string;
  readonly idempotencyKey?: string;
  readonly message: AuthTransactionalEmailMessage;
  readonly tags?: Readonly<Record<string, string>>;
}

export class AuthEmailDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthEmailDeliveryError";
  }
}

export function isAuthEmailDeliveryError(
  error: unknown
): error is AuthEmailDeliveryError {
  return error instanceof AuthEmailDeliveryError;
}
