import { describe, expect, it } from "vitest";

import { assertWireLegalEntityContext } from "../legal-entity-context.assert.js";
import type { LegalEntityWireContext } from "../legal-entity-context.contract.js";
import {
  normalizeLegalEntityContextForWire,
  parseLegalEntityContext,
  parseUnknownLegalEntityContext,
} from "../legal-entity-context.parser.js";

const VALID_WIRE: LegalEntityWireContext = {
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  legalName: "Acme Holdings Ltd",
  displayName: "Acme Holdings",
  slug: "acme-holdings",
  companyType: "group_company",
  relationshipToHoldingCompany: "subsidiary",
  countryCode: "MY",
  baseCurrency: "MYR",
  reportingCurrency: "USD",
  fiscalCalendarId: "fc-2026",
  registrationNumber: "201901012345",
  taxRegistrationNumber: "C1234567890",
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

describe("legal entity context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseLegalEntityContext(VALID_WIRE);

    expect(normalizeLegalEntityContextForWire(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownLegalEntityContext", () => {
    const context = parseUnknownLegalEntityContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(context.companyId).toBe(VALID_WIRE.companyId);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireLegalEntityContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects invalid companyType enum before branding", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        companyType: "banana",
      } as unknown as LegalEntityWireContext)
    ).toThrow(/companyType must be one of/i);
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as LegalEntityWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects invalid slug format", () => {
    expect(() =>
      assertWireLegalEntityContext({ ...VALID_WIRE, slug: "Acme_Holdings" })
    ).toThrow(/slug must use lowercase letters/i);
  });

  it("rejects group_company without entityGroupId", () => {
    expect(() =>
      assertWireLegalEntityContext({
        ...VALID_WIRE,
        entityGroupId: null,
      })
    ).toThrow(/entityGroupId is required when companyType is group_company/i);
  });

  it("rejects group_company without relationship routing", () => {
    expect(() =>
      assertWireLegalEntityContext({
        ...VALID_WIRE,
        relationshipToHoldingCompany: null,
      })
    ).toThrow(/relationshipToHoldingCompany is required/i);
  });

  it("rejects relationship routing on standalone company", () => {
    expect(() =>
      assertWireLegalEntityContext({
        ...VALID_WIRE,
        companyType: "standalone",
        relationshipToHoldingCompany: "subsidiary",
        entityGroupId: null,
      })
    ).toThrow(/only allowed when companyType is group_company/i);
  });

  it("rejects effectiveTo before effectiveFrom", () => {
    expect(() =>
      assertWireLegalEntityContext({
        ...VALID_WIRE,
        effectiveFrom: "2026-06-01",
        effectiveTo: "2026-01-01",
      })
    ).toThrow(
      /effectiveTo must be null or greater than or equal to effectiveFrom/i
    );
  });

  it("rejects invalid tenantId family before branding", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/TenantId/i);
  });

  it("rejects invalid entityGroupId family", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        entityGroupId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/EntityGroupId/i);
  });

  it("rejects invalid companyId family", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        companyId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/CompanyId/i);
  });

  it("rejects misclassified enterprise ID as countryCode", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        countryCode: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/canonical enterprise ID/i);
  });

  it("rejects tenant human reference as baseCurrency", () => {
    expect(() =>
      parseLegalEntityContext({
        ...VALID_WIRE,
        baseCurrency: "EMP-000123",
      })
    ).toThrow(/tenant human reference/i);
  });

  it("allows null entityGroupId for standalone wire", () => {
    const wire: LegalEntityWireContext = {
      ...VALID_WIRE,
      companyType: "standalone",
      relationshipToHoldingCompany: null,
      entityGroupId: null,
    };

    expect(parseLegalEntityContext(wire).entityGroupId).toBeNull();
  });
});
