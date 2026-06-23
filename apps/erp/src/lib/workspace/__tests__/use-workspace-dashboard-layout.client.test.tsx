import { DEFAULT_DASHBOARD_LAYOUT } from "@afenda/appshell";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  ApiClientRequestError,
  ApiPolicyGateError,
} from "@/lib/api/api-policy-gate.error";
import {
  fetchWorkspaceDashboardLayout,
  saveWorkspaceDashboardLayout,
} from "@/lib/api/dashboard-layout.client";
import { DEV_WORKSPACE_API_SCOPE } from "@/lib/workspace/dev-workspace-scope";
import { useWorkspaceDashboardLayout } from "@/lib/workspace/use-workspace-dashboard-layout.client";

vi.mock("@/lib/api/dashboard-layout.client", () => ({
  fetchWorkspaceDashboardLayout: vi.fn(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "default",
    updatedAt: null,
  })),
  resetWorkspaceDashboardLayoutApi: vi.fn(),
  saveWorkspaceDashboardLayout: vi.fn(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "stored",
    updatedAt: "2026-06-22T12:00:00.000Z",
  })),
}));

const ALT_DASHBOARD_LAYOUT = {
  ...DEFAULT_DASHBOARD_LAYOUT,
  items: DEFAULT_DASHBOARD_LAYOUT.items.slice(0, 3),
};

describe("useWorkspaceDashboardLayout", () => {
  it("routes policy-gated PUT denials to the dialog handler and rolls back layout", async () => {
    const handleApiError = vi.fn(() => true);
    vi.mocked(saveWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiPolicyGateError({
        gateDecision: "require_approval",
        correlationId: "corr-layout-put-gate",
        message: "Policy requires approval.",
      })
    );

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        handleApiError,
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.saveLayout(ALT_DASHBOARD_LAYOUT);
    });

    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(ApiPolicyGateError),
      { variant: "dialog" }
    );
    expect(result.current.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.current.errorMessage).toBeNull();
  });

  it("surfaces plain forbidden PUT denials inline and rolls back layout", async () => {
    const handleApiError = vi.fn(() => false);
    vi.mocked(saveWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiClientRequestError({
        code: "forbidden",
        correlationId: "corr-layout-put-deny",
        message: "Permission denied.",
      })
    );

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        handleApiError,
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.saveLayout(ALT_DASHBOARD_LAYOUT);
    });

    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(ApiClientRequestError),
      { variant: "dialog" }
    );
    expect(handleApiError).toHaveReturnedWith(false);
    expect(result.current.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.current.errorMessage).toBe("Permission denied.");
  });

  it("loads the persisted layout on mount", async () => {
    vi.mocked(fetchWorkspaceDashboardLayout).mockResolvedValueOnce({
      layout: ALT_DASHBOARD_LAYOUT,
      source: "stored",
      updatedAt: "2026-06-22T10:00:00.000Z",
    });

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.layout).toEqual(ALT_DASHBOARD_LAYOUT);
    expect(result.current.updatedAt).toBe("2026-06-22T10:00:00.000Z");
    expect(result.current.canPersistLayout).toBe(true);
    expect(result.current.layoutLoadFallback).toBeNull();
  });

  it("falls back to default layout on unauthenticated GET when dev fallback is enabled", async () => {
    vi.mocked(fetchWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiClientRequestError({
        code: "unauthenticated",
        correlationId: "corr-layout-get-401",
        message: "Authentication is required.",
      })
    );

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        useDefaultLayoutOnUnauthenticated: true,
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.canPersistLayout).toBe(false);
    expect(result.current.layoutLoadFallback).toBe("unauthenticated");
  });

  it("routes policy-gated GET denials to the inline handler and keeps default layout", async () => {
    const handleApiError = vi.fn(() => true);
    vi.mocked(fetchWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiPolicyGateError({
        gateDecision: "require_approval",
        correlationId: "corr-layout-get-gate",
        message: "Policy requires approval to read layout.",
      })
    );

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        handleApiError,
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(ApiPolicyGateError),
      { variant: "inline" }
    );
    expect(result.current.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.current.canPersistLayout).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it("surfaces plain forbidden GET denials inline on protected home", async () => {
    const handleApiError = vi.fn(() => false);
    vi.mocked(fetchWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiClientRequestError({
        code: "forbidden",
        correlationId: "corr-layout-get-deny",
        message: "Permission denied.",
      })
    );

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        handleApiError,
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(ApiClientRequestError),
      { variant: "inline" }
    );
    expect(result.current.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.current.canPersistLayout).toBe(false);
    expect(result.current.errorMessage).toBe("Permission denied.");
  });

  it("applies local-only layout changes when persistence is unavailable", async () => {
    vi.mocked(fetchWorkspaceDashboardLayout).mockRejectedValue(
      new ApiClientRequestError({
        code: "unauthenticated",
        correlationId: "corr-layout-get-401",
        message: "Authentication is required.",
      })
    );
    vi.mocked(saveWorkspaceDashboardLayout).mockClear();

    const { result } = renderHook(() =>
      useWorkspaceDashboardLayout({
        useDefaultLayoutOnUnauthenticated: true,
        workspaceScope: DEV_WORKSPACE_API_SCOPE,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.saveLayout(ALT_DASHBOARD_LAYOUT);
    });

    expect(result.current.layout).toEqual(ALT_DASHBOARD_LAYOUT);
    expect(saveWorkspaceDashboardLayout).not.toHaveBeenCalled();
  });
});
