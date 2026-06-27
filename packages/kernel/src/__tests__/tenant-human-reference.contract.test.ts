import { describe, expect, it } from "vitest";

import type { EmployeeId, ProductId } from "../identity/families/index.js";
import { parseEmployeeId, parseProductId } from "../identity/families/index.js";
import {
  type CustomerNo,
  type EmployeeNo,
  normalizeEmployeeNoForWire,
  normalizeSkuNoForWire,
  parseCustomerNo,
  parseEmployeeNo,
  parseOptionalSkuNo,
  parseSkuNo,
  parseTenantHumanReference,
  type SkuNo,
  TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS,
  TENANT_HUMAN_REFERENCE_SCOPES,
  type TenantHumanReference,
} from "../identity/tenant-human-reference/tenant-human-reference.contract.js";

type AssertNotEqual<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? never
    : true
  : true;

type _employeeIdIsNotEmployeeNo = AssertNotEqual<EmployeeId, EmployeeNo>;
type _skuNoIsNotProductId = AssertNotEqual<SkuNo, ProductId>;
type _customerNoUsesHumanReferenceBrand =
  TenantHumanReference<"customer"> extends CustomerNo
    ? CustomerNo extends TenantHumanReference<"customer">
      ? true
      : never
    : never;

const typeSeparationChecks: [
  _employeeIdIsNotEmployeeNo,
  _skuNoIsNotProductId,
  _customerNoUsesHumanReferenceBrand,
] = [true, true, true];

void typeSeparationChecks;

describe("tenant-human-reference.contract (ADR-0023)", () => {
  it("defines every governed scope with scoped parsers", () => {
    expect(TENANT_HUMAN_REFERENCE_SCOPES).toEqual([
      "employee",
      "customer",
      "supplier",
      "sku",
      "asset",
      "document",
      "warehouse",
    ]);

    for (const scope of TENANT_HUMAN_REFERENCE_SCOPES) {
      expect(TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS[scope].scope).toBe(scope);
    }
  });

  it("parses human references without canonical enterprise ID validation", () => {
    expect(parseEmployeeNo("EMP-000123")).toBe("EMP-000123");
    expect(parseCustomerNo("CUST-000456")).toBe("CUST-000456");
    expect(parseSkuNo("LETTUCE-ROMAINE-001")).toBe("LETTUCE-ROMAINE-001");
  });

  it("rejects empty human references", () => {
    expect(() => parseEmployeeNo("   ")).toThrow(/Employee No is required/);
    expect(parseOptionalSkuNo(null)).toBeNull();
  });

  it("keeps human references separate from canonical enterprise IDs at runtime", () => {
    expect(() => parseProductId("EMP-000123")).toThrow();
    expect(() => parseEmployeeId("EMP-000123")).toThrow();

    const human = parseEmployeeNo("EMP-000123");
    expect(() => parseEmployeeId(human)).toThrow();
  });

  it("normalizes human references to plain strings for wire/JSON", () => {
    const sku = parseSkuNo("SKU-001");
    expect(normalizeSkuNoForWire(sku)).toBe("SKU-001");
    expect(normalizeEmployeeNoForWire(parseEmployeeNo("EMP-000123"))).toBe(
      "EMP-000123"
    );
    expect(
      JSON.parse(JSON.stringify({ sku: normalizeSkuNoForWire(sku) }))
    ).toEqual({
      sku: "SKU-001",
    });
  });

  it("supports generic parseTenantHumanReference for explicit scopes", () => {
    expect(
      parseTenantHumanReference<"employee">("EMP-000123", "Employee No")
    ).toBe("EMP-000123");
  });
});
