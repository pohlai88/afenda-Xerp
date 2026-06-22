import { describe, expect, it } from "vitest";

import {
  isReservedTenantSubdomain,
  RESERVED_TENANT_SUBDOMAINS,
} from "@/lib/context/context.constants";
import {
  resolveOrganizationSlugFromPathname,
  resolveTenantSlugFromHostname,
  resolveTenantSlugFromPathname,
  resolveTenantSlugFromRequest,
  resolveWorkspacePathRouting,
} from "@/lib/context/tenant-domain";

describe("tenant domain resolution", () => {
  it("resolves tenant slug from production subdomain", () => {
    expect(
      resolveTenantSlugFromHostname("acme-corp.afenda.app", {
        baseDomain: "afenda.app",
      })
    ).toBe("acme-corp");
  });

  it("resolves tenant slug from localhost subdomain", () => {
    expect(resolveTenantSlugFromHostname("dev-local.localhost")).toBe(
      "dev-local"
    );
  });

  it("rejects reserved subdomains", () => {
    for (const reserved of RESERVED_TENANT_SUBDOMAINS) {
      expect(isReservedTenantSubdomain(reserved)).toBe(true);
      expect(
        resolveTenantSlugFromHostname(`${reserved}.afenda.app`)
      ).toBeNull();
    }
  });

  it("does not treat apex host as tenant slug", () => {
    expect(resolveTenantSlugFromHostname("afenda.app")).toBeNull();
    expect(resolveTenantSlugFromHostname("localhost")).toBeNull();
  });

  it("resolves tenant slug from /t/{slug} fallback path", () => {
    expect(resolveTenantSlugFromPathname("/t/dev-local/dashboard")).toBe(
      "dev-local"
    );
    expect(resolveTenantSlugFromPathname("/dashboard")).toBeNull();
  });

  it("resolves organization slug from /o/{slug} path without tenant authority", () => {
    expect(resolveOrganizationSlugFromPathname("/o/dev-hq/inventory")).toBe(
      "dev-hq"
    );
    expect(resolveOrganizationSlugFromPathname("/inventory")).toBeNull();
  });

  it("strips /t and /o prefixes for internal routing", () => {
    expect(resolveWorkspacePathRouting("/t/acme/o/dev-hq/dashboard")).toEqual({
      pathname: "/dashboard",
      tenantSlugFromPath: "acme",
      organizationSlugHint: "dev-hq",
    });

    expect(resolveWorkspacePathRouting("/t/acme")).toEqual({
      pathname: "/",
      tenantSlugFromPath: "acme",
      organizationSlugHint: null,
    });

    expect(resolveWorkspacePathRouting("/o/dev-hq")).toEqual({
      pathname: "/",
      organizationSlugHint: "dev-hq",
      tenantSlugFromPath: null,
    });
  });

  it("prefers hostname over path when both are present", () => {
    expect(
      resolveTenantSlugFromRequest({
        hostname: "preview.afenda.app",
        pathname: "/t/dev-local/dashboard",
      })
    ).toBe("preview");
  });

  it("normalizes invalid slug candidates to null", () => {
    expect(resolveTenantSlugFromPathname("/t/INVALID_SLUG")).toBeNull();
    expect(resolveTenantSlugFromPathname("/t/www")).toBeNull();
    expect(resolveOrganizationSlugFromPathname("/o/INVALID_SLUG")).toBeNull();
  });
});
