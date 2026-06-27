import { describe, expect, it } from "vitest";

import {
  type AccountingReadinessContext,
  type AccountingReadinessWireContext,
  type assertAccountingReadinessContextJsonSerializable,
  isOwnershipInterestEffectiveAt,
  type LegalEntityContext,
  type OwnershipInterestContext,
} from "../context/index.js";
import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
} from "../identity/index.js";

const SAMPLE_OWNERSHIP_INTEREST: OwnershipInterestContext = {
  ownershipInterestId: "oi-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  parentLegalEntityId: "parent-1",
  childLegalEntityId: "child-1",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_LEGAL_ENTITY: LegalEntityContext = {
  companyId: "company-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  slug: "acme-co",
  legalName: "Acme Co",
  displayName: "Acme Co",
  registrationNumber: null,
  taxRegistrationNumber: null,
  countryCode: brandRequiredCountryCode("AU"),
  baseCurrency: brandRequiredCurrencyCode("AUD"),
  reportingCurrency: null,
  companyType: "standalone",
  fiscalCalendarId: null,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

describe("isOwnershipInterestEffectiveAt", () => {
  it("returns true for active interests within the effective window", () => {
    expect(
      isOwnershipInterestEffectiveAt(SAMPLE_OWNERSHIP_INTEREST, "2026-06-01")
    ).toBe(true);
  });

  it("returns false before effectiveFrom", () => {
    expect(
      isOwnershipInterestEffectiveAt(SAMPLE_OWNERSHIP_INTEREST, "2025-12-31")
    ).toBe(false);
  });

  it("returns false after effectiveTo", () => {
    expect(
      isOwnershipInterestEffectiveAt(
        { ...SAMPLE_OWNERSHIP_INTEREST, effectiveTo: "2026-05-31" },
        "2026-06-01"
      )
    ).toBe(false);
  });
});

type _AccountingReadinessWireGuard =
  assertAccountingReadinessContextJsonSerializable;
type _AccountingReadinessWireGuardSatisfied =
  _AccountingReadinessWireGuard extends true ? true : never;

describe("AccountingReadinessWireContext — JSON serializability guard", () => {
  it("satisfies compile-time AssertJsonSerializable guard", () => {
    const guard: _AccountingReadinessWireGuardSatisfied = true;
    const sample: AccountingReadinessWireContext = {
      baseCurrency: "AUD",
      consolidationScope: null,
      entityGroup: null,
      legalEntity: SAMPLE_LEGAL_ENTITY,
      organizationUnit: null,
      ownershipInterests: [],
      reportingCurrency: "AUD",
    };

    expect(guard).toBe(true);
    expect(sample.baseCurrency).toBe("AUD");
  });
});

describe("AccountingReadinessContext shape", () => {
  it("accepts a fully populated readiness slice", () => {
    const readiness: AccountingReadinessContext = {
      baseCurrency: "AUD",
      consolidationScope: null,
      entityGroup: null,
      legalEntity: SAMPLE_LEGAL_ENTITY,
      organizationUnit: null,
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
      reportingCurrency: "USD",
    };

    expect(readiness.reportingCurrency).toBe("USD");
  });
});
