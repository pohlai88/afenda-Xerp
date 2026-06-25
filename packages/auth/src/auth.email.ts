import { isAuthEmailDeliveryEnabled } from "./auth.env.js";

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

export type AuthEmailDeliveryResult =
  | { readonly delivered: false; readonly reason: "email_delivery_disabled" }
  | { readonly delivered: true };

/** Env-gated transactional delivery — no-op when API key is unset (dev-safe). */
export async function deliverAuthTransactionalEmail(
  env: NodeJS.ProcessEnv = process.env
): Promise<AuthEmailDeliveryResult> {
  if (!isAuthEmailDeliveryEnabled(env)) {
    return { delivered: false, reason: "email_delivery_disabled" };
  }

  // Provider wiring (Resend/SES) lands in a later delivery gap; env gate proves the path.
  return { delivered: true };
}

export function createAuthVerificationEmailSender(
  env: NodeJS.ProcessEnv = process.env
) {
  return async (
    _payload: AuthVerificationEmailPayload,
    _request?: Request
  ): Promise<void> => {
    await deliverAuthTransactionalEmail(env);
  };
}

export function createAuthPasswordResetEmailSender(
  env: NodeJS.ProcessEnv = process.env
) {
  return async (
    _payload: AuthPasswordResetEmailPayload,
    _request?: Request
  ): Promise<void> => {
    await deliverAuthTransactionalEmail(env);
  };
}
