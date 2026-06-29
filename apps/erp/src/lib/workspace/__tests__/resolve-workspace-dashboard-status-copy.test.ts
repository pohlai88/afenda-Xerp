import { describe, expect, it } from "vitest";

import {
  resolveWorkspaceDashboardLoadedStatusCopy,
  resolveWorkspaceDashboardStatusCopy,
} from "@/lib/workspace/resolve-workspace-dashboard-status-copy";
import { WORKSPACE_HOME_COPY } from "@/lib/workspace/workspace-home.copy.contract";

describe("resolveWorkspaceDashboardStatusCopy", () => {
  it("returns loading copy with screen reader text", () => {
    expect(resolveWorkspaceDashboardStatusCopy({ kind: "loading" })).toEqual({
      statusLine: WORKSPACE_HOME_COPY.dashboard.status.loading,
      screenReader: WORKSPACE_HOME_COPY.dashboard.loadingScreenReader,
    });
  });

  it("returns default layout copy", () => {
    expect(resolveWorkspaceDashboardStatusCopy({ kind: "default" })).toEqual({
      statusLine: WORKSPACE_HOME_COPY.dashboard.status.default,
    });
  });

  it("returns saved layout copy with updatedAt", () => {
    expect(
      resolveWorkspaceDashboardStatusCopy({
        kind: "saved",
        updatedAt: "2026-06-24T12:00:00.000Z",
      })
    ).toEqual({
      statusLine: `${WORKSPACE_HOME_COPY.dashboard.status.savedPrefix} 2026-06-24T12:00:00.000Z`,
    });
  });

  it("returns unauthenticated fallback copy", () => {
    expect(
      resolveWorkspaceDashboardStatusCopy({
        kind: "fallback",
        fallback: "unauthenticated",
      })
    ).toEqual({
      statusLine: WORKSPACE_HOME_COPY.dashboard.status.fallbackUnauthenticated,
    });
  });

  it("returns loaded status copy from layout state", () => {
    expect(
      resolveWorkspaceDashboardLoadedStatusCopy({
        layoutLoadFallback: null,
        updatedAt: null,
      })
    ).toEqual({
      statusLine: WORKSPACE_HOME_COPY.dashboard.status.default,
    });
  });
});
