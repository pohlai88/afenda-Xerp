import { resolveSignInProviderSurface } from "@afenda/auth";
import { buildDefaultTenantOAuthSettings } from "@afenda/database";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mergeTenantSignInSurface } from "../merge-tenant-sign-in-surface";

const databaseMocks = vi.hoisted(() => ({
  findTenantBySlug: vi.fn(),
  getTenantSettingsByTenantId: vi.fn(),
  listTenantSsoProvidersByTenantId: vi.fn(),
}));

const tenantRoutingMocks = vi.hoisted(() => ({
  readTenantRoutingHeaders: vi.fn(),
}));

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();

  return {
    ...actual,
    findTenantBySlug: databaseMocks.findTenantBySlug,
    getTenantSettingsByTenantId: databaseMocks.getTenantSettingsByTenantId,
    listTenantSsoProvidersByTenantId:
      databaseMocks.listTenantSsoProvidersByTenantId,
  };
});

vi.mock("@/lib/context/tenant-domain.server", () => tenantRoutingMocks);

describe("resolveSignInSurface", () => {
  beforeEach(() => {
    databaseMocks.findTenantBySlug.mockReset();
    databaseMocks.getTenantSettingsByTenantId.mockReset();
    databaseMocks.listTenantSsoProvidersByTenantId.mockReset();
    tenantRoutingMocks.readTenantRoutingHeaders.mockReset();
    vi.resetModules();
  });

  it("returns platform surface on apex requests without tenant slug", async () => {
    tenantRoutingMocks.readTenantRoutingHeaders.mockResolvedValue({
      organizationSlugPathHint: null,
      tenantSlug: null,
    });

    const { resolveSignInSurface } = await import(
      "../resolve-sign-in-surface.server"
    );

    await expect(resolveSignInSurface()).resolves.toEqual(
      resolveSignInProviderSurface(process.env)
    );
  });

  it("merges tenant OAuth and SSO toggles for tenant-scoped sign-in", async () => {
    tenantRoutingMocks.readTenantRoutingHeaders.mockResolvedValue({
      organizationSlugPathHint: null,
      tenantSlug: "demo-org",
    });
    databaseMocks.findTenantBySlug.mockResolvedValue({
      id: "tenant_1",
      status: "active",
    });

    const tenantOAuth = buildDefaultTenantOAuthSettings();
    tenantOAuth.providers.github.enabled = true;

    databaseMocks.getTenantSettingsByTenantId.mockResolvedValue({
      integrations: { oauth: tenantOAuth },
    });
    databaseMocks.listTenantSsoProvidersByTenantId.mockResolvedValue([
      { enabled: true, id: "sso_1" },
    ]);

    const { resolveSignInSurface } = await import(
      "../resolve-sign-in-surface.server"
    );

    const platform = resolveSignInProviderSurface(process.env);

    await expect(resolveSignInSurface()).resolves.toEqual(
      mergeTenantSignInSurface(platform, tenantOAuth, 1)
    );
  });
});
