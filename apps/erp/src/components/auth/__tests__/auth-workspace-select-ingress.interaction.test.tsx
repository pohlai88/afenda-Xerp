// @vitest-environment jsdom

import { render, screen, setupUser } from "@afenda/testing/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthWorkspaceSelectIngressSurface } from "@/components/auth/auth-workspace-select-ingress.client";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";
import type { AuthMembershipsGetResponseDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

const mockReplace = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

const mockFetchResolution = vi.fn();
const mockSwitchContext = vi.fn();

vi.mock("@/lib/auth/auth-membership-resolution.client", () => ({
  fetchAuthMembershipResolution: () => mockFetchResolution(),
}));

vi.mock("@/lib/context/context-switch.action", () => ({
  switchOperatingContextAction: (input: unknown) => mockSwitchContext(input),
}));

function readyData(): Extract<AuthIngressSurfacePageData, { kind: "ready" }> {
  return {
    authShellBlockId: "login-page-03",
    description: "Choose the workspace scope for this sign-in session.",
    kind: "ready",
    lane: "workspace",
    path: AUTH_PATHS.workspaceSelect,
    surface: {
      slotHydration: { bindings: [] },
      surfaceTemplate: {
        surfaceTemplateId: "surface-template.auth-workspace-select",
      },
    } as Extract<AuthIngressSurfacePageData, { kind: "ready" }>["surface"],
    title: "Select workspace",
  };
}

function resolution(
  overrides: Partial<AuthMembershipsGetResponseDto> = {}
): AuthMembershipsGetResponseDto {
  return {
    activeMembershipCount: 2,
    entryPath: AUTH_PATHS.workspaceSelect,
    requiresOrganizationSelect: false,
    requiresWorkspaceSelect: true,
    targets: [
      {
        companySlug: "acme",
        isSelected: false,
        label: "Acme Corp",
      },
      {
        companySlug: "beta",
        isSelected: false,
        label: "Beta Corp",
      },
    ],
    workspaceTargetCount: 2,
    ...overrides,
  };
}

function organizationReadyData(): Extract<
  AuthIngressSurfacePageData,
  { kind: "ready" }
> {
  return {
    ...readyData(),
    description: "Choose the organization scope for this sign-in session.",
    path: AUTH_PATHS.organizationSelect,
    title: "Select organization",
  };
}

function organizationResolution(): AuthMembershipsGetResponseDto {
  return resolution({
    activeMembershipCount: 1,
    entryPath: AUTH_PATHS.organizationSelect,
    requiresOrganizationSelect: true,
    requiresWorkspaceSelect: false,
    targets: [
      {
        companySlug: "acme",
        isSelected: false,
        label: "Acme — Finance",
        organizationSlug: "finance",
      },
      {
        companySlug: "acme",
        isSelected: false,
        label: "Acme — Ops",
        organizationSlug: "ops",
      },
    ],
    workspaceTargetCount: 2,
  });
}

describe("AuthWorkspaceSelectIngressSurface interaction", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads targets and switches context on selection", async () => {
    const user = setupUser();
    mockFetchResolution.mockResolvedValue(resolution());
    mockSwitchContext.mockResolvedValue({ ok: true, data: {} });

    render(
      <AuthWorkspaceSelectIngressSurface data={readyData()} kind="workspace" />
    );

    expect(
      await screen.findByRole("button", { name: /Acme Corp/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Acme Corp/i }));

    expect(mockSwitchContext).toHaveBeenCalledWith({ companySlug: "acme" });
    expect(mockReplace).toHaveBeenCalledWith(AUTH_PATHS.postAuthComplete);
  });

  it("does not navigate when context switch fails", async () => {
    const user = setupUser();
    mockFetchResolution.mockResolvedValue(resolution());
    mockSwitchContext.mockResolvedValue({
      ok: false,
      userMessage: "Context switch denied.",
    });

    render(
      <AuthWorkspaceSelectIngressSurface data={readyData()} kind="workspace" />
    );

    await user.click(await screen.findByRole("button", { name: /Acme Corp/i }));

    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByText(/Context switch denied/i)).toBeInTheDocument();
  });

  it("loads organization targets and switches context on selection", async () => {
    const user = setupUser();
    mockFetchResolution.mockResolvedValue(organizationResolution());
    mockSwitchContext.mockResolvedValue({ ok: true, data: {} });

    render(
      <AuthWorkspaceSelectIngressSurface
        data={organizationReadyData()}
        kind="organization"
      />
    );

    expect(
      await screen.findByRole("heading", { name: /Select organization/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Beta Corp/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Acme — Finance/i }));

    expect(mockSwitchContext).toHaveBeenCalledWith({
      companySlug: "acme",
      organizationSlug: "finance",
    });
    expect(mockReplace).toHaveBeenCalledWith(AUTH_PATHS.postAuthComplete);
  });
});
