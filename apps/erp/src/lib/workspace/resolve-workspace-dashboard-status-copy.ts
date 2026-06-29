import type { WorkspaceDashboardLayoutLoadFallback } from "@/lib/workspace/workspace-dashboard-layout.contract";
import { WORKSPACE_HOME_COPY } from "@/lib/workspace/workspace-home.copy.contract";

export type WorkspaceDashboardStatusCopyInput =
  | { readonly kind: "default" }
  | {
      readonly fallback: WorkspaceDashboardLayoutLoadFallback;
      readonly kind: "fallback";
    }
  | { readonly kind: "loading" }
  | { readonly kind: "saved"; readonly updatedAt: string };

export interface WorkspaceDashboardStatusCopy {
  readonly screenReader?: string;
  readonly statusLine: string;
}

export function resolveWorkspaceDashboardStatusCopy(
  input: WorkspaceDashboardStatusCopyInput
): WorkspaceDashboardStatusCopy {
  switch (input.kind) {
    case "loading":
      return {
        statusLine: WORKSPACE_HOME_COPY.dashboard.status.loading,
        screenReader: WORKSPACE_HOME_COPY.dashboard.loadingScreenReader,
      };
    case "default":
      return {
        statusLine: WORKSPACE_HOME_COPY.dashboard.status.default,
      };
    case "fallback":
      return resolveFallbackStatusCopy(input.fallback);
    case "saved":
      return {
        statusLine: `${WORKSPACE_HOME_COPY.dashboard.status.savedPrefix} ${input.updatedAt}`,
      };
    default: {
      const _exhaustive: never = input;
      return _exhaustive;
    }
  }
}

function resolveFallbackStatusCopy(
  fallback: WorkspaceDashboardLayoutLoadFallback
): WorkspaceDashboardStatusCopy {
  switch (fallback) {
    case "unauthenticated":
      return {
        statusLine:
          WORKSPACE_HOME_COPY.dashboard.status.fallbackUnauthenticated,
      };
    default: {
      const _exhaustive: never = fallback;
      return _exhaustive;
    }
  }
}

function resolveLoadedStatusCopyInput(input: {
  readonly layoutLoadFallback: WorkspaceDashboardLayoutLoadFallback | null;
  readonly updatedAt: string | null;
}): WorkspaceDashboardStatusCopyInput {
  if (input.layoutLoadFallback !== null) {
    return { kind: "fallback", fallback: input.layoutLoadFallback };
  }

  if (input.updatedAt === null) {
    return { kind: "default" };
  }

  return { kind: "saved", updatedAt: input.updatedAt };
}

export function resolveWorkspaceDashboardLoadedStatusCopy(input: {
  readonly layoutLoadFallback: WorkspaceDashboardLayoutLoadFallback | null;
  readonly updatedAt: string | null;
}): WorkspaceDashboardStatusCopy {
  return resolveWorkspaceDashboardStatusCopy(
    resolveLoadedStatusCopyInput(input)
  );
}
