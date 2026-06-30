import { describe, expect, it } from "vitest";

import { issueServiceActorS2sToken } from "../issue-service-actor-s2s-token.server";
import {
  hasServiceActorIngressHeaders,
  parseServiceActorIdentityFromRequestHeaders,
  SERVICE_ACTOR_REQUEST_HEADERS,
} from "../resolve-service-actor.server";

const TEST_SECRET = "test-s2s-signing-secret-min-32-chars!!";

function headersFromRecord(record: Record<string, string>): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(record)) {
    headers.set(key, value);
  }
  return headers;
}

function verifiedServiceActorHeaders(
  overrides: Partial<Record<string, string>> = {}
): Headers {
  const base = {
    [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
    [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_integration_01",
    [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "acme-erp",
    [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "job-runner-01",
    ...overrides,
  };

  const previous = process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;

  const actorKindValue =
    base[SERVICE_ACTOR_REQUEST_HEADERS.actorKind] ?? "service";
  const actorKind =
    actorKindValue === "delegated_application"
      ? "delegated_application"
      : "service";

  const token = issueServiceActorS2sToken({
    sub:
      base[SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId] ?? "sub_integration_01",
    actorKind,
    provider:
      base[SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider] ?? "acme-erp",
    externalId:
      base[SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId] ??
      "job-runner-01",
  });

  if (previous === undefined) {
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  } else {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = previous;
  }

  const headers = headersFromRecord(base);
  headers.set("authorization", `Bearer ${token}`);
  return headers;
}

describe("resolve-service-actor.server (PAS-001A R2 · ADR-0035)", () => {
  it("detects service actor ingress headers", () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
    });

    expect(hasServiceActorIngressHeaders(headers)).toBe(true);
  });

  it("parses service actor identity when bearer verification succeeds", () => {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;
    const headers = verifiedServiceActorHeaders();

    const identity = parseServiceActorIdentityFromRequestHeaders(headers);

    expect(identity).not.toBeNull();
    expect(identity?.actorKind).toBe("service");
    expect(identity?.integrationIdentity?.provider).toBe("acme-erp");
    expect(identity?.userId).toBeUndefined();
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("rejects shape-only headers without bearer token", () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_integration_01",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "acme-erp",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "job-runner-01",
    });

    expect(parseServiceActorIdentityFromRequestHeaders(headers)).toBeNull();
  });

  it("rejects claim/header mismatch", () => {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;
    const headers = verifiedServiceActorHeaders();
    headers.set(SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId, "forged-subject");

    expect(parseServiceActorIdentityFromRequestHeaders(headers)).toBeNull();
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("parses delegated_application actor kind with verified bearer", () => {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;
    const headers = verifiedServiceActorHeaders({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "delegated_application",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_delegated_01",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "partner-app",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "connector-99",
    });

    const identity = parseServiceActorIdentityFromRequestHeaders(headers);

    expect(identity?.actorKind).toBe("delegated_application");
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("returns null when service headers are absent", () => {
    const headers = new Headers();

    expect(parseServiceActorIdentityFromRequestHeaders(headers)).toBeNull();
  });

  it("rejects human actor kind at service ingress", () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "human",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_human",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "ignored",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "ignored",
    });

    expect(parseServiceActorIdentityFromRequestHeaders(headers)).toBeNull();
  });
});
