import type { OperatingContext } from "@afenda/kernel";
import { ok } from "@afenda/kernel";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@afenda/auth", () => ({
  getAfendaAuthSession: vi.fn(),
}));

vi.mock("@/lib/context/resolve-operating-context.server", () => ({
  resolveOperatingContext: vi.fn(),
}));

vi.mock("@/lib/context/resolve-operating-context-orchestrator.server", () => ({
  resolveOperatingContextOrchestrator: vi.fn(),
}));

import { getAfendaAuthSession } from "@afenda/auth";

import { resolveApiRouteOperatingContext } from "@/lib/api/resolve-api-route-operating-context";
import { issueServiceActorS2sToken } from "@/lib/auth/issue-service-actor-s2s-token.server";
import { resolveApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";
import { SERVICE_ACTOR_REQUEST_HEADERS } from "@/lib/auth/resolve-service-actor.server";
import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import { SERVICE_ACTOR_BRIDGE_WIRING } from "@/lib/context/context-integration-registry";
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";
import { resolveOperatingContextOrchestrator } from "@/lib/context/resolve-operating-context-orchestrator.server";

function headersFromRecord(record: Record<string, string>): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(record)) {
    headers.set(key, value);
  }
  return headers;
}

function serviceActorHeaders(): Headers {
  const token = issueServiceActorS2sToken({
    sub: "sub_service_01",
    actorKind: "service",
    provider: "acme-erp",
    externalId: "job-runner-01",
  });

  return headersFromRecord({
    authorization: `Bearer ${token}`,
    [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
    [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_service_01",
    [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "acme-erp",
    [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "job-runner-01",
    [TENANT_SLUG_HEADER]: "acme",
    "x-correlation-id": "corr-s2s",
  });
}

describe("SERVICE_ACTOR_BRIDGE_WIRING (PAS-001A R3b)", () => {
  it("declares operating-context assembly on the API resolver module", () => {
    const operatingContextEntry = SERVICE_ACTOR_BRIDGE_WIRING.find(
      (entry) => entry.id === "service-actor-api-operating-context"
    );

    expect(operatingContextEntry).toEqual({
      id: "service-actor-api-operating-context",
      step: "Internal API operating context branches on S2S ingress before session path",
      module: "lib/api/resolve-api-route-operating-context.ts",
      delegate: "resolveApiRouteOperatingContext",
    });
  });
});

describe("resolveApiRouteOperatingContext (PAS-001A R3b)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] =
      "test-s2s-signing-secret-min-32-chars!!";
  });

  afterEach(() => {
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("assembles service-actor context via spine orchestrator without human session", async () => {
    const operatingContext = {
      tenantId: "00000000-0000-0000-0000-000000000001",
    } as OperatingContext;

    vi.mocked(resolveOperatingContextOrchestrator).mockResolvedValue(
      ok(operatingContext)
    );

    const result = await resolveApiRouteOperatingContext({
      correlationId: "corr-s2s",
      requestHeaders: serviceActorHeaders(),
    });

    expect(getAfendaAuthSession).not.toHaveBeenCalled();
    expect(resolveOperatingContext).not.toHaveBeenCalled();
    expect(resolveOperatingContextOrchestrator).toHaveBeenCalledWith({
      actorUserId: "sub_service_01",
      correlationId: "corr-s2s",
      selection: expect.objectContaining({ tenantSlug: "acme" }),
    });
    expect(result.ok).toBe(true);
  });

  it("requires tenant slug for service-actor context assembly", async () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_service_01",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "acme-erp",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "job-runner-01",
    });

    const result = await resolveApiRouteOperatingContext({
      requestHeaders: headers,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MEMBERSHIP_DENIED");
    }
    expect(resolveOperatingContextOrchestrator).not.toHaveBeenCalled();
  });

  it("uses human session operating-context path when service headers are absent", async () => {
    vi.mocked(getAfendaAuthSession).mockResolvedValue({
      user: { userId: "human-user-01" },
    } as never);
    vi.mocked(resolveOperatingContext).mockResolvedValue(
      ok({ tenantId: "tenant-human" } as OperatingContext)
    );

    const headers = headersFromRecord({
      [TENANT_SLUG_HEADER]: "acme",
    });

    await resolveApiRouteOperatingContext({ requestHeaders: headers });

    expect(resolveOperatingContext).toHaveBeenCalled();
    expect(resolveOperatingContextOrchestrator).not.toHaveBeenCalled();
  });
});

describe("resolveApiRouteAuthActor service priority (PAS-001A R3b · ADR-0035)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] =
      "test-s2s-signing-secret-min-32-chars!!";
  });

  afterEach(() => {
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("prefers service actor identity over human session — no impersonation", async () => {
    vi.mocked(getAfendaAuthSession).mockResolvedValue({
      user: { userId: "human-user-01" },
    } as never);

    const actor = await resolveApiRouteAuthActor(serviceActorHeaders());

    expect(actor?.kind).toBe("service");
    if (actor?.kind === "service") {
      expect(actor.identity.authSubjectId).toBe("sub_service_01");
      expect(actor.identity.actorKind).toBe("service");
    }
    expect(getAfendaAuthSession).not.toHaveBeenCalled();
  });
});
