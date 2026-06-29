import { describe, expect, it } from "vitest";

import {
  hasServiceActorIngressHeaders,
  parseServiceActorIdentityFromRequestHeaders,
  SERVICE_ACTOR_REQUEST_HEADERS,
} from "../resolve-service-actor.server";

function headersFromRecord(record: Record<string, string>): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(record)) {
    headers.set(key, value);
  }
  return headers;
}

describe("resolve-service-actor.server (PAS-001A R2)", () => {
  it("detects service actor ingress headers", () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
    });

    expect(hasServiceActorIngressHeaders(headers)).toBe(true);
  });

  it("parses service actor identity through kernel AuthActorIdentity", () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_integration_01",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "acme-erp",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "job-runner-01",
    });

    const identity = parseServiceActorIdentityFromRequestHeaders(headers);

    expect(identity).not.toBeNull();
    expect(identity?.actorKind).toBe("service");
    expect(identity?.integrationIdentity?.provider).toBe("acme-erp");
    expect(identity?.userId).toBeUndefined();
  });

  it("parses delegated_application actor kind", () => {
    const headers = headersFromRecord({
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "delegated_application",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: "sub_delegated_01",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]: "partner-app",
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]: "connector-99",
    });

    const identity = parseServiceActorIdentityFromRequestHeaders(headers);

    expect(identity?.actorKind).toBe("delegated_application");
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
