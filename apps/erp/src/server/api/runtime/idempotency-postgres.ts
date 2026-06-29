import {
  readApiIdempotencyRecord,
  writeApiIdempotencyRecord,
} from "@afenda/database";
import { idempotencyStoredResponseSchema } from "../contracts/idempotency.contract";
import type { IdempotencyStore } from "./idempotency";

export function createPostgresIdempotencyStore(): IdempotencyStore {
  return {
    async get(scopeKey: string) {
      const stored = await readApiIdempotencyRecord(scopeKey);
      if (stored === null) {
        return null;
      }

      return idempotencyStoredResponseSchema.parse(stored);
    },
    async set(scopeKey: string, value) {
      const parsed = idempotencyStoredResponseSchema.parse(value);
      await writeApiIdempotencyRecord({
        data: parsed.data,
        scopeKey,
        statusCode: parsed.statusCode,
      });
    },
  };
}
