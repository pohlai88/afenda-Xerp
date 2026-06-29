import { describe, expect, it } from "vitest";

import { checkTenantLifecycleExtensionConsumerAttestation } from "../check-erp-tenant-lifecycle-extension-consumer-attestation.mts";

describe("check-erp-tenant-lifecycle-extension-consumer-attestation", () => {
  it("passes on the ADR-0027 B111 consumer wiring", () => {
    const violations = checkTenantLifecycleExtensionConsumerAttestation();
    expect(violations).toEqual([]);
  });
});
