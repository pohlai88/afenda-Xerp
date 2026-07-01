import {
  readApiIdempotencyRecord,
  writeApiIdempotencyRecord,
} from "@afenda/database";
import { idempotencyStoredResponseSchema } from "../meta-contracts/idempotency.contract";
import type { IdempotencyStore } from "./idempotency";

const IDEMPOTENCY_PAYLOAD_MARKER = "__afendaIdempotencyPayload" as const;

interface PersistedIdempotencyEnvelope {
  readonly [IDEMPOTENCY_PAYLOAD_MARKER]?: {
    readonly payload: unknown;
    readonly requestFingerprint?: string;
  };
}

function isPersistedIdempotencyEnvelope(
  value: unknown
): value is PersistedIdempotencyEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    IDEMPOTENCY_PAYLOAD_MARKER in value
  );
}

function toPersistedResponseData(value: {
  readonly data: unknown;
  readonly requestFingerprint?: string;
}): unknown {
  if (value.requestFingerprint === undefined) {
    return value.data;
  }

  return {
    [IDEMPOTENCY_PAYLOAD_MARKER]: {
      payload: value.data,
      requestFingerprint: value.requestFingerprint,
    },
  } satisfies PersistedIdempotencyEnvelope;
}

function fromPersistedResponseData(value: unknown): {
  readonly data: unknown;
  readonly requestFingerprint?: string;
} {
  if (!isPersistedIdempotencyEnvelope(value)) {
    return { data: value };
  }

  const envelope = value[IDEMPOTENCY_PAYLOAD_MARKER];
  if (envelope === undefined) {
    return { data: value };
  }

  return {
    data: envelope.payload,
    ...(envelope.requestFingerprint === undefined
      ? {}
      : { requestFingerprint: envelope.requestFingerprint }),
  };
}

export function createPostgresIdempotencyStore(): IdempotencyStore {
  return {
    async get(scopeKey: string) {
      const stored = await readApiIdempotencyRecord(scopeKey);
      if (stored === null) {
        return null;
      }

      const parsed = fromPersistedResponseData(stored.data);

      return idempotencyStoredResponseSchema.parse({
        data: parsed.data,
        statusCode: stored.statusCode,
        ...(parsed.requestFingerprint === undefined
          ? {}
          : { requestFingerprint: parsed.requestFingerprint }),
      });
    },
    async set(scopeKey: string, value) {
      const parsed = idempotencyStoredResponseSchema.parse(value);
      const persistedInput =
        parsed.requestFingerprint === undefined
          ? { data: parsed.data }
          : {
              data: parsed.data,
              requestFingerprint: parsed.requestFingerprint,
            };
      await writeApiIdempotencyRecord({
        data: toPersistedResponseData(persistedInput),
        scopeKey,
        statusCode: parsed.statusCode,
      });
    },
  };
}
