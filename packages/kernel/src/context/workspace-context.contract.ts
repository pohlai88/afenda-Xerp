/**
 * Derived user-facing operating area — no security authority of its own.
 */
export interface WorkspaceContext {
  readonly companyId: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly tenantId: string;
}
