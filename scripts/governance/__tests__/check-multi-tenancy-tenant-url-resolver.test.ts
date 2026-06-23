import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyTenantUrlResolver,
  formatMultiTenancyTenantUrlResolverViolations,
} from "../check-multi-tenancy-tenant-url-resolver.mts";
import {
  MULTI_TENANCY_DOC_TENANT_URL_RESOLVER_MARKERS,
  MULTI_TENANCY_TENANT_URL_RESOLVER_DIMENSIONS,
  MULTI_TENANCY_TENANT_URL_RESOLVER_SURFACE_RULE,
} from "../multi-tenancy-tenant-url-resolver-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-tenant-url-resolver script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyTenantUrlResolver();
    expect(
      violations,
      formatMultiTenancyTenantUrlResolverViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 6 markers from multi-tenancy.md §553–559", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_TENANT_URL_RESOLVER_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines five Step 6 tenant URL resolver dimensions", () => {
    expect(MULTI_TENANCY_TENANT_URL_RESOLVER_DIMENSIONS).toHaveLength(5);
  });

  it("exports the tenant URL resolver surface rule", () => {
    expect(MULTI_TENANCY_TENANT_URL_RESOLVER_SURFACE_RULE).toBe(
      "multi-tenancy-tenant-url-resolver-is-canonical-subdomain-routing-baseline"
    );
  });
});
