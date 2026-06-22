import { describe, expect, it } from "vitest";

import { checkDatabaseTenantDomainSurface } from "../check-database-tenant-domain-surface.mts";

describe("check-database-tenant-domain-surface script", () => {
  it("passes on the current repository state", () => {
    expect(checkDatabaseTenantDomainSurface()).toEqual([]);
  });
});
