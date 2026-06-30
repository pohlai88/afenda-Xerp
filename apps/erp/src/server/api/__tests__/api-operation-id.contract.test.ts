import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  API_OPERATION_REGISTRY,
} from "@/server/api/contracts/api-contract-registry";
import {
  API_STYLE_BINDINGS,
  assertUniqueApiOperationIds,
  findRegistryEntryByOperationId,
  getActiveStyleBindings,
  getRegistryOperationIds,
  isValidApiOperationIdFormat,
  parseApiOperationId,
  unbrandApiOperationId,
} from "@/server/api/contracts/core";

describe("ApiOperationId contract", () => {
  it("accepts known internal v1 operation id formats", () => {
    expect(isValidApiOperationIdFormat("internal.v1.health.get")).toBe(true);
    expect(
      isValidApiOperationIdFormat("internal.v1.auth.memberships.get")
    ).toBe(true);
    expect(
      isValidApiOperationIdFormat("internal.v1.workspace.dashboard-layout.put")
    ).toBe(true);
    expect(
      isValidApiOperationIdFormat("internal.v1.system-admin.audit-events.get")
    ).toBe(true);
  });

  it("rejects invalid operation id formats", () => {
    expect(isValidApiOperationIdFormat("")).toBe(false);
    expect(isValidApiOperationIdFormat("HEALTH.GET")).toBe(false);
    expect(isValidApiOperationIdFormat("internal.v1.health")).toBe(false);
    expect(isValidApiOperationIdFormat("internal.v1.health.invalid")).toBe(
      false
    );
  });

  it("brands valid ids at the trust boundary", () => {
    const operationId = parseApiOperationId("internal.v1.health.get");
    expect(unbrandApiOperationId(operationId)).toBe("internal.v1.health.get");
  });

  it("throws when parsing invalid ids", () => {
    expect(() => parseApiOperationId("not-an-id")).toThrow(
      /Invalid ApiOperationId format/
    );
  });

  it("detects duplicate operation ids", () => {
    expect(() =>
      assertUniqueApiOperationIds([
        "internal.v1.health.get",
        "internal.v1.health.get",
      ])
    ).toThrow(/Duplicate ApiOperationId/);
  });
});

describe("API_OPERATION_REGISTRY", () => {
  it("covers every API_CONTRACTS entry with a branded operation id", () => {
    expect(API_OPERATION_REGISTRY).toHaveLength(API_CONTRACTS.length);
    for (const entry of API_OPERATION_REGISTRY) {
      expect(unbrandApiOperationId(entry.operationId)).toBe(entry.contract.id);
    }
  });

  it("assigns REST as the active binding for MVP operations", () => {
    for (const entry of API_OPERATION_REGISTRY) {
      expect(entry.bindings).toEqual([API_STYLE_BINDINGS.rest]);
    }
    expect(getActiveStyleBindings()).toEqual([API_STYLE_BINDINGS.rest]);
  });

  it("finds registry entries by branded operation id", () => {
    const operationId = parseApiOperationId("internal.v1.health.get");
    const entry = findRegistryEntryByOperationId(
      API_OPERATION_REGISTRY,
      operationId
    );
    expect(entry?.contract.id).toBe("internal.v1.health.get");
  });

  it("exposes readonly branded id list without duplicates", () => {
    const ids = getRegistryOperationIds(API_OPERATION_REGISTRY);
    expect(new Set(ids.map(unbrandApiOperationId)).size).toBe(ids.length);
  });
});
