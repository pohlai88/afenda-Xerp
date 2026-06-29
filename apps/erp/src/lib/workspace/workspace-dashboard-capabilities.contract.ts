/** Serializable workspace dashboard layout capabilities from server RBAC. */
export interface WorkspaceDashboardCapabilities {
  readonly canEditLayout: boolean;
}

export const READONLY_WORKSPACE_DASHBOARD_CAPABILITIES = {
  canEditLayout: false,
} satisfies WorkspaceDashboardCapabilities;
