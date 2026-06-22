"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { WorkspaceApiScope } from "./workspace-api-scope.contract";

const WorkspaceApiScopeContext = createContext<WorkspaceApiScope | null>(null);

export interface WorkspaceApiScopeProviderProps {
  readonly children: ReactNode;
  readonly scope: WorkspaceApiScope;
}

export function WorkspaceApiScopeProvider({
  children,
  scope,
}: WorkspaceApiScopeProviderProps) {
  const value = useMemo(
    () => scope,
    [
      scope.companyId,
      scope.companySlug,
      scope.organizationId,
      scope.organizationSlug,
      scope.tenantSlug,
      scope.workspaceId,
    ]
  );

  return (
    <WorkspaceApiScopeContext.Provider value={value}>
      {children}
    </WorkspaceApiScopeContext.Provider>
  );
}

export function useWorkspaceApiScope(): WorkspaceApiScope {
  const scope = useContext(WorkspaceApiScopeContext);

  if (scope === null) {
    throw new Error(
      "useWorkspaceApiScope requires WorkspaceApiScopeProvider above the caller."
    );
  }

  return scope;
}

export function useOptionalWorkspaceApiScope(): WorkspaceApiScope | null {
  return useContext(WorkspaceApiScopeContext);
}
