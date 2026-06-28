import { describe, expect, it } from "vitest";
import { createTestEnterpriseId } from "../../identity/index.js";

import { assertWireEntityGroupContext } from "../entity-group-context.assert.js";
import type { EntityGroupWireContext } from "../entity-group-context.contract.js";
import {
  normalizeEntityGroupContextForWire,
  parseEntityGroupContext,
  parseUnknownEntityGroupContext,
  serializeEntityGroupContext,
} from "../entity-group-context.parser.js";

const ENTITY_GROUP_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const PARENT_COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

const VALID_WIRE: EntityGroupWireContext = {
  entityGroupId: ENTITY_GROUP_ID,
  tenantId: TENANT_ID,
  slug: "acme-group",
  displayName: "Acme Group",
  parentLegalEntityId: PARENT_COMPANY_ID,
  status: "active",
};

describe("entity group context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseEntityGroupContext(VALID_WIRE);

    expect(normalizeEntityGroupContextForWire(context)).toEqual(VALID_WIRE);
    expect(serializeEntityGroupContext(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownEntityGroupContext", () => {
    const context = parseUnknownEntityGroupContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.entityGroupId}`).toBe(ENTITY_GROUP_ID);
  });

  it("accepts null parentLegalEntityId", () => {
    const wire: EntityGroupWireContext = {
      ...VALID_WIRE,
      parentLegalEntityId: null,
    };

    expect(
      normalizeEntityGroupContextForWire(parseEntityGroupContext(wire))
    ).toEqual(wire);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireEntityGroupContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseEntityGroupContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as EntityGroupWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects invalid slug format before branding", () => {
    expect(() =>
      assertWireEntityGroupContext({
        ...VALID_WIRE,
        slug: "Bad Slug",
      })
    ).toThrow(/slug must use lowercase/i);
  });

  it("rejects invalid entityGroupId family before branding", () => {
    expect(() =>
      parseEntityGroupContext({
        ...VALID_WIRE,
        entityGroupId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/entityGroupId|EntityGroupId/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parseEntityGroupContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId|TenantId/i);
  });

  it("rejects invalid parentLegalEntityId family before branding", () => {
    expect(() =>
      parseEntityGroupContext({
        ...VALID_WIRE,
        parentLegalEntityId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/parentLegalEntityId|CompanyId/i);
  });

  it("rejects whitespace-only displayName before branding", () => {
    expect(() =>
      assertWireEntityGroupContext({
        ...VALID_WIRE,
        displayName: "   ",
      })
    ).toThrow(/displayName is required/i);
  });
});
