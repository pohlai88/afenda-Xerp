import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { issueServiceActorS2sToken } from "../issue-service-actor-s2s-token.server";
import { SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS } from "../service-actor-s2s-token.contract";
import { verifyServiceActorS2sBearerToken } from "../verify-service-actor-s2s-token.server";

const TEST_SECRET = "test-s2s-signing-secret-min-32-chars!!";

function withTestEnv<T>(run: () => T): T {
  const previous = process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;
  try {
    return run();
  } finally {
    if (previous === undefined) {
      delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
    } else {
      process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = previous;
    }
  }
}

describe("verifyServiceActorS2sBearerToken (ADR-0035)", () => {
  beforeEach(() => {
    process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"] = TEST_SECRET;
  });

  afterEach(() => {
    delete process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"];
  });

  it("accepts a valid token", () => {
    const token = issueServiceActorS2sToken({
      sub: "sub_service_01",
      actorKind: "service",
      provider: "acme-erp",
      externalId: "job-runner-01",
    });

    const claims = verifyServiceActorS2sBearerToken(`Bearer ${token}`);

    expect(claims).toEqual({
      sub: "sub_service_01",
      actorKind: "service",
      provider: "acme-erp",
      externalId: "job-runner-01",
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it("rejects expired tokens", () => {
    const token = withTestEnv(() =>
      issueServiceActorS2sToken(
        {
          sub: "sub_service_01",
          actorKind: "service",
          provider: "acme-erp",
          externalId: "job-runner-01",
          ttlMs: 1000,
        },
        process.env
      )
    );

    const expiredAt = Date.now() + SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS + 5000;
    const claims = verifyServiceActorS2sBearerToken(
      `Bearer ${token}`,
      process.env,
      expiredAt
    );

    expect(claims).toBeNull();
  });

  it("rejects tokens with invalid signatures", () => {
    const token = issueServiceActorS2sToken({
      sub: "sub_service_01",
      actorKind: "service",
      provider: "acme-erp",
      externalId: "job-runner-01",
    });

    const tampered = `${token}x`;
    expect(verifyServiceActorS2sBearerToken(`Bearer ${tampered}`)).toBeNull();
  });

  it("rejects missing bearer prefix", () => {
    const token = issueServiceActorS2sToken({
      sub: "sub_service_01",
      actorKind: "service",
      provider: "acme-erp",
      externalId: "job-runner-01",
    });

    expect(verifyServiceActorS2sBearerToken(token)).toBeNull();
  });
});
