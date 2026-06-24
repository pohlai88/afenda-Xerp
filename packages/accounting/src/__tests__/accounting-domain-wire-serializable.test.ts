import { describe, expect, it } from "vitest";

import {
  ACCOUNT_TYPES,
  type AccountingDomainWireContext,
  type assertAccountingDomainWireContextJsonSerializable,
  FISCAL_PERIOD_STATES,
  JOURNAL_DOCUMENT_TYPES,
  POSTING_STATUSES,
} from "../index.js";

describe("accounting domain wire serializability", () => {
  it("satisfies compile-time AssertJsonSerializable guard", () => {
    type Guard = assertAccountingDomainWireContextJsonSerializable;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("round-trips AccountingDomainWireContext through JSON", () => {
    const sample: AccountingDomainWireContext = {
      tenantId: "tenant-1",
      companyId: "company-1",
      baseCurrency: "AUD",
      reportingCurrency: "AUD",
      entityGroupId: "group-1",
      organizationUnitId: null,
      fiscalCalendarId: null,
      companyType: "standalone",
      countryCode: "AU",
    };

    const parsed = JSON.parse(
      JSON.stringify(sample)
    ) as AccountingDomainWireContext;

    expect(parsed).toEqual(sample);
  });

  it("exports non-empty closed vocabularies", () => {
    expect(ACCOUNT_TYPES.length).toBeGreaterThan(0);
    expect(FISCAL_PERIOD_STATES.length).toBeGreaterThan(0);
    expect(JOURNAL_DOCUMENT_TYPES.length).toBeGreaterThan(0);
    expect(POSTING_STATUSES.length).toBeGreaterThan(0);
  });
});
