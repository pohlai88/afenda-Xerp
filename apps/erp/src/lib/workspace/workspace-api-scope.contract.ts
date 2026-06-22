/**
 * Serializable workspace scope for browser API clients.
 *
 * Slugs are the stable client-facing identifiers; UUID headers are optional
 * selection hints only. The server always re-resolves via `resolveOperatingContext`.
 */
export interface WorkspaceApiScope {
  readonly companyId?: string | null;
  readonly companySlug?: string | null;
  readonly organizationId?: string | null;
  readonly organizationSlug?: string | null;
  readonly tenantSlug: string;
  readonly workspaceId?: string | null;
}
