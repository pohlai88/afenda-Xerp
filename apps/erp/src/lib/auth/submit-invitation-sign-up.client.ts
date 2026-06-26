import { signUp } from "@afenda/auth/client";

export interface InvitationSignUpInput {
  readonly email: string;
  readonly invitationToken: string;
  readonly name: string;
  readonly password: string;
}

type SignUpEmailResult = Awaited<ReturnType<typeof signUp.email>>;

/**
 * Submits invitation-gated sign-up. `invitationToken` is enforced by
 * `@afenda/auth` server hooks — not typed on the Better Auth client surface.
 */
export async function submitInvitationSignUp(
  input: InvitationSignUpInput
): Promise<SignUpEmailResult> {
  return signUp.email({
    email: input.email,
    name: input.name,
    password: input.password,
    fetchOptions: {
      body: {
        invitationToken: input.invitationToken,
      },
    },
  });
}
