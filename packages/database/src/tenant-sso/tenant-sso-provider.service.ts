import { and, eq } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { tenantSsoProviders } from "../schema/tenant-sso-provider.schema.js";
import {
  type GetEnabledTenantSsoProviderForTenantDomainInput,
  type GetTenantSsoProviderByIdInput,
  type GetTenantSsoProviderByProviderIdInput,
  getEnabledTenantSsoProviderForTenantDomainInputSchema,
  getTenantSsoProviderByIdInputSchema,
  getTenantSsoProviderByProviderIdInputSchema,
  parseTenantSsoOidcMetadata,
  parseTenantSsoSamlMetadata,
  type RotateTenantSsoOidcClientSecretEnvKeyInput,
  type RotateTenantSsoSamlCertificateInput,
  rotateTenantSsoOidcClientSecretEnvKeyInputSchema,
  rotateTenantSsoSamlCertificateInputSchema,
  type SetTenantSsoProviderEnabledInput,
  setTenantSsoProviderEnabledInputSchema,
  TENANT_SSO_CLIENT_SECRET_ENV_KEY,
  type TenantSsoProviderSummary,
  toTenantSsoProviderSummary,
  type UpsertTenantSsoOidcProviderInput,
  type UpsertTenantSsoSamlProviderInput,
  upsertTenantSsoOidcProviderInputSchema,
  upsertTenantSsoSamlProviderInputSchema,
} from "./tenant-sso-provider.contract.js";

export class TenantSsoProviderNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Tenant SSO provider "${identifier}" was not found.`);
    this.name = "TenantSsoProviderNotFoundError";
  }
}

function rowToSummary(
  row: typeof tenantSsoProviders.$inferSelect
): TenantSsoProviderSummary {
  return toTenantSsoProviderSummary({
    displayName: row.displayName,
    domain: row.domain,
    enabled: row.enabled,
    id: row.id,
    issuer: row.issuer,
    metadata: row.metadata,
    protocol: row.protocol,
    providerId: row.providerId,
    tenantId: row.tenantId,
  });
}

export async function resetTenantSsoProvidersForTests(
  db: AfendaDatabase = getDb()
): Promise<void> {
  await db.delete(tenantSsoProviders);
}

export async function listTenantSsoProvidersByTenantId(
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary[]> {
  const rows = await db
    .select()
    .from(tenantSsoProviders)
    .where(eq(tenantSsoProviders.tenantId, tenantId));

  return rows.map(rowToSummary);
}

export async function getTenantSsoProviderById(
  input: GetTenantSsoProviderByIdInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary | null> {
  const parsed = getTenantSsoProviderByIdInputSchema.parse(input);

  const [row] = await db
    .select()
    .from(tenantSsoProviders)
    .where(
      and(
        eq(tenantSsoProviders.id, parsed.id),
        eq(tenantSsoProviders.tenantId, parsed.tenantId)
      )
    )
    .limit(1);

  return row ? rowToSummary(row) : null;
}

export async function getTenantSsoProviderByProviderId(
  input: GetTenantSsoProviderByProviderIdInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary | null> {
  const parsed = getTenantSsoProviderByProviderIdInputSchema.parse(input);

  const [row] = await db
    .select()
    .from(tenantSsoProviders)
    .where(eq(tenantSsoProviders.providerId, parsed.providerId))
    .limit(1);

  return row ? rowToSummary(row) : null;
}

export async function upsertTenantSsoOidcProvider(
  input: UpsertTenantSsoOidcProviderInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary> {
  const parsed = upsertTenantSsoOidcProviderInputSchema.parse(input);
  const normalizedDomain = parsed.domain.trim().toLowerCase();
  const metadata = {
    ...parsed.metadata,
    ...(parsed[TENANT_SSO_CLIENT_SECRET_ENV_KEY] === undefined
      ? {}
      : {
          [TENANT_SSO_CLIENT_SECRET_ENV_KEY]:
            parsed[TENANT_SSO_CLIENT_SECRET_ENV_KEY],
        }),
  };

  const [existing] = await db
    .select({ id: tenantSsoProviders.id })
    .from(tenantSsoProviders)
    .where(
      and(
        eq(tenantSsoProviders.tenantId, parsed.tenantId),
        eq(tenantSsoProviders.providerId, parsed.providerId)
      )
    )
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(tenantSsoProviders)
      .set({
        displayName: parsed.displayName,
        domain: normalizedDomain,
        enabled: parsed.enabled ?? true,
        issuer: parsed.issuer,
        metadata,
        protocol: "oidc",
        updatedAt: new Date(),
      })
      .where(eq(tenantSsoProviders.id, existing.id))
      .returning();

    if (!updated) {
      throw new TenantSsoProviderNotFoundError(existing.id);
    }

    return rowToSummary(updated);
  }

  const [inserted] = await db
    .insert(tenantSsoProviders)
    .values({
      tenantId: parsed.tenantId,
      providerId: parsed.providerId,
      displayName: parsed.displayName,
      protocol: "oidc",
      domain: normalizedDomain,
      issuer: parsed.issuer,
      metadata,
      enabled: parsed.enabled ?? true,
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to create tenant SSO provider.");
  }

  return rowToSummary(inserted);
}

export async function upsertTenantSsoSamlProvider(
  input: UpsertTenantSsoSamlProviderInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary> {
  const parsed = upsertTenantSsoSamlProviderInputSchema.parse(input);
  const normalizedDomain = parsed.domain.trim().toLowerCase();

  const [existing] = await db
    .select({ id: tenantSsoProviders.id })
    .from(tenantSsoProviders)
    .where(
      and(
        eq(tenantSsoProviders.tenantId, parsed.tenantId),
        eq(tenantSsoProviders.providerId, parsed.providerId)
      )
    )
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(tenantSsoProviders)
      .set({
        displayName: parsed.displayName,
        domain: normalizedDomain,
        enabled: parsed.enabled ?? true,
        issuer: parsed.issuer,
        metadata: parsed.metadata,
        protocol: "saml",
        updatedAt: new Date(),
      })
      .where(eq(tenantSsoProviders.id, existing.id))
      .returning();

    if (!updated) {
      throw new TenantSsoProviderNotFoundError(existing.id);
    }

    return rowToSummary(updated);
  }

  const [inserted] = await db
    .insert(tenantSsoProviders)
    .values({
      tenantId: parsed.tenantId,
      providerId: parsed.providerId,
      displayName: parsed.displayName,
      protocol: "saml",
      domain: normalizedDomain,
      issuer: parsed.issuer,
      metadata: parsed.metadata,
      enabled: parsed.enabled ?? true,
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to create tenant SSO provider.");
  }

  return rowToSummary(inserted);
}

export async function setTenantSsoProviderEnabled(
  input: SetTenantSsoProviderEnabledInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary | null> {
  const parsed = setTenantSsoProviderEnabledInputSchema.parse(input);

  const [updated] = await db
    .update(tenantSsoProviders)
    .set({
      enabled: parsed.enabled,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tenantSsoProviders.id, parsed.id),
        eq(tenantSsoProviders.tenantId, parsed.tenantId)
      )
    )
    .returning();

  return updated ? rowToSummary(updated) : null;
}

export async function getEnabledTenantSsoProviderForTenantDomain(
  input: GetEnabledTenantSsoProviderForTenantDomainInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary | null> {
  const parsed =
    getEnabledTenantSsoProviderForTenantDomainInputSchema.parse(input);
  const normalizedDomain = parsed.domain.trim().toLowerCase();

  const [row] = await db
    .select()
    .from(tenantSsoProviders)
    .where(
      and(
        eq(tenantSsoProviders.tenantId, parsed.tenantId),
        eq(tenantSsoProviders.domain, normalizedDomain),
        eq(tenantSsoProviders.enabled, true)
      )
    )
    .limit(1);

  return row ? rowToSummary(row) : null;
}

export async function resolveTenantIdFromSsoEmailDomain(
  email: string,
  db: AfendaDatabase = getDb()
): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const atIndex = normalizedEmail.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) {
    return null;
  }

  const domain = normalizedEmail.slice(atIndex + 1);

  const [row] = await db
    .select({ tenantId: tenantSsoProviders.tenantId })
    .from(tenantSsoProviders)
    .where(
      and(
        eq(tenantSsoProviders.domain, domain),
        eq(tenantSsoProviders.enabled, true)
      )
    )
    .limit(1);

  if (!row) {
    return null;
  }

  const validated = await getEnabledTenantSsoProviderForTenantDomain(
    { domain, tenantId: row.tenantId },
    db
  );

  return validated ? row.tenantId : null;
}

export async function rotateTenantSsoOidcClientSecretEnvKey(
  input: RotateTenantSsoOidcClientSecretEnvKeyInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary> {
  const parsed = rotateTenantSsoOidcClientSecretEnvKeyInputSchema.parse(input);
  const existing = await getTenantSsoProviderById(
    { id: parsed.id, tenantId: parsed.tenantId },
    db
  );

  if (existing?.protocol !== "oidc") {
    throw new TenantSsoProviderNotFoundError(parsed.id);
  }

  const metadata = parseTenantSsoOidcMetadata(existing.metadata);
  const nextMetadata = {
    ...metadata,
    [TENANT_SSO_CLIENT_SECRET_ENV_KEY]: parsed.clientSecretEnvKey,
  };

  const [updated] = await db
    .update(tenantSsoProviders)
    .set({
      metadata: nextMetadata,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tenantSsoProviders.id, parsed.id),
        eq(tenantSsoProviders.tenantId, parsed.tenantId)
      )
    )
    .returning();

  if (!updated) {
    throw new TenantSsoProviderNotFoundError(parsed.id);
  }

  return rowToSummary(updated);
}

export async function rotateTenantSsoSamlCertificate(
  input: RotateTenantSsoSamlCertificateInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSsoProviderSummary> {
  const parsed = rotateTenantSsoSamlCertificateInputSchema.parse(input);
  const existing = await getTenantSsoProviderById(
    { id: parsed.id, tenantId: parsed.tenantId },
    db
  );

  if (existing?.protocol !== "saml") {
    throw new TenantSsoProviderNotFoundError(parsed.id);
  }

  const metadata = parseTenantSsoSamlMetadata(existing.metadata);
  const nextMetadata = {
    ...metadata,
    cert: parsed.cert,
    ...(parsed.idpMetadataXml === undefined
      ? {}
      : { idpMetadataXml: parsed.idpMetadataXml }),
  };

  const [updated] = await db
    .update(tenantSsoProviders)
    .set({
      metadata: nextMetadata,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tenantSsoProviders.id, parsed.id),
        eq(tenantSsoProviders.tenantId, parsed.tenantId)
      )
    )
    .returning();

  if (!updated) {
    throw new TenantSsoProviderNotFoundError(parsed.id);
  }

  return rowToSummary(updated);
}
