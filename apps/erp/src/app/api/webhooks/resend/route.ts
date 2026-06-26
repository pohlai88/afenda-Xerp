export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {
  getResendWebhookSecret,
  handleResendWebhookEvent,
  parseResendWebhookEvent,
  type ResendWebhookHeaders,
  ResendWebhookVerificationError,
  verifyResendWebhookSignature,
} from "@afenda/auth";

function readResendWebhookHeaders(request: Request): ResendWebhookHeaders {
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  return {
    ...(svixId ? { "svix-id": svixId } : {}),
    ...(svixTimestamp ? { "svix-timestamp": svixTimestamp } : {}),
    ...(svixSignature ? { "svix-signature": svixSignature } : {}),
  };
}

export async function POST(request: Request): Promise<Response> {
  const secret = getResendWebhookSecret();

  if (!secret) {
    return Response.json(
      { error: "Resend webhook is not configured." },
      { status: 503 }
    );
  }

  const payload = await request.text();

  try {
    verifyResendWebhookSignature(
      payload,
      readResendWebhookHeaders(request),
      secret
    );
    const event = parseResendWebhookEvent(payload);
    await handleResendWebhookEvent(event);
  } catch (error: unknown) {
    if (error instanceof ResendWebhookVerificationError) {
      return Response.json({ error: error.message }, { status: 401 });
    }

    throw error;
  }

  return Response.json({ received: true });
}
