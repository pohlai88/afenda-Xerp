// @vitest-environment jsdom

import { render, screen, setupUser } from "@afenda/testing/react";
import { describe, expect, it, vi } from "vitest";

import { AuthWorkspaceSelection } from "@/components/auth/auth-workspace-selection.client";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
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

describe("AuthWorkspaceSelection interaction", () => {
  it("loads targets and switches context on selection", async () => {
    const user = setupUser();
    mockFetchResolution.mockResolvedValue(resolution());
    mockSwitchContext.mockResolvedValue({ ok: true, data: {} });

    render(<AuthWorkspaceSelection kind="workspace" />);

    expect(
      await screen.findByRole("button", { name: /Acme Corp/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Acme Corp/i }));

    expect(mockSwitchContext).toHaveBeenCalledWith({ companySlug: "acme" });
    expect(mockReplace).toHaveBeenCalledWith(AUTH_PATHS.postAuthComplete);
  });

  it("shows selection error without clearing loaded targets", async () => {
    const user = setupUser();
    mockFetchResolution.mockResolvedValue(resolution());
    mockSwitchContext.mockResolvedValue({
      ok: false,
      userMessage: "Context switch denied.",
    });

    render(<AuthWorkspaceSelection kind="workspace" />);

    await user.click(await screen.findByRole("button", { name: /Acme Corp/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Context switch denied."
    );
    expect(
      screen.getByRole("button", { name: /Beta Corp/i })
    ).not.toBeDisabled();
  });

  it("shows empty state when no targets match the selection kind", async () => {
    mockFetchResolution.mockResolvedValue(
      resolution({
        targets: [
          {
            companySlug: "acme",
            isSelected: false,
            label: "Acme Corp",
          },
        ],
      })
    );

    render(<AuthWorkspaceSelection kind="organization" />);

    expect(
      await screen.findByText(
        "No selectable memberships are available for this account."
      )
    ).toBeInTheDocument();
  });
});
