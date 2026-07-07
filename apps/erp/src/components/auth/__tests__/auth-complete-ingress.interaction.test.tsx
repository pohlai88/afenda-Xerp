// @vitest-environment jsdom

import { render, screen } from "@afenda/testing/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthCompleteIngressSurface } from "@/components/auth/auth-complete-ingress.client";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";

const mockReplace = vi.fn();
const mockRefresh = vi.fn();
const stableSearchParams = new URLSearchParams("next=%2Fworkspace");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
  useSearchParams: () => stableSearchParams,
}));

const mockFetchResolution = vi.fn();
const mockPersistTarget = vi.fn();

vi.mock("@/lib/auth/auth-membership-resolution.client", () => ({
  fetchAuthMembershipResolution: () => mockFetchResolution(),
}));

vi.mock("@/lib/auth/auth-membership-switch.helpers", () => ({
  persistAuthMembershipTarget: (target: unknown) => mockPersistTarget(target),
}));

function readyIngressData(): AuthIngressSurfacePageData {
  return {
    authShellBlockId: "login-page-03",
    description:
      "Resolve workspace access before continuing to your destination.",
    kind: "ready",
    lane: "workspace",
    path: AUTH_PATHS.postAuthComplete,
    surface: {
      slotHydration: {
        blockId: "login-page-03",
        slotTargets: [],
      },
      surfaceTemplate: {
        surfaceTemplateId: "surface-template.auth-workspace-select",
      },
    },
    title: "Completing sign-in",
  };
}

describe("AuthCompleteIngressSurface interaction", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockRefresh.mockReset();
    mockFetchResolution.mockReset();
    mockPersistTarget.mockReset();
  });

  it("persists a single target and navigates to a safe next path", async () => {
    mockFetchResolution.mockResolvedValue({
      activeMembershipCount: 1,
      entryPath: "/",
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      targets: [
        {
          companySlug: "acme",
          isSelected: false,
          label: "Acme Corp",
        },
      ],
      workspaceTargetCount: 1,
    });
    mockPersistTarget.mockResolvedValue(undefined);

    render(<AuthCompleteIngressSurface data={readyIngressData()} />);

    expect(
      await screen.findByRole("heading", { name: /Completing sign-in/i })
    ).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(mockPersistTarget).toHaveBeenCalledWith({
        companySlug: "acme",
        isSelected: false,
        label: "Acme Corp",
      });
      expect(mockReplace).toHaveBeenCalledWith("/workspace");
    });
  });

  it("re-enters the post-auth spine when workspace selection is required", async () => {
    mockFetchResolution.mockResolvedValue({
      activeMembershipCount: 2,
      entryPath: AUTH_PATHS.workspaceSelect,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: true,
      targets: [],
      workspaceTargetCount: 2,
    });

    render(<AuthCompleteIngressSurface data={readyIngressData()} />);

    await vi.waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(AUTH_PATHS.workspaceSelect);
    });
    expect(mockPersistTarget).not.toHaveBeenCalled();
  });

  it("surfaces resolution fetch failure in the auth shell error state", async () => {
    mockFetchResolution.mockRejectedValue(
      new Error("Membership resolution unavailable.")
    );

    render(<AuthCompleteIngressSurface data={readyIngressData()} />);

    expect(
      await screen.findByText(/Membership resolution unavailable/i)
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPersistTarget).not.toHaveBeenCalled();
  });
});
