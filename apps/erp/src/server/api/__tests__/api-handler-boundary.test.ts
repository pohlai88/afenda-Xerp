import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { API_TEST_CORRELATION_ID } from "@/lib/api/__tests__/api-id-test-fixtures";
import type { ApiRouteContract } from "@/server/api/contracts/api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "@/server/api/contracts/api-governance.constants";
import {
  collectRouteFiles,
  isAllowlistedRoute,
  isGovernedRouteSource,
} from "@/server/api/contracts/api-route-coverage";
import { serviceActorPingGetContract } from "@/server/api/contracts/auth/service-actor-ping.contract";
import {
  ApiRouteError,
  parseRequestBody,
  parseResponseData,
} from "@/server/api/runtime/api-validation";
import {
  assertApiRouteAuthPolicy,
  createApiHandler,
} from "@/server/api/runtime/create-api-handler";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/auth/resolve-api-route-auth-actor.server", () => ({
  resolveApiRouteAuthActor: vi.fn(async () => null),
}));

import { resolveApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";

const TEST_S2S_SECRET = "test-s2s-signing-secret-min-32-chars!!";

vi.mock("@/server/api/runtime/api-rate-limit", () => ({
  assertRateLimitAllowed: vi.fn(async () => null),
  consumeRateLimitForRequest: vi.fn(async () => null),
}));

vi.mock("@/server/api/runtime/api-handler-audit", () => ({
  emitApiAuditEvidence: vi.fn(async () => undefined),
  emitApiDeniedAuditEvidence: vi.fn(async () => undefined),
}));

vi.mock("@/server/api/runtime/api-handler-logging", () => ({
  createApiHandlerLogger: vi.fn(() => ({
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

const apiRoot = join(import.meta.dirname, "../../../app/api");

const echoResponseSchema = z.object({
  value: z.string(),
});

type EchoResponse = z.infer<typeof echoResponseSchema>;

const echoGetContract = {
  authPolicy: "public",
  cache: { kind: "no-store" },
  contextPolicy: "none",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.test.echo.get",
  summary: "Echo test GET",
  lifecycle: "planned",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/test/echo",
  rateLimitPolicy: "disabled-local-dev",
  requestSchema: z.undefined(),
  requestSchemaRef:
    "apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts#request:none",
  responseSchema: echoResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts#echoResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["test"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, EchoResponse>;

const echoPostRequestSchema = z.object({
  name: z.string().min(1),
});

type EchoPostRequest = z.infer<typeof echoPostRequestSchema>;

const echoPostContract = {
  ...echoGetContract,
  id: "internal.v1.test.echo.post",
  method: "POST",
  path: "/api/internal/v1/test/echo",
  requestSchema: echoPostRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts#echoPostRequestSchema",
} as const satisfies ApiRouteContract<EchoPostRequest, EchoResponse>;

describe("API handler boundary", () => {
  it("requires createApiHandler on governed route files", () => {
    const violations: string[] = [];

    for (const filePath of collectRouteFiles(apiRoot)) {
      if (isAllowlistedRoute(filePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      if (!isGovernedRouteSource(source)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("forbids direct Response.json in governed route files", () => {
    const violations: string[] = [];

    for (const filePath of collectRouteFiles(apiRoot)) {
      if (isAllowlistedRoute(filePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      if (/Response\.json\s*\(/.test(source)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("forbids UI and AppShell imports in governed route files", () => {
    const forbiddenPatterns = [
      /@afenda\/appshell/,
      /@afenda\/metadata-ui/,
      /from ["']react["']/,
    ];
    const violations: string[] = [];

    for (const filePath of collectRouteFiles(apiRoot)) {
      if (isAllowlistedRoute(filePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(source)) {
          violations.push(filePath);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

describe("createApiHandler bidirectional validation pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid request bodies before handler business logic", async () => {
    let handlerInvoked = false;

    const handler = createApiHandler({
      contract: echoPostContract,
      handler: async () => {
        handlerInvoked = true;
        return { value: "never" };
      },
    });

    const request = new Request("http://localhost/api/internal/v1/test/echo", {
      body: JSON.stringify({ name: "" }),
      headers: {
        "content-type": "application/json",
        "x-correlation-id": API_TEST_CORRELATION_ID,
      },
      method: "POST",
    });

    const response = await handler(request);

    expect(handlerInvoked).toBe(false);
    expect(response.status).toBe(400);

    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: false,
      error: {
        code: "validation_failed",
        correlationId: API_TEST_CORRELATION_ID,
      },
    });
  });

  it("rejects invalid response shapes before serialization", async () => {
    const handler = createApiHandler({
      contract: echoGetContract,
      handler: async () => ({ value: 123 }),
    });

    const request = new Request("http://localhost/api/internal/v1/test/echo", {
      headers: { "x-correlation-id": API_TEST_CORRELATION_ID },
      method: "GET",
    });

    const response = await handler(request);

    expect(response.status).toBe(500);

    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: false,
      error: {
        code: "internal_error",
        correlationId: API_TEST_CORRELATION_ID,
        message: "Response validation failed.",
      },
    });
  });

  it("rejects forged service-actor headers on session-required routes before handler", async () => {
    let handlerInvoked = false;
    const sessionContract = {
      ...echoGetContract,
      authPolicy: "session-required",
      contextPolicy: "tenant-company-org-required",
      permission: { mode: "required", permission: "workspace.dashboard.read" },
    } as const satisfies ApiRouteContract<undefined, EchoResponse>;

    const handler = createApiHandler({
      contract: sessionContract,
      handler: async () => {
        handlerInvoked = true;
        return { value: "ok" };
      },
    });

    const request = new Request("http://localhost/api/internal/v1/test/echo", {
      headers: {
        "x-afenda-actor-kind": "service",
        "x-afenda-auth-subject-id": "svc_test_subject",
        "x-afenda-integration-provider": "test-provider",
        "x-afenda-integration-external-id": "ext-001",
      },
      method: "GET",
    });

    const response = await handler(request);

    expect(response.status).toBe(401);
    expect(handlerInvoked).toBe(false);
    const body: unknown = await response.json();
    expect(body).toMatchObject({ ok: false });
  });

  it("allows service-token-required routes when verified service actor resolves", async () => {
    const { resolveApiRouteAuthActor: actualResolve } = await vi.importActual<
      typeof import("@/lib/auth/resolve-api-route-auth-actor.server")
    >("@/lib/auth/resolve-api-route-auth-actor.server");
    const { headers } = await import("next/headers");

    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_S2S_SECRET;
    vi.mocked(resolveApiRouteAuthActor).mockImplementation(actualResolve);

    const handler = createApiHandler({
      contract: serviceActorPingGetContract,
      handler: async () => ({ status: "ok" as const }),
    });

    const { issueServiceActorS2sToken } = await import(
      "@/lib/auth/issue-service-actor-s2s-token.server"
    );
    const token = issueServiceActorS2sToken({
      sub: "svc_ping_subject",
      actorKind: "service",
      provider: "test-provider",
      externalId: "ext-ping",
    });

    const request = new Request(
      "http://localhost/api/internal/v1/auth/service-actor/ping",
      {
        headers: {
          authorization: `Bearer ${token}`,
          "x-afenda-actor-kind": "service",
          "x-afenda-auth-subject-id": "svc_ping_subject",
          "x-afenda-integration-provider": "test-provider",
          "x-afenda-integration-external-id": "ext-ping",
          "x-correlation-id": API_TEST_CORRELATION_ID,
        },
        method: "GET",
      }
    );

    vi.mocked(headers).mockImplementation(async () => request.headers);

    const response = await handler(request);

    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: true,
      data: { status: "ok" },
    });

    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("rejects service-token-required routes when headers lack verified bearer", async () => {
    const { resolveApiRouteAuthActor: actualResolve } = await vi.importActual<
      typeof import("@/lib/auth/resolve-api-route-auth-actor.server")
    >("@/lib/auth/resolve-api-route-auth-actor.server");
    const { headers } = await import("next/headers");

    vi.mocked(resolveApiRouteAuthActor).mockImplementation(actualResolve);

    let handlerInvoked = false;
    const handler = createApiHandler({
      contract: serviceActorPingGetContract,
      handler: async () => {
        handlerInvoked = true;
        return { status: "ok" as const };
      },
    });

    const request = new Request(
      "http://localhost/api/internal/v1/auth/service-actor/ping",
      {
        headers: {
          "x-afenda-actor-kind": "service",
          "x-afenda-auth-subject-id": "svc_forged_subject",
          "x-afenda-integration-provider": "test-provider",
          "x-afenda-integration-external-id": "ext-forged",
        },
        method: "GET",
      }
    );

    vi.mocked(headers).mockImplementation(async () => request.headers);

    const response = await handler(request);

    expect(response.status).toBe(401);
    expect(handlerInvoked).toBe(false);
  });

  it("returns governed success envelope with requestId and correlationId", async () => {
    const handler = createApiHandler({
      contract: echoGetContract,
      handler: async () => ({ value: "ok" }),
    });

    const request = new Request("http://localhost/api/internal/v1/test/echo", {
      headers: { "x-correlation-id": API_TEST_CORRELATION_ID },
      method: "GET",
    });

    const response = await handler(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("x-correlation-id")).toBe(
      API_TEST_CORRELATION_ID
    );
    expect(response.headers.get("x-request-id")).toEqual(expect.any(String));

    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: true,
      data: { value: "ok" },
      meta: {
        correlationId: API_TEST_CORRELATION_ID,
      },
    });

    if (
      typeof body === "object" &&
      body !== null &&
      "meta" in body &&
      typeof body.meta === "object" &&
      body.meta !== null &&
      "requestId" in body.meta
    ) {
      expect(body.meta.requestId).toEqual(expect.any(String));
    }
  });
});

describe("assertApiRouteAuthPolicy (ADR-0035)", () => {
  it("requires verified service actor for service-token-required contracts", () => {
    expect(() =>
      assertApiRouteAuthPolicy({
        authActor: null,
        contract: serviceActorPingGetContract,
        request: new Request("http://localhost/ping", { method: "GET" }),
      })
    ).toThrow(ApiRouteError);
  });
});

describe("api-validation ingress and egress guards", () => {
  it("parseRequestBody throws ApiRouteError for invalid ingress", () => {
    expect(() => parseRequestBody(echoPostRequestSchema, { name: "" })).toThrow(
      ApiRouteError
    );
  });

  it("parseResponseData throws ApiRouteError for invalid egress", () => {
    expect(() => parseResponseData(echoResponseSchema, { value: 123 })).toThrow(
      ApiRouteError
    );
  });
});
