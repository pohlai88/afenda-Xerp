import { describe, expect, it } from "vitest";
import { checkDatabaseTenantRlsCoverage } from "../check-database-tenant-rls-coverage.mts";

describe("check-database-tenant-rls-coverage script", () => {
  it("passes when migrations, registry, and schema parity align", () => {
    expect(checkDatabaseTenantRlsCoverage()).toEqual([]);
  });
});
