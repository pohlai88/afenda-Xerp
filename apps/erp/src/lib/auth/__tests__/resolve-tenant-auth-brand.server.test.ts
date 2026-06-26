import { beforeEach, describe, expect, it, vi } from "vitest";

const findTenantBySlug = vi.fn();
const getTenantSettingsByTenantId = vi.fn();
const resolvePostAuthTenantSlug = vi.fn();
const resolveObjectStorageService = vi.fn();

vi.mock("@afenda/database", () => ({
  findTenantBySlug,
  getTenantSettingsByTenantId,
}));

vi.mock("@/lib/auth/resolve-post-auth-tenant-slug.server", () => ({
  resolvePostAuthTenantSlug,
}));

vi.mock("@/lib/storage/resolve-object-storage-service.server", () => ({
  resolveObjectStorageService,
}));

describe("resolveTenantAuthBrand", () => {
  beforeEach(() => {
    vi.resetModules();
    findTenantBySlug.mockReset();
    getTenantSettingsByTenantId.mockReset();
    resolvePostAuthTenantSlug.mockReset();
    resolveObjectStorageService.mockReset();
  });

  it("returns null when tenant slug is absent", async () => {
    resolvePostAuthTenantSlug.mockResolvedValue(null);

    const { resolveTenantAuthBrand } = await import(
      "../resolve-tenant-auth-brand.server"
    );

    await expect(resolveTenantAuthBrand()).resolves.toBeNull();
  });

  it("returns null when tenant is not active", async () => {
    resolvePostAuthTenantSlug.mockResolvedValue("acme");
    findTenantBySlug.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      status: "suspended",
    });

    const { resolveTenantAuthBrand } = await import(
      "../resolve-tenant-auth-brand.server"
    );

    await expect(resolveTenantAuthBrand()).resolves.toBeNull();
  });

  it("returns null when appearance is disabled", async () => {
    resolvePostAuthTenantSlug.mockResolvedValue("acme");
    findTenantBySlug.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      status: "active",
    });
    getTenantSettingsByTenantId.mockResolvedValue({
      appearance: {
        enabled: false,
        headline: "Hello",
        logoObjectId: null,
        primaryColor: "#112233",
        productLabel: "Acme",
        supportingText: "Welcome",
      },
    });

    const { resolveTenantAuthBrand } = await import(
      "../resolve-tenant-auth-brand.server"
    );

    await expect(resolveTenantAuthBrand()).resolves.toBeNull();
  });

  it("returns branded copy with null logo when download fails", async () => {
    resolvePostAuthTenantSlug.mockResolvedValue("acme");
    findTenantBySlug.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      status: "active",
    });
    getTenantSettingsByTenantId.mockResolvedValue({
      appearance: {
        enabled: true,
        headline: "Hello",
        logoObjectId: "550e8400-e29b-41d4-a716-446655440000",
        primaryColor: "#112233",
        productLabel: "Acme",
        supportingText: "Welcome",
      },
    });
    resolveObjectStorageService.mockReturnValue({
      generateDownloadUrl: vi.fn().mockResolvedValue({
        status: "not_found",
        error: { code: "not_found", message: "missing" },
      }),
    });

    const { resolveTenantAuthBrand } = await import(
      "../resolve-tenant-auth-brand.server"
    );

    await expect(resolveTenantAuthBrand()).resolves.toEqual({
      headline: "Hello",
      logoUrl: null,
      primaryColor: "#112233",
      productLabel: "Acme",
      supportingText: "Welcome",
    });
  });

  it("returns null when tenant settings query fails", async () => {
    resolvePostAuthTenantSlug.mockResolvedValue("acme");
    findTenantBySlug.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      status: "active",
    });
    getTenantSettingsByTenantId.mockRejectedValue(
      new Error('column "appearance" does not exist')
    );

    const { resolveTenantAuthBrand } = await import(
      "../resolve-tenant-auth-brand.server"
    );

    await expect(resolveTenantAuthBrand()).resolves.toBeNull();
  });

  it("resolves logoUrl when storage download succeeds", async () => {
    resolvePostAuthTenantSlug.mockResolvedValue("acme");
    findTenantBySlug.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      status: "active",
    });
    getTenantSettingsByTenantId.mockResolvedValue({
      appearance: {
        enabled: true,
        headline: "Hello",
        logoObjectId: "550e8400-e29b-41d4-a716-446655440000",
        primaryColor: "#112233",
        productLabel: "Acme",
        supportingText: "Welcome",
      },
    });
    resolveObjectStorageService.mockReturnValue({
      generateDownloadUrl: vi.fn().mockResolvedValue({
        status: "success",
        value: { url: "https://storage.example/logo.png" },
      }),
    });

    const { resolveTenantAuthBrand } = await import(
      "../resolve-tenant-auth-brand.server"
    );

    await expect(resolveTenantAuthBrand()).resolves.toEqual({
      headline: "Hello",
      logoUrl: "https://storage.example/logo.png",
      primaryColor: "#112233",
      productLabel: "Acme",
      supportingText: "Welcome",
    });
  });
});
