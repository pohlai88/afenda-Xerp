import { describe, expect, it } from "vitest";

import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";

import { resolveAccountingReadinessContext } from "../resolve-accounting-readiness.server";

describe("resolveAccountingReadinessContext", () => {
  it("delegates to ERP accounting-readiness projection at the trust boundary", () => {
    const operatingContext = createModuleRouteOperatingContext();
    const readiness = resolveAccountingReadinessContext(operatingContext, {
      reportingDate: "2026-06-01",
    });

    expect(readiness.legalEntity.companyId).toBe(
      operatingContext.legalEntity.companyId
    );
    expect(readiness.baseCurrency).toBe(
      operatingContext.legalEntity.baseCurrency
    );
    expect(readiness.reportingCurrency).toBe(
      operatingContext.legalEntity.reportingCurrency ??
        operatingContext.legalEntity.baseCurrency
    );
    expect(readiness.ownershipInterests).toEqual(
      operatingContext.ownershipInterests
    );
  });
});
