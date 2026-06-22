"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
  READONLY_WORKSPACE_DASHBOARD_CAPABILITIES,
  type WorkspaceDashboardCapabilities,
} from "./workspace-dashboard-capabilities.contract";

const WorkspaceDashboardCapabilitiesContext =
  createContext<WorkspaceDashboardCapabilities>(
    READONLY_WORKSPACE_DASHBOARD_CAPABILITIES
  );

export interface WorkspaceDashboardCapabilitiesProviderProps {
  readonly children: ReactNode;
  readonly value: WorkspaceDashboardCapabilities;
}

export function WorkspaceDashboardCapabilitiesProvider({
  children,
  value,
}: WorkspaceDashboardCapabilitiesProviderProps) {
  return (
    <WorkspaceDashboardCapabilitiesContext.Provider value={value}>
      {children}
    </WorkspaceDashboardCapabilitiesContext.Provider>
  );
}

export function useWorkspaceDashboardCapabilities(): WorkspaceDashboardCapabilities {
  return useContext(WorkspaceDashboardCapabilitiesContext);
}
