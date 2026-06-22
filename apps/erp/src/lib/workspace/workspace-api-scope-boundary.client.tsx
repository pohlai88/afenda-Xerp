"use client";

import type { OperatingContextErrorCode } from "@afenda/kernel";
import type { ReactNode } from "react";

import type { WorkspaceApiScope } from "./workspace-api-scope.contract";
import { WorkspaceApiScopeProvider } from "./workspace-api-scope.context";
import { WorkspaceScopeUnavailable } from "./workspace-scope-unavailable.client";

export interface WorkspaceApiScopeBoundaryProps {
  readonly children: ReactNode;
  readonly requireScope?: boolean;
  readonly scope: WorkspaceApiScope | null;
  readonly unavailableReason?: OperatingContextErrorCode | "MISSING_TENANT";
}

/**
 * Injects verified workspace scope into the client tree when resolution succeeds.
 * When `requireScope` is true and scope is null, renders a fail-closed placeholder.
 */
export function WorkspaceApiScopeBoundary({
  children,
  requireScope = false,
  scope,
  unavailableReason = "MISSING_TENANT",
}: WorkspaceApiScopeBoundaryProps) {
  if (scope === null) {
    if (requireScope) {
      return <WorkspaceScopeUnavailable errorCode={unavailableReason} />;
    }

    return children;
  }

  return (
    <WorkspaceApiScopeProvider scope={scope}>{children}</WorkspaceApiScopeProvider>
  );
}
