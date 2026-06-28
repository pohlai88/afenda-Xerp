import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { assertWireTenantContext } from "../tenant-context.assert.js";
import type { TenantWireContext } from "../tenant-context.contract.js";
import {
  normalizeTenantContextForWire,
  parseTenantContext,
  parseUnknownTenantContext,
  serializeTenantContext,
} from "../tenant-context.parser.js";

const TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

const VALID_WIRE: TenantWireContext = {
  tenantId: TENANT_ID,
  slug: "acme",
  displayName: "Acme",
  status: "active",
};

describe("tenant context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseTenantContext(VALID_WIRE);

    expect(normalizeTenantContextForWire(context)).toEqual(VALID_WIRE);
    expect(serializeTenantContext(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownTenantContext", () => {
    const context = parseUnknownTenantContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.tenantId}`).toBe(TENANT_ID);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireTenantContext(null)).toThrow(/must be an object/i);
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseTenantContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as TenantWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects invalid slug format before branding", () => {
    expect(() =>
      assertWireTenantContext({
        ...VALID_WIRE,
        slug: "Bad Slug",
      })
    ).toThrow(/slug must use lowercase/i);
  });

  it("rejects invalid tenantId family before branding", () => {
    expect(() =>
      parseTenantContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId|TenantId/i);
  });

  it("rejects uuid tenantId before branding", () => {
    expect(() =>
      parseTenantContext({
        ...VALID_WIRE,
        tenantId: "550e8400-e29b-41d4-a716-446655440000",
      })
    ).toThrow(/tenantId|TenantId/i);
  });

  it("rejects whitespace-only displayName before branding", () => {
    expect(() =>
      assertWireTenantContext({
        ...VALID_WIRE,
        displayName: "   ",
      })
    ).toThrow(/displayName is required/i);
  });
});
