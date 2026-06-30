import { describe, expect, it } from "vitest";

import {
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION,
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT,
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_SLICE_ID,
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_STATUS,
  PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS,
  PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS,
  PROCUREMENT_FOUNDATION_READINESS_ROUTE,
} from "../procurement.context-spine-consumer.contract.js";
import { PROCUREMENT_OWNERSHIP_CONTRACT } from "../procurement.ownership.contract.js";

describe("procurement.context-spine-consumer.contract (ERP-PROC-OP-005)", () => {
  it("declares ERP-PROC-OP-005 attested consumer proof", () => {
    expect(PROCUREMENT_CONTEXT_SPINE_CONSUMER_SLICE_ID).toBe("ERP-PROC-OP-005");
    expect(PROCUREMENT_CONTEXT_SPINE_CONSUMER_STATUS).toBe("attested");
    expect(PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION.sliceId).toBe(
      "ERP-PROC-OP-005"
    );
  });

  it("requires canonical IS-002 resolvers and forbids header bypass ingress", () => {
    expect(PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS).toHaveLength(2);
    expect(PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS).toHaveLength(1);
    expect(
      PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT.requiredResolvers
    ).toEqual([...PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS]);
    expect(PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS[0]).toContain(
      "from-headers"
    );
  });

  it("declares foundation readiness route on appIngress owner", () => {
    expect(PROCUREMENT_FOUNDATION_READINESS_ROUTE.routePattern).toBe(
      "/modules/procurement/readiness"
    );
    expect(PROCUREMENT_FOUNDATION_READINESS_ROUTE.delegate).toBe(
      "loadProtectedRequestOperatingContext"
    );
    expect(PROCUREMENT_OWNERSHIP_CONTRACT.appIngress).toBe("apps/erp");
  });
});
