import { describe, expect, it } from "vitest";

import {
  assertCanonicalIdBody,
  assertEnterpriseIdPrefix,
} from "../../../index.js";
import {
  assertCanonicalIdBody as identityAssertCanonicalIdBody,
  assertEnterpriseIdPrefix as identityAssertEnterpriseIdPrefix,
} from "../../index.js";

describe("canonical assert export parity (PAS-001 §4.1 / B18)", () => {
  it("re-exports assert helpers from the identity barrel", () => {
    expect(typeof identityAssertCanonicalIdBody).toBe("function");
    expect(typeof identityAssertEnterpriseIdPrefix).toBe("function");
  });

  it("re-exports assert helpers from the @afenda/kernel root barrel", () => {
    expect(assertCanonicalIdBody).toBe(identityAssertCanonicalIdBody);
    expect(assertEnterpriseIdPrefix).toBe(identityAssertEnterpriseIdPrefix);
  });
});
