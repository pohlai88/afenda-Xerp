import { describe, expect, it } from "vitest";
import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import {
  PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS,
  PROCUREMENT_FOUNDATION_READINESS_ROUTE,
} from "../../../packages/features/erp-modules/src/procurement/procurement.context-spine-consumer.contract.ts";
import { checkProcurementContextSpineConsumer } from "../check-procurement-context-spine-consumer.mts";

describe("check-procurement-context-spine-consumer gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkProcurementContextSpineConsumer();

    expect(violations).toEqual([]);
  });

  it("aligns bundle contextSpineConsumer with features contract resolvers", () => {
    const bundleResolvers = [
      ...PROCUREMENT_FOUNDATION_BUNDLE.contextSpineConsumer!.requiredResolvers,
    ].sort();

    expect(bundleResolvers).toEqual(
      [...PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS].sort()
    );
  });

  it("declares foundation readiness metadata surface route", () => {
    const surface = PROCUREMENT_FOUNDATION_BUNDLE.metadataBinding.surfaces.find(
      (entry) =>
        entry.surfaceId === PROCUREMENT_FOUNDATION_READINESS_ROUTE.surfaceId
    );

    expect(surface?.route).toBe(
      PROCUREMENT_FOUNDATION_READINESS_ROUTE.routePattern
    );
    expect(surface?.operatingContextRequired).toBe(true);
  });
});
