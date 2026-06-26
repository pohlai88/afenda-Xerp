import { authClient } from "@afenda/auth/client";

export interface PasswordResetSubmitInput {
  readonly newPassword: string;
  readonly token: string;
}

type PasswordResetSubmitResult = Awaited<
  ReturnType<typeof authClient.resetPassword>
>;

/** Completes password reset using token from email redirect query params. */
export async function submitPasswordReset(
  input: PasswordResetSubmitInput
): Promise<PasswordResetSubmitResult> {
  return authClient.resetPassword({
    newPassword: input.newPassword,
    token: input.token.trim(),
  });
}
