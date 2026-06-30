import { createTestEnterpriseId, parseUserId } from "@afenda/kernel";
import { beforeEach, describe, expect, it } from "vitest";
import {
  assertIdempotencyPolicy,
  computeIdempotencyRequestFingerprint,
  IDEMPOTENCY_KEY_HEADER,
  idempotencyKeySchema,
  readIdempotencyKeyHeader,
} from "@/server/api/contracts/idempotency.contract";
import {
  mergePaginationIntoMeta,
  paginationMetaSchema,
  paginationQuerySchema,
  parsePaginationQuery,
} from "@/server/api/contracts/pagination.contract";
import { dashboardLayoutPutContract } from "@/server/api/contracts/workspace/dashboard-layout.contract";
import {
  buildIdempotencyScopeKey,
  createInMemoryIdempotencyStore,
  readCachedIdempotentResponse,
  readIdempotentResponse,
  recordIdempotentResponse,
  resetIdempotencyStoreForTests,
  setIdempotencyStoreForTests,
} from "@/server/api/runtime/idempotency";
import { API_TEST_ACTOR_ID, API_TEST_TENANT_ID } from "./api-id-test-fixtures";

describe("idempotency contracts", () => {
  it("validates idempotency key length bounds", () => {
    expect(idempotencyKeySchema.safeParse("short").success).toBe(false);
    expect(idempotencyKeySchema.safeParse("valid-key-1").success).toBe(true);
  });

  it("reads Idempotency-Key header when present", () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        [IDEMPOTENCY_KEY_HEADER]: "retry-key-001",
      },
    });

    expect(readIdempotencyKeyHeader(request)).toBe("retry-key-001");
  });

  it("asserts idempotency policy only on mutation contracts", () => {
    expect(() =>
      assertIdempotencyPolicy(dashboardLayoutPutContract)
    ).not.toThrow();
  });

  it("requires idempotency on dashboard layout PUT contract", () => {
    expect(dashboardLayoutPutContract.idempotency).toEqual({
      mode: "required",
    });
  });
});

describe("pagination contracts", () => {
  it("parses cursor and limit query parameters", () => {
    const params = parsePaginationQuery(
      new URLSearchParams("cursor=abc&limit=10")
    );

    expect(params).toEqual({
      cursor: "abc",
      limit: 10,
    });
  });

  it("applies default page limit", () => {
    const params = paginationQuerySchema.parse({});
    expect(params.limit).toBe(20);
  });

  it("builds serializable pagination meta", () => {
    const meta = paginationMetaSchema.parse({
      hasMore: true,
      limit: 20,
      nextCursor: "next-page",
    });

    expect(meta.nextCursor).toBe("next-page");
  });

  it("merges pagination into response meta", () => {
    const merged = mergePaginationIntoMeta(
      {
        correlationId: "corr-1",
        requestId: "req-1",
        timestamp: "2026-06-23T00:00:00.000Z",
      },
      {
        hasMore: false,
        limit: 20,
        nextCursor: null,
      }
    );

    expect(merged.pagination.nextCursor).toBeNull();
    expect(merged.correlationId).toBe("corr-1");
  });
});

describe("idempotency store", () => {
  beforeEach(() => {
    resetIdempotencyStoreForTests();
    setIdempotencyStoreForTests(createInMemoryIdempotencyStore());
  });

  it("scopes replay keys by contract, tenant, user, and idempotency key", () => {
    const keyA = buildIdempotencyScopeKey({
      contractId: "internal.v1.workspace.dashboard-layout.put",
      idempotencyKey: "retry-key-001",
      tenantId: API_TEST_TENANT_ID,
      userId: parseUserId(API_TEST_ACTOR_ID),
    });
    const keyB = buildIdempotencyScopeKey({
      contractId: "internal.v1.workspace.dashboard-layout.put",
      idempotencyKey: "retry-key-001",
      tenantId: createTestEnterpriseId("tenant", "01ARZ3NDEKTSV4RRFFQ69G5FBV"),
      userId: parseUserId(API_TEST_ACTOR_ID),
    });

    expect(keyA).not.toBe(keyB);
  });

  it("replays stored responses without cross-tenant leakage", async () => {
    resetIdempotencyStoreForTests();
    setIdempotencyStoreForTests(createInMemoryIdempotencyStore());

    const scope = {
      contractId: dashboardLayoutPutContract.id,
      idempotencyKey: "retry-key-001",
      tenantId: API_TEST_TENANT_ID,
      userId: parseUserId(API_TEST_ACTOR_ID),
    };

    await recordIdempotentResponse(scope, {
      data: {
        layout: [],
        source: "user",
        updatedAt: "2026-06-23T00:00:00.000Z",
      },
      statusCode: 200,
    });

    const replay = await readIdempotentResponse(scope);
    expect(replay?.statusCode).toBe(200);
    expect(replay?.data).toEqual({
      layout: [],
      source: "user",
      updatedAt: "2026-06-23T00:00:00.000Z",
    });

    const otherTenant = await readIdempotentResponse({
      ...scope,
      tenantId: createTestEnterpriseId("tenant", "01ARZ3NDEKTSV4RRFFQ69G5FBV"),
    });
    expect(otherTenant).toBeNull();
  });

  it("returns conflict when the same idempotency key is reused with a different body", async () => {
    resetIdempotencyStoreForTests();
    setIdempotencyStoreForTests(createInMemoryIdempotencyStore());

    const scope = {
      contractId: dashboardLayoutPutContract.id,
      idempotencyKey: "retry-key-001" as const,
      tenantId: API_TEST_TENANT_ID,
      userId: parseUserId(API_TEST_ACTOR_ID),
    };

    const firstBody = { layout: [{ widgetId: "a" }] };
    const secondBody = { layout: [{ widgetId: "b" }] };

    await recordIdempotentResponse(scope, {
      data: firstBody,
      requestFingerprint: computeIdempotencyRequestFingerprint(firstBody),
      statusCode: 200,
    });

    await expect(
      readCachedIdempotentResponse({
        ...scope,
        requestFingerprint: computeIdempotencyRequestFingerprint(secondBody),
        responseSchema: dashboardLayoutPutContract.responseSchema,
      })
    ).rejects.toMatchObject({
      code: "conflict",
    });
  });
});
