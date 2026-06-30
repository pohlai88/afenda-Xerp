import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/internal/v1/auth/service-actor/ping/route";
import { issueServiceActorS2sToken } from "@/lib/auth/issue-service-actor-s2s-token.server";
import { SERVICE_ACTOR_REQUEST_HEADERS } from "@/lib/auth/resolve-service-actor.server";

const TEST_S2S_SECRET = "test-s2s-signing-secret-min-32-chars!!";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/server/api/runtime/api-rate-limit", () => ({
  assertRateLimitAllowed: vi.fn(async () => null),
  consumeRateLimitForRequest: vi.fn(async () => ({
    allowed: true,
    limit: 120,
    policy: "authenticated-standard",
    remaining: 119,
    resetAtUnix: Math.floor(Date.now() / 1000) + 60,
    retryAfterSeconds: null,
  })),
}));

vi.mock("@/server/api/runtime/api-handler-audit", () => ({
  emitApiAuditEvidence: vi.fn(async () => undefined),
  emitApiDeniedAuditEvidence: vi.fn(async () => undefined),
}));

vi.mock("@/server/api/runtime/api-handler-logging", () => ({
  createApiHandlerLogger: vi.fn(() => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  })),
  logApiRequest: vi.fn(),
}));

vi.mock("@/lib/context/create-server-execution-context.server", () => ({
  createServerExecutionContext: vi.fn(
    (input: { readonly correlationId: string }) => ({
      actorId: null,
      correlationId: input.correlationId,
      executionId: "01TESTEXECUTIONCONTEXTID00000001",
      source: "api" as const,
      tenantId: "00000000-0000-0000-0000-000000000001",
    })
  ),
}));

vi.mock("@/server/api/runtime/idempotency", () => ({
  readCachedIdempotentResponse: vi.fn(async () => null),
  recordIdempotentResponse: vi.fn(async () => undefined),
  resolveRequestIdempotencyKey: vi.fn(() => null),
}));

vi.mock("@/lib/spine/run-protected-mutation", () => ({
  runProtectedMutation: vi.fn(
    async (input: {
      readonly execute: (scope: unknown) => Promise<unknown>;
    }) => ({
      result: await input.execute({}),
    })
  ),
}));

import { headers } from "next/headers";

function buildVerifiedPingRequest(
  overrides: Partial<Record<string, string>> = {}
): Request {
  const actorHeaders = {
    [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
    [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "svc_ping_integration",
    [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "afenda-probe",
    [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "ping-job-01",
    ...overrides,
  };

  const token = issueServiceActorS2sToken({
    sub: actorHeaders[SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId] ?? "",
    actorKind: "service",
    provider:
      actorHeaders[SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider] ?? "",
    externalId:
      actorHeaders[SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId] ?? "",
  });

  const requestHeaders = new Headers({
    authorization: `Bearer ${token}`,
    "x-correlation-id": "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV",
    ...actorHeaders,
  });

  return new Request(
    "http://localhost/api/internal/v1/auth/service-actor/ping",
    {
      headers: requestHeaders,
      method: "GET",
    }
  );
}

describe("GET /api/internal/v1/auth/service-actor/ping (ADR-0036 E2E)", () => {
  beforeEach(() => {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_S2S_SECRET;
  });

  afterEach(() => {
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
    vi.clearAllMocks();
  });

  it("returns ok when verified service actor bearer and headers match", async () => {
    const request = buildVerifiedPingRequest();
    vi.mocked(headers).mockImplementation(async () => request.headers);

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: true,
      data: { status: "ok" },
      meta: { correlationId: "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV" },
    });
  });

  it("returns 401 when service headers are present without bearer", async () => {
    const request = new Request(
      "http://localhost/api/internal/v1/auth/service-actor/ping",
      {
        headers: {
          [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
          [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "svc_forged",
          [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "afenda-probe",
          [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "forged-job",
        },
        method: "GET",
      }
    );

    vi.mocked(headers).mockImplementation(async () => request.headers);

    const response = await GET(request);

    expect(response.status).toBe(401);
    const body: unknown = await response.json();
    expect(body).toMatchObject({ ok: false });
  });

  it("returns 401 when bearer claims do not match ingress headers", async () => {
    const request = buildVerifiedPingRequest();
    request.headers.set(
      SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId,
      "svc_header_mismatch"
    );

    vi.mocked(headers).mockImplementation(async () => request.headers);

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
