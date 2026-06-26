import { authClient } from "@afenda/auth/client";

export interface PasswordResetRequestInput {
  readonly email: string;
}

type PasswordResetRequestResult = Awaited<
  ReturnType<typeof authClient.requestPasswordReset>
>;

/** Requests a password reset email with ERP reset page as redirect target. */
export async function submitPasswordResetRequest(
  input: PasswordResetRequestInput
): Promise<PasswordResetRequestResult> {
  return authClient.requestPasswordReset({
    email: input.email.trim(),
    redirectTo: "/reset-password",
  });
}
