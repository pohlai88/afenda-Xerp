import { describe, expect, it } from "vitest";

import { TEST_USER_ID } from "../../../__tests__/fixtures/enterprise-id.fixtures.js";
import {
  ACTOR_KINDS,
  assertActorKind,
  isActorKind,
  parseOptionalActorKind,
} from "../actor-kind.contract.js";
import {
  parseIntegrationIdentity,
  serializeIntegrationIdentity,
} from "../integration-identity.contract.js";

describe("actor kind vocabulary (PAS-001 E12)", () => {
  it("accepts all governed actor kinds", () => {
    for (const kind of ACTOR_KINDS) {
      expect(isActorKind(kind)).toBe(true);
      expect(assertActorKind(kind)).toBe(kind);
    }
  });

  it("rejects unknown actor kinds", () => {
    expect(() => assertActorKind("oauth_client")).toThrow(
      /ActorKind must be one of/
    );
  });

  it("parseOptionalActorKind returns undefined for empty input", () => {
    expect(parseOptionalActorKind(undefined)).toBeUndefined();
    expect(parseOptionalActorKind("")).toBeUndefined();
  });
});

describe("integration identity vocabulary (PAS-001 E12)", () => {
  it("parses provider and externalId", () => {
    const identity = parseIntegrationIdentity({
      provider: "azure-ad",
      externalId: "spn-00042",
    });

    expect(serializeIntegrationIdentity(identity)).toEqual({
      provider: "azure-ad",
      externalId: "spn-00042",
    });
  });

  it("rejects canonical enterprise IDs as externalId", () => {
    expect(() =>
      parseIntegrationIdentity({
        provider: "partner",
        externalId: TEST_USER_ID,
      })
    ).toThrow(/must not be a canonical enterprise ID/i);
  });

  it("rejects empty provider or externalId", () => {
    expect(() =>
      parseIntegrationIdentity({ provider: "", externalId: "x" })
    ).toThrow(/provider must be non-empty/i);

    expect(() =>
      parseIntegrationIdentity({ provider: "x", externalId: "  " })
    ).toThrow(/externalId must be non-empty/i);
  });
});
