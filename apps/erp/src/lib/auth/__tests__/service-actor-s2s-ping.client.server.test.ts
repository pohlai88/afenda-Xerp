import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SERVICE_ACTOR_REQUEST_HEADERS } from "../resolve-service-actor.server";
import { runServiceActorS2sPingProbe } from "../service-actor-s2s-ping.client.server";

const TEST_SECRET = "test-s2s-signing-secret-min-32-chars!!";
const TEST_CORRELATION_ID = "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("runServiceActorS2sPingProbe (ADR-0036)", () => {
  beforeEach(() => {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;
    process.env["BETTER_AUTH_URL"] = "http://localhost:3000";
  });

  afterEach(() => {
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
    delete process.env["BETTER_AUTH_URL"];
    vi.restoreAllMocks();
  });

  it("calls the governed ping route with verified bearer and actor headers", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json(
        {
          ok: true,
          data: { status: "ok" },
          meta: {
            correlationId: TEST_CORRELATION_ID,
            requestId: "req-probe",
            timestamp: "2026-06-30T00:00:00.000Z",
          },
        },
        { status: 200 }
      )
    );

    const result = await runServiceActorS2sPingProbe({
      correlationId: TEST_CORRELATION_ID,
      fetchImpl,
    });

    expect(result).toEqual({
      correlationId: TEST_CORRELATION_ID,
      status: "ok",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    const [url, init] = fetchImpl.mock.calls[0] ?? [];
    expect(url).toBe(
      "http://localhost:3000/api/internal/v1/auth/service-actor/ping"
    );
    expect(init?.method).toBe("GET");

    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toMatch(/^Bearer afenda-s2s-v1\./);
    expect(headers.get(SERVICE_ACTOR_REQUEST_HEADERS.actorKind)).toBe(
      "service"
    );
    expect(headers.get(SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId)).toBe(
      "trigger-service-actor-probe"
    );
  });

  it("throws when ping responds with non-success HTTP status", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 401 }));

    await expect(runServiceActorS2sPingProbe({ fetchImpl })).rejects.toThrow(
      "Service-actor S2S ping failed with HTTP 401"
    );
  });
});
