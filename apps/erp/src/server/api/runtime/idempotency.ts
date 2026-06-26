import type { UserId } from "@afenda/kernel";
import type { ZodType } from "zod";

import type { ApiRouteContract } from "../contracts/api-contract";
import {
  IDEMPOTENCY_KEY_HEADER,
  type IdempotencyKey,
  type IdempotencyStoredResponse,
  idempotencyKeySchema,
  idempotencyStoredResponseSchema,
  requiresIdempotencyKey,
} from "../contracts/idempotency.contract";
import { ApiRouteError } from "./api-validation";
import { createPostgresIdempotencyStore } from "./idempotency-postgres";

export interface IdempotencyScope {
  readonly contractId: string;
  readonly idempotencyKey: IdempotencyKey;
  readonly tenantId: string | null;
  readonly userId: UserId | null;
}

export interface IdempotencyStore {
  get(scopeKey: string): Promise<IdempotencyStoredResponse | null>;
  set(scopeKey: string, value: IdempotencyStoredResponse): Promise<void>;
}

export function buildIdempotencyScopeKey(scope: IdempotencyScope): string {
  const tenantPart = scope.tenantId ?? "anonymous-tenant";
  const userPart = scope.userId ?? "anonymous-user";

  return [scope.contractId, tenantPart, userPart, scope.idempotencyKey].join(
    ":"
  );
}

export function createInMemoryIdempotencyStore(): IdempotencyStore {
  const records = new Map<string, IdempotencyStoredResponse>();

  return {
    get(scopeKey: string): Promise<IdempotencyStoredResponse | null> {
      return Promise.resolve(records.get(scopeKey) ?? null);
    },
    set(scopeKey: string, value: IdempotencyStoredResponse): Promise<void> {
      records.set(scopeKey, idempotencyStoredResponseSchema.parse(value));
      return Promise.resolve();
    },
  };
}

let activeIdempotencyStore: IdempotencyStore | undefined;

function resolveDefaultIdempotencyStore(): IdempotencyStore {
  if (process.env["API_IDEMPOTENCY_STORE"] === "memory") {
    return createInMemoryIdempotencyStore();
  }

  return createPostgresIdempotencyStore();
}

export function getIdempotencyStore(): IdempotencyStore {
  activeIdempotencyStore ??= resolveDefaultIdempotencyStore();
  return activeIdempotencyStore;
}

export function setIdempotencyStoreForTests(store: IdempotencyStore): void {
  activeIdempotencyStore = store;
}

export function resetIdempotencyStoreForTests(): void {
  activeIdempotencyStore = undefined;
}

export function readIdempotentResponse(
  scope: IdempotencyScope
): Promise<IdempotencyStoredResponse | null> {
  const scopeKey = buildIdempotencyScopeKey(scope);
  return getIdempotencyStore().get(scopeKey);
}

export async function recordIdempotentResponse(
  scope: IdempotencyScope,
  response: IdempotencyStoredResponse
): Promise<void> {
  const scopeKey = buildIdempotencyScopeKey(scope);
  await getIdempotencyStore().set(scopeKey, response);
}

export function resolveRequestIdempotencyKey(
  request: Request,
  policy: ApiRouteContract<unknown, unknown>["idempotency"]
): IdempotencyKey | null {
  const rawKey = request.headers.get(IDEMPOTENCY_KEY_HEADER);
  if (rawKey === null || rawKey.trim().length === 0) {
    if (requiresIdempotencyKey(policy)) {
      throw new ApiRouteError(
        "validation_failed",
        "Idempotency-Key header is required for this mutation."
      );
    }

    return null;
  }

  const parsedKey = idempotencyKeySchema.safeParse(rawKey);
  if (!parsedKey.success) {
    throw new ApiRouteError(
      "validation_failed",
      "Idempotency-Key header is invalid.",
      { issues: parsedKey.error.issues }
    );
  }

  return parsedKey.data;
}

export async function readCachedIdempotentResponse<TResponse>(input: {
  readonly contractId: string;
  readonly idempotencyKey: IdempotencyKey;
  readonly responseSchema: ZodType<TResponse>;
  readonly tenantId: string | null;
  readonly userId: UserId | null;
}): Promise<{ readonly data: TResponse; readonly statusCode: number } | null> {
  const cached = await readIdempotentResponse({
    contractId: input.contractId,
    idempotencyKey: input.idempotencyKey,
    tenantId: input.tenantId,
    userId: input.userId,
  });

  if (cached === null) {
    return null;
  }

  return {
    data: input.responseSchema.parse(cached.data),
    statusCode: cached.statusCode,
  };
}
