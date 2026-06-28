import { describe, expect, it } from "vitest";

import { assertWireConsolidationScopeContext } from "../consolidation-scope-context.assert.js";
import type { ConsolidationScopeWireContext } from "../consolidation-scope-context.contract.js";
import {
  normalizeConsolidationScopeContextForWire,
  parseConsolidationScopeContext,
  parseUnknownConsolidationScopeContext,
  serializeConsolidationScopeContext,
} from "../consolidation-scope-context.parser.js";

const VALID_WIRE: ConsolidationScopeWireContext = {
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  reportingDate: "2026-06-01",
  legalEntities: [
    {
      companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      consolidationTreatment: "full_consolidation",
      ownershipPercentage: 100,
    },
    {
      companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FBV",
      consolidationTreatment: "equity_method",
      ownershipPercentage: 30,
    },
  ],
};

describe("consolidation scope context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize and serialize", () => {
    const context = parseConsolidationScopeContext(VALID_WIRE);

    expect(normalizeConsolidationScopeContextForWire(context)).toEqual(
      VALID_WIRE
    );
    expect(serializeConsolidationScopeContext(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownConsolidationScopeContext", () => {
    const context = parseUnknownConsolidationScopeContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(context.tenantId).toBe(VALID_WIRE.tenantId);
    expect(context.legalEntities).toHaveLength(2);
  });

  it("accepts empty legalEntities array", () => {
    const wire: ConsolidationScopeWireContext = {
      ...VALID_WIRE,
      legalEntities: [],
    };

    const context = parseConsolidationScopeContext(wire);

    expect(context.legalEntities).toEqual([]);
    expect(normalizeConsolidationScopeContextForWire(context)).toEqual(wire);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireConsolidationScopeContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects empty tenantId before branding", () => {
    expect(() =>
      assertWireConsolidationScopeContext({
        ...VALID_WIRE,
        tenantId: "   ",
      })
    ).toThrow(/tenantId is required/i);
  });

  it("rejects invalid consolidationTreatment enum before branding", () => {
    expect(() =>
      parseConsolidationScopeContext({
        ...VALID_WIRE,
        legalEntities: [
          {
            ...VALID_WIRE.legalEntities[0]!,
            consolidationTreatment: "ghost",
          },
        ],
      } as unknown as ConsolidationScopeWireContext)
    ).toThrow(/consolidationTreatment must be one of/i);
  });

  it("rejects ownership percentage outside 0–100", () => {
    expect(() =>
      assertWireConsolidationScopeContext({
        ...VALID_WIRE,
        legalEntities: [
          {
            ...VALID_WIRE.legalEntities[0]!,
            ownershipPercentage: 150,
          },
        ],
      })
    ).toThrow(/ownershipPercentage must be a number between 0 and 100/i);
  });

  it("rejects non-finite ownership percentage before branding", () => {
    expect(() =>
      assertWireConsolidationScopeContext({
        ...VALID_WIRE,
        legalEntities: [
          {
            ...VALID_WIRE.legalEntities[0]!,
            ownershipPercentage: Number.NaN,
          },
        ],
      })
    ).toThrow(/ownershipPercentage must be a number between 0 and 100/i);
  });

  it("rejects invalid reportingDate format", () => {
    expect(() =>
      assertWireConsolidationScopeContext({
        ...VALID_WIRE,
        reportingDate: "2026/06/01",
      })
    ).toThrow(/reportingDate must be an ISO calendar date/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parseConsolidationScopeContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid entityGroupId family before branding", () => {
    expect(() =>
      parseConsolidationScopeContext({
        ...VALID_WIRE,
        entityGroupId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/entityGroupId/i);
  });

  it("rejects invalid company id family before branding", () => {
    expect(() =>
      parseConsolidationScopeContext({
        ...VALID_WIRE,
        legalEntities: [
          {
            ...VALID_WIRE.legalEntities[0]!,
            companyId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
          },
        ],
      })
    ).toThrow(/companyId/i);
  });

  it("accepts policy_review_required as treatment metadata only", () => {
    const context = parseConsolidationScopeContext({
      ...VALID_WIRE,
      legalEntities: [
        {
          companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FCV",
          consolidationTreatment: "policy_review_required",
          ownershipPercentage: 15,
        },
      ],
    });

    expect(context.legalEntities[0]?.consolidationTreatment).toBe(
      "policy_review_required"
    );
  });
});
