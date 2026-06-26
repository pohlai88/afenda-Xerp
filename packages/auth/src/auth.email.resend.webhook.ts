import { createHmac, timingSafeEqual } from "node:crypto";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";

const SVIX_ID_HEADER = "svix-id";
const SVIX_TIMESTAMP_HEADER = "svix-timestamp";
const SVIX_SIGNATURE_HEADER = "svix-signature";
const WEBHOOK_TOLERANCE_SECONDS = 300;

export class ResendWebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResendWebhookVerificationError";
  }
}

export interface ResendWebhookHeaders {
  readonly [SVIX_ID_HEADER]?: string;
  readonly [SVIX_TIMESTAMP_HEADER]?: string;
  readonly [SVIX_SIGNATURE_HEADER]?: string;
}

export interface ResendEmailWebhookEventData {
  readonly email_id?: string;
  readonly from?: string;
  readonly subject?: string;
  readonly to?: readonly string[];
}

export interface ResendWebhookEvent {
  readonly created_at?: string;
  readonly data?: ResendEmailWebhookEventData;
  readonly type: string;
}

function decodeSvixSecret(secret: string): Buffer {
  const normalized = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  return Buffer.from(normalized, "base64");
}

function readHeader(
  headers: ResendWebhookHeaders,
  name:
    | typeof SVIX_ID_HEADER
    | typeof SVIX_TIMESTAMP_HEADER
    | typeof SVIX_SIGNATURE_HEADER
): string | undefined {
  const value = headers[name];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseWebhookTimestamp(timestamp: string): number {
  const parsed = Number.parseInt(timestamp, 10);

  if (!Number.isFinite(parsed)) {
    throw new ResendWebhookVerificationError("Invalid Svix timestamp.");
  }

  return parsed;
}

/** Verifies a Resend (Svix) webhook signature. */
export function verifyResendWebhookSignature(
  payload: string,
  headers: ResendWebhookHeaders,
  secret: string
): void {
  const svixId = readHeader(headers, SVIX_ID_HEADER);
  const svixTimestamp = readHeader(headers, SVIX_TIMESTAMP_HEADER);
  const svixSignature = readHeader(headers, SVIX_SIGNATURE_HEADER);

  if (!(svixId && svixTimestamp && svixSignature)) {
    throw new ResendWebhookVerificationError("Missing Svix webhook headers.");
  }

  const timestamp = parseWebhookTimestamp(svixTimestamp);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > WEBHOOK_TOLERANCE_SECONDS) {
    throw new ResendWebhookVerificationError(
      "Svix timestamp outside tolerance."
    );
  }

  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const key = decodeSvixSecret(secret);
  const expected = createHmac("sha256", key)
    .update(signedContent)
    .digest("base64");

  const signatures = svixSignature
    .split(" ")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => (entry.startsWith("v1,") ? entry.slice(3) : entry));

  const expectedBuffer = Buffer.from(expected);
  const verified = signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature);

    return (
      signatureBuffer.length === expectedBuffer.length &&
      timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  });

  if (!verified) {
    throw new ResendWebhookVerificationError("Invalid Svix webhook signature.");
  }
}

export function parseResendWebhookEvent(payload: string): ResendWebhookEvent {
  let parsed: unknown;

  try {
    parsed = JSON.parse(payload);
  } catch {
    throw new ResendWebhookVerificationError(
      "Webhook payload is not valid JSON."
    );
  }

  if (!isRecord(parsed) || typeof parsed["type"] !== "string") {
    throw new ResendWebhookVerificationError(
      "Webhook payload missing event type."
    );
  }

  const data = parsed["data"];

  return {
    type: parsed["type"],
    ...(typeof parsed["created_at"] === "string"
      ? { created_at: parsed["created_at"] }
      : {}),
    ...(isRecord(data)
      ? {
          data: {
            ...(typeof data["email_id"] === "string"
              ? { email_id: data["email_id"] }
              : {}),
            ...(typeof data["from"] === "string" ? { from: data["from"] } : {}),
            ...(typeof data["subject"] === "string"
              ? { subject: data["subject"] }
              : {}),
            ...(Array.isArray(data["to"])
              ? {
                  to: data["to"].filter(
                    (entry): entry is string => typeof entry === "string"
                  ),
                }
              : {}),
          },
        }
      : {}),
  };
}

/** Handles bounce/complaint webhook events with auth audit emission. */
export async function handleResendWebhookEvent(
  event: ResendWebhookEvent
): Promise<void> {
  const emailId = event.data?.email_id;
  const recipient = event.data?.to?.[0];

  if (event.type === "email.bounced") {
    await persistAuthAuditEvent({
      context: {
        correlationId: `resend-webhook-${emailId ?? crypto.randomUUID()}`,
        ...(recipient === undefined ? {} : { email: recipient }),
        ...(emailId === undefined ? {} : { messageId: emailId }),
        reason: "email.bounced",
      },
      event: AUTH_EVENT.emailDeliveryBounced,
      result: "failure",
    });
    return;
  }

  if (event.type === "email.complained") {
    await persistAuthAuditEvent({
      context: {
        correlationId: `resend-webhook-${emailId ?? crypto.randomUUID()}`,
        ...(recipient === undefined ? {} : { email: recipient }),
        ...(emailId === undefined ? {} : { messageId: emailId }),
        reason: "email.complained",
      },
      event: AUTH_EVENT.emailDeliveryComplained,
      result: "failure",
    });
  }
}
