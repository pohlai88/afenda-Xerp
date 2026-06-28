import {
  type LegalEntityWireContext,
  type OwnershipInterestContext,
  type OwnershipInterestWireContext,
  parseLegalEntityContext,
  parseOwnershipInterestContext,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import type {
  AccountingReadinessContext,
  AccountingReadinessWireContext,
  assertAccountingReadinessContextJsonSerializable,
} from "../accounting-readiness-context.types.js";

const SAMPLE_OWNERSHIP_INTEREST_WIRE: OwnershipInterestWireContext = {
  ownershipInterestId: "own_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  parentLegalEntityId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  childLegalEntityId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FBV",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_OWNERSHIP_INTEREST: OwnershipInterestContext =
  parseOwnershipInterestContext(SAMPLE_OWNERSHIP_INTEREST_WIRE);

const SAMPLE_LEGAL_ENTITY_WIRE: LegalEntityWireContext = {
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  slug: "acme-co",
  legalName: "Acme Co",
  displayName: "Acme Co",
  registrationNumber: null,
  taxRegistrationNumber: null,
  countryCode: "AU",
  baseCurrency: "AUD",
  reportingCurrency: null,
  companyType: "standalone",
  relationshipToHoldingCompany: null,
  fiscalCalendarId: null,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_LEGAL_ENTITY = parseLegalEntityContext(SAMPLE_LEGAL_ENTITY_WIRE);

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
