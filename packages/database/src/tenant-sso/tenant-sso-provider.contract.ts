import { z } from "zod";

export const TENANT_SSO_PROTOCOLS = ["saml", "oidc"] as const;

export type TenantSsoProtocol = (typeof TENANT_SSO_PROTOCOLS)[number];

export const tenantSsoProtocolSchema = z.enum(TENANT_SSO_PROTOCOLS);

/** Single source for OIDC client secret env key field name (M3). */
export const TENANT_SSO_CLIENT_SECRET_ENV_KEY = "clientSecretEnvKey" as const;

export const tenantSsoOidcMetadataSchema = z.object({
  authorizationEndpoint: z.string().url().optional(),
  clientId: z.string().min(1).max(255),
  [TENANT_SSO_CLIENT_SECRET_ENV_KEY]: z.string().min(1).max(128).optional(),
  discoveryEndpoint: z.string().url().optional(),
  jwksEndpoint: z.string().url().optional(),
  pkce: z.boolean().optional(),
  scopes: z.array(z.string().min(1).max(64)).optional(),
  tokenEndpoint: z.string().url().optional(),
});

export type TenantSsoOidcMetadata = z.infer<typeof tenantSsoOidcMetadataSchema>;

const tenantSsoSamlMetadataSchema = z.object({
  callbackUrl: z.string().url().optional(),
  cert: z.string().min(1),
  entryPoint: z.string().url(),
  idpMetadataXml: z.string().max(65_536).optional(),
  spMetadata: z
    .object({
      entityID: z.string().max(512).optional(),
      metadata: z.string().max(65_536).optional(),
    })
    .optional(),
});

export type TenantSsoSamlMetadata = z.infer<typeof tenantSsoSamlMetadataSchema>;

/** Protocol-discriminated metadata parse (M1). */
export function parseTenantSsoProviderMetadata(
  protocol: TenantSsoProtocol,
  value: unknown
): TenantSsoProviderMetadata {
  if (protocol === "oidc") {
    return tenantSsoOidcMetadataSchema.parse(value);
  }

  return tenantSsoSamlMetadataSchema.parse(value);
}

export type TenantSsoProviderMetadata =
  | TenantSsoOidcMetadata
  | TenantSsoSamlMetadata;

export const tenantSsoProviderSummarySchema = z.object({
  displayName: z.string().min(1).max(255),
  domain: z.string().min(1).max(255),
  enabled: z.boolean(),
  id: z.string().uuid(),
  issuer: z.string().url(),
  metadata: z.union([tenantSsoOidcMetadataSchema, tenantSsoSamlMetadataSchema]),
  protocol: tenantSsoProtocolSchema,
  providerId: z.string().min(1).max(128),
  tenantId: z.string().uuid(),
});

export type TenantSsoProviderSummary = z.infer<
  typeof tenantSsoProviderSummarySchema
>;

export const upsertTenantSsoOidcProviderInputSchema = z.object({
  [TENANT_SSO_CLIENT_SECRET_ENV_KEY]: z.string().min(1).max(128).optional(),
  displayName: z.string().min(1).max(255),
  domain: z.string().min(1).max(255),
  enabled: z.boolean().optional(),
  issuer: z.string().url(),
  metadata: tenantSsoOidcMetadataSchema,
  providerId: z.string().min(1).max(128),
  tenantId: z.string().uuid(),
});

export type UpsertTenantSsoOidcProviderInput = z.infer<
  typeof upsertTenantSsoOidcProviderInputSchema
>;

export const setTenantSsoProviderEnabledInputSchema = z.object({
  enabled: z.boolean(),
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
});

export type SetTenantSsoProviderEnabledInput = z.infer<
  typeof setTenantSsoProviderEnabledInputSchema
>;

export const getTenantSsoProviderByIdInputSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
});

export type GetTenantSsoProviderByIdInput = z.infer<
  typeof getTenantSsoProviderByIdInputSchema
>;

export const getTenantSsoProviderByProviderIdInputSchema = z.object({
  providerId: z.string().min(1).max(128),
});

export type GetTenantSsoProviderByProviderIdInput = z.infer<
  typeof getTenantSsoProviderByProviderIdInputSchema
>;

export const getEnabledTenantSsoProviderForTenantDomainInputSchema = z.object({
  domain: z.string().min(1).max(255),
  tenantId: z.string().uuid(),
});

export type GetEnabledTenantSsoProviderForTenantDomainInput = z.infer<
  typeof getEnabledTenantSsoProviderForTenantDomainInputSchema
>;

export function parseTenantSsoOidcMetadata(
  value: unknown
): TenantSsoOidcMetadata {
  return tenantSsoOidcMetadataSchema.parse(value);
}

export function parseTenantSsoSamlMetadata(
  value: unknown
): TenantSsoSamlMetadata {
  return tenantSsoSamlMetadataSchema.parse(value);
}

export const upsertTenantSsoSamlProviderInputSchema = z.object({
  displayName: z.string().min(1).max(255),
  domain: z.string().min(1).max(255),
  enabled: z.boolean().optional(),
  issuer: z.string().url(),
  metadata: tenantSsoSamlMetadataSchema,
  providerId: z.string().min(1).max(128),
  tenantId: z.string().uuid(),
});

export type UpsertTenantSsoSamlProviderInput = z.infer<
  typeof upsertTenantSsoSamlProviderInputSchema
>;

export const rotateTenantSsoOidcClientSecretEnvKeyInputSchema = z.object({
  clientSecretEnvKey: z.string().min(1).max(128),
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
});

export type RotateTenantSsoOidcClientSecretEnvKeyInput = z.infer<
  typeof rotateTenantSsoOidcClientSecretEnvKeyInputSchema
>;

export const rotateTenantSsoSamlCertificateInputSchema = z.object({
  cert: z.string().min(1),
  id: z.string().uuid(),
  idpMetadataXml: z.string().max(65_536).optional(),
  tenantId: z.string().uuid(),
});

export type RotateTenantSsoSamlCertificateInput = z.infer<
  typeof rotateTenantSsoSamlCertificateInputSchema
>;

export function parseTenantSsoProviderSummary(
  value: unknown
): TenantSsoProviderSummary | null {
  const parsed = tenantSsoProviderSummarySchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function toTenantSsoProviderSummary(row: {
  readonly displayName: string;
  readonly domain: string;
  readonly enabled: boolean;
  readonly id: string;
  readonly issuer: string;
  readonly metadata: unknown;
  readonly protocol: TenantSsoProtocol;
  readonly providerId: string;
  readonly tenantId: string;
}): TenantSsoProviderSummary {
  return tenantSsoProviderSummarySchema.parse({
    displayName: row.displayName,
    domain: row.domain,
    enabled: row.enabled,
    id: row.id,
    issuer: row.issuer,
    metadata: parseTenantSsoProviderMetadata(row.protocol, row.metadata),
    protocol: row.protocol,
    providerId: row.providerId,
    tenantId: row.tenantId,
  });
}
