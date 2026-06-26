import { Resend } from "resend";

import {
  AuthEmailDeliveryError,
  type AuthEmailResendClient,
  type SendAuthEmailViaResendInput,
} from "./auth.email.contract.js";

/** @internal Adapts the Resend SDK to the package-owned send seam. */
export function createAuthResendClient(apiKey: string): AuthEmailResendClient {
  const resend = new Resend(apiKey);

  return {
    emails: {
      async send(payload) {
        const { data, error } = await resend.emails.send({
          from: payload.from,
          to: [...payload.to],
          subject: payload.subject,
          html: payload.html,
          ...(payload.text === undefined ? {} : { text: payload.text }),
          ...(payload.tags === undefined ? {} : { tags: [...payload.tags] }),
          ...(payload.idempotencyKey === undefined
            ? {}
            : { idempotencyKey: payload.idempotencyKey }),
        });

        return { data, error };
      },
    },
  };
}

/** Sends one transactional auth email through the official Resend SDK. */
export async function sendAuthEmailViaResend(
  input: SendAuthEmailViaResendInput
): Promise<{ readonly messageId: string }> {
  const resend = input.client ?? createAuthResendClient(input.apiKey);

  const tags =
    input.tags === undefined
      ? undefined
      : Object.entries(input.tags).map(([name, value]) => ({ name, value }));

  const { data, error } = await resend.emails.send({
    from: input.from,
    to: [input.message.to],
    subject: input.message.subject,
    html: input.message.html,
    ...(input.message.text === undefined ? {} : { text: input.message.text }),
    ...(tags === undefined ? {} : { tags }),
    ...(input.idempotencyKey === undefined
      ? {}
      : { idempotencyKey: input.idempotencyKey }),
  });

  if (error) {
    throw new AuthEmailDeliveryError(
      `Resend API error: ${error.name ?? "Error"} — ${error.message}`
    );
  }

  const messageId = data?.id;

  if (!messageId) {
    throw new AuthEmailDeliveryError("Resend API returned no message id.");
  }

  return { messageId };
}
