import { describe, expect, it } from "vitest";

import { persistenceCanonicalIdBodyGenerator } from "../persistence-canonical-id-body-generator.server";

const CROCKFORD_ULID_BODY = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe("persistenceCanonicalIdBodyGenerator", () => {
  it("returns a Crockford ULID body matching kernel format contract", () => {
    const body = persistenceCanonicalIdBodyGenerator.generateUlidBody();

    expect(body).toHaveLength(26);
    expect(body).toMatch(CROCKFORD_ULID_BODY);
  });

  it("returns distinct bodies on successive calls", () => {
    const first = persistenceCanonicalIdBodyGenerator.generateUlidBody();
    const second = persistenceCanonicalIdBodyGenerator.generateUlidBody();

    expect(first).not.toBe(second);
  });
});
