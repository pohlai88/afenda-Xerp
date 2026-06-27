import { describe, expect, it } from "vitest";

import {
  type CanonicalIdBodyGenerator,
  createFixtureCanonicalIdBodyGenerator,
  FIXTURE_CANONICAL_ID_BODY,
} from "../canonical-id-body-generator.contract.js";
import { createCanonicalId } from "../canonical-id-generator.contract.js";
import { InvalidCanonicalIdError } from "../invalid-canonical-id.error.js";

describe("canonical-id-body-generator.contract (PAS-001 Action 6)", () => {
  it("defines the injectable body generator interface", () => {
    const generator: CanonicalIdBodyGenerator = {
      generateUlidBody: () => FIXTURE_CANONICAL_ID_BODY,
    };

    expect(generator.generateUlidBody()).toBe(FIXTURE_CANONICAL_ID_BODY);
  });

  it("provides a deterministic fixture generator for tests", () => {
    expect(createFixtureCanonicalIdBodyGenerator().generateUlidBody()).toBe(
      FIXTURE_CANONICAL_ID_BODY
    );
    expect(
      createFixtureCanonicalIdBodyGenerator(
        "01ARZ3NDEKTSV4RRFFQ69G5FBV"
      ).generateUlidBody()
    ).toBe("01ARZ3NDEKTSV4RRFFQ69G5FBV");
  });
});

describe("canonical-id-generator.contract (PAS-001 Action 6)", () => {
  it("mints canonical ids only through an injected generator", () => {
    const created = createCanonicalId(
      "customer",
      createFixtureCanonicalIdBodyGenerator()
    );

    expect(created).toBe(`cus_${FIXTURE_CANONICAL_ID_BODY}`);
  });

  it("rejects invalid generator output at the trust boundary", () => {
    expect(() =>
      createCanonicalId("customer", {
        generateUlidBody: () => "invalid",
      })
    ).toThrow(InvalidCanonicalIdError);
  });
});
