/** Public read model for tenant auth shell branding — ERP-owned render boundary. */
export interface TenantAuthBrand {
  readonly headline: string;
  readonly logoUrl: string | null;
  readonly primaryColor: string;
  readonly productLabel: string;
  readonly supportingText: string;
}
