import { beforeEach, describe, expect, it, vi } from "vitest";

import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";

const { headersMock, readWorkspaceSelectionCookiesMock } = vi.hoisted(() => ({
  headersMock: vi.fn(async () => new Headers()),
  readWorkspaceSelectionCookiesMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("@/lib/context/workspace-selection-cookies.server", () => ({
  readWorkspaceSelectionCookies: readWorkspaceSelectionCookiesMock,
}));

import { buildOperatingContextSelectionFromRequest } from "@/lib/context/tenant-domain.server";

describe("buildOperatingContextSelectionFromRequest", () => {
  beforeEach(() => {
    headersMock.mockReset();
    headersMock.mockResolvedValue(new Headers());
    readWorkspaceSelectionCookiesMock.mockReset();
    readWorkspaceSelectionCookiesMock.mockResolvedValue({
      companySlug: null,
      organizationSlug: null,
    });
  });

  it("returns tenant slug missing when routing header is absent", async () => {
    const result = await buildOperatingContextSelectionFromRequest();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TENANT_NOT_FOUND");
    }
  });

  it("applies session activeWorkspaceId when slug hints are absent", async () => {
    const requestHeaders = new Headers();
    requestHeaders.set(TENANT_SLUG_HEADER, "dev-local");
    headersMock.mockResolvedValue(requestHeaders);

    const result = await buildOperatingContextSelectionFromRequest({
      activeWorkspaceId: "tenant-001:company-001:org-001",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.selection).toEqual(
        expect.objectContaining({
          tenantSlug: "dev-local",
          companySlug: null,
          companyId: "company-001",
          organizationSlug: null,
          organizationId: "org-001",
        })
      );
    }
  });

  it("prefers cookie slug hints over session activeWorkspaceId", async () => {
    const requestHeaders = new Headers();
    requestHeaders.set(TENANT_SLUG_HEADER, "dev-local");
    headersMock.mockResolvedValue(requestHeaders);
    readWorkspaceSelectionCookiesMock.mockResolvedValue({
      companySlug: "dev-company",
      organizationSlug: "dev-hq",
    });

    const result = await buildOperatingContextSelectionFromRequest({
      activeWorkspaceId: "tenant-001:company-other:org-other",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.selection.companySlug).toBe("dev-company");
      expect(result.selection.organizationSlug).toBe("dev-hq");
      expect(result.selection.companyId).toBeNull();
      expect(result.selection.organizationId).toBeNull();
    }
  });
});
