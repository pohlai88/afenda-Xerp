import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  createCanonicalId,
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
  ENTERPRISE_ID_FAMILIES,
  FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
  ID_FAMILIES,
  isCanonicalEnterpriseId,
  parseCanonicalId,
  parseLocaleCode,
  parseTenantHumanReference,
  parseTenantId,
  TENANT_HUMAN_REFERENCE_SCOPES,
  toTenantId,
} from "../identity/index.js";

const kernelRoot = fileURLToPath(new URL("../..", import.meta.url));

describe("PAS-001 Slice B — kernel identity acceptance", () => {
  it("registers 22 enterprise ID families with unique three-letter prefixes", () => {
    expect(ENTERPRISE_ID_FAMILIES).toHaveLength(22);

    const prefixes = ENTERPRISE_ID_FAMILIES.map(
      (family) => ID_FAMILIES[family].prefix
    );
    expect(new Set(prefixes).size).toBe(22);
    expect(prefixes.every((prefix) => /^[a-z]{3}$/.test(prefix))).toBe(true);
  });

  it("round-trips parse and create for every generating enterprise family", () => {
    const generator = createFixtureCanonicalIdBodyGenerator();
    for (const family of ENTERPRISE_ID_FAMILIES) {
      const created = createCanonicalId(family, generator);
      expect(parseCanonicalId(created, family)).toBe(created);
      expect(ID_FAMILIES[family].generates).toBe(true);
    }
  });

  it("keeps primitive codes out of the enterprise ID parser", () => {
    expect(() => parseLocaleCode("en-US")).not.toThrow();
    expect(isCanonicalEnterpriseId("en-US")).toBe(false);
    expect(isCanonicalEnterpriseId("USD")).toBe(false);
  });

  it("classifies tenant human references without minting canonical IDs", () => {
    expect(TENANT_HUMAN_REFERENCE_SCOPES.length).toBeGreaterThan(0);
    expect(parseTenantHumanReference("EMP-000123", "employee")).toBe(
      "EMP-000123"
    );

    const identityDir = join(kernelRoot, "src/identity");
    const tenantHumanSource = join(
      identityDir,
      "tenant-human-reference/tenant-human-reference.contract.ts"
    );
    const source = readFileSync(tenantHumanSource, "utf8");

    expect(source).not.toMatch(/\bcreateEmployeeNo\b/);
    expect(source).not.toMatch(/\ballocateHumanReference\b/);
  });

  it("forbids fiscal platform-floor IDs in the enterprise registry", () => {
    expect(FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS).toEqual([
      "FiscalCalendarId",
      "FiscalPeriodId",
    ]);

    for (const family of ENTERPRISE_ID_FAMILIES) {
      expect(ID_FAMILIES[family].typeName).not.toBe("FiscalCalendarId");
      expect(ID_FAMILIES[family].typeName).not.toBe("FiscalPeriodId");
    }
  });

  it("serializes canonical enterprise IDs as plain strings on the wire", () => {
    const tenantId = parseTenantId(createTestEnterpriseId("tenant"));
    expect(
      JSON.parse(JSON.stringify({ tenantId: toTenantId(tenantId) }))
    ).toEqual({
      tenantId: toTenantId(tenantId),
    });
  });

  it("retires legacy contracts/platform-id* paths", () => {
    const retiredPaths = [
      "src/contracts/platform-id.contract.ts",
      "src/contracts/platform-id-registry.contract.ts",
      "src/contracts/platform-id-boundary.contract.ts",
    ];

    for (const relativePath of retiredPaths) {
      expect(existsSync(join(kernelRoot, relativePath)), relativePath).toBe(
        false
      );
    }
  });
});
