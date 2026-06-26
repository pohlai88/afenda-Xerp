import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AfendaDatabase } from "../db.js";
import { tenantSsoProviders } from "../schema/tenant-sso-provider.schema.js";
import { TENANT_SSO_CLIENT_SECRET_ENV_KEY } from "../tenant-sso/tenant-sso-provider.contract.js";
import {
  getEnabledTenantSsoProviderForTenantDomain,
  listTenantSsoProvidersByTenantId,
  resetTenantSsoProvidersForTests,
  resolveTenantIdFromSsoEmailDomain,
  rotateTenantSsoOidcClientSecretEnvKey,
  rotateTenantSsoSamlCertificate,
  setTenantSsoProviderEnabled,
  TenantSsoProviderNotFoundError,
  upsertTenantSsoOidcProvider,
  upsertTenantSsoSamlProvider,
} from "../tenant-sso/tenant-sso-provider.service.js";

interface StoredSsoProvider {
  createdAt: Date;
  displayName: string;
  domain: string;
  enabled: boolean;
  id: string;
  issuer: string;
  metadata: unknown;
  protocol: "oidc" | "saml";
  providerId: string;
  tenantId: string;
  updatedAt: Date;
}

function createSsoProviderTestDb(initialRows: StoredSsoProvider[] = []) {
  const rows = new Map(initialRows.map((row) => [row.id, { ...row }]));

  const filterRows = (
    predicate: (row: StoredSsoProvider) => boolean
  ): StoredSsoProvider[] => [...rows.values()].filter(predicate);

  const db = {
    delete: vi.fn(async () => {
      rows.clear();
    }),
    insert: vi.fn(() => ({
      values: vi.fn(
        (
          value: Omit<StoredSsoProvider, "createdAt" | "updatedAt" | "id"> & {
            id?: string;
          }
        ) => ({
          returning: vi.fn(async () => {
            const id = value.id ?? randomUUID();
            const now = new Date();
            const stored: StoredSsoProvider = {
              createdAt: now,
              updatedAt: now,
              displayName: value.displayName,
              domain: value.domain,
              enabled: value.enabled ?? false,
              id,
              issuer: value.issuer,
              metadata: value.metadata,
              protocol: value.protocol,
              providerId: value.providerId,
              tenantId: value.tenantId,
            };
            rows.set(id, stored);
            return [stored];
          }),
        })
      ),
    })),
    select: vi.fn((selection?: { tenantId?: true }) => ({
      from: vi.fn(() => ({
        where: vi.fn((predicate: unknown) => {
          const allRows = filterRows(() => true);

          if (
            selection &&
            "tenantId" in selection &&
            selection.tenantId === true
          ) {
            const tenantId = String(predicate);
            const matched = allRows.filter((row) => row.tenantId === tenantId);
            const query = Promise.resolve(matched);
            return Object.assign(query, {
              limit: vi.fn(async () => matched.slice(0, 1)),
            });
          }

          const query = Promise.resolve(allRows);
          return Object.assign(query, {
            limit: vi.fn(async () => allRows.slice(0, 1)),
          });
        }),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn((patch: Partial<StoredSsoProvider>) => ({
        where: vi.fn(() => ({
          returning: vi.fn(async () => {
            for (const [id, row] of rows.entries()) {
              const next = { ...row, ...patch, updatedAt: new Date() };
              rows.set(id, next);
              return [next];
            }
            return [];
          }),
        })),
      })),
    })),
  } as unknown as AfendaDatabase;

  return { db, rows };
}

describe("tenant-sso-provider.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("upserts and lists tenant-scoped OIDC providers", async () => {
    const tenantId = randomUUID();
    const { db } = createSsoProviderTestDb();

    const saved = await upsertTenantSsoOidcProvider(
      {
        tenantId,
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: { clientId: "client-123" },
      },
      db
    );

    expect(saved.providerId).toBe("okta-acme");
    const listed = await listTenantSsoProvidersByTenantId(tenantId, db);
    expect(listed).toHaveLength(1);
    expect(listed[0]?.enabled).toBe(true);
  });

  it("upserts tenant-scoped SAML providers", async () => {
    const tenantId = randomUUID();
    const { db } = createSsoProviderTestDb();

    const saved = await upsertTenantSsoSamlProvider(
      {
        tenantId,
        providerId: "okta-saml-acme",
        displayName: "Okta SAML ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: {
          entryPoint: "https://acme.okta.com/sso/saml",
          cert: "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----",
        },
      },
      db
    );

    expect(saved.protocol).toBe("saml");
    expect(saved.providerId).toBe("okta-saml-acme");
    const listed = await listTenantSsoProvidersByTenantId(tenantId, db);
    expect(listed).toHaveLength(1);
    expect(listed[0]?.protocol).toBe("saml");
  });

  it("updates provider enabled state", async () => {
    const tenantId = randomUUID();
    const id = randomUUID();
    const { db } = createSsoProviderTestDb([
      {
        id,
        tenantId,
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: false,
        metadata: { clientId: "client-123" },
        protocol: "oidc",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const updated = await setTenantSsoProviderEnabled(
      { id, tenantId, enabled: true },
      db
    );
    expect(updated?.enabled).toBe(true);
  });

  it("returns tenant-scoped enabled provider for domain", async () => {
    const tenantId = randomUUID();
    const otherTenantId = randomUUID();
    const { db } = createSsoProviderTestDb([
      {
        id: randomUUID(),
        tenantId,
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: { clientId: "client-123" },
        protocol: "oidc",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        tenantId: otherTenantId,
        providerId: "okta-other",
        displayName: "Okta Other",
        domain: "acme.example",
        issuer: "https://other.okta.com",
        enabled: true,
        metadata: { clientId: "client-456" },
        protocol: "oidc",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const match = await getEnabledTenantSsoProviderForTenantDomain(
      { tenantId, domain: "acme.example" },
      db
    );
    expect(match?.tenantId).toBe(tenantId);
    expect(match?.providerId).toBe("okta-acme");
  });

  it("resolves tenant id from enabled SSO email domain", async () => {
    const tenantId = randomUUID();
    const { db } = createSsoProviderTestDb([
      {
        id: randomUUID(),
        tenantId,
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: { clientId: "client-123" },
        protocol: "oidc",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      resolveTenantIdFromSsoEmailDomain("user@acme.example", db)
    ).resolves.toBe(tenantId);
  });

  it("clears providers in test reset helper", async () => {
    const { db } = createSsoProviderTestDb();
    await expect(resetTenantSsoProvidersForTests(db)).resolves.toBeUndefined();
    expect(db.delete).toHaveBeenCalledWith(tenantSsoProviders);
  });

  it("rotates OIDC client secret env key without storing secret values", async () => {
    const tenantId = randomUUID();
    const { db } = createSsoProviderTestDb();

    const saved = await upsertTenantSsoOidcProvider(
      {
        tenantId,
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: { clientId: "client-123" },
      },
      db
    );

    const rotated = await rotateTenantSsoOidcClientSecretEnvKey(
      {
        id: saved.id,
        tenantId,
        clientSecretEnvKey: "ACME_OKTA_CLIENT_SECRET",
      },
      db
    );

    expect(rotated.id).toBe(saved.id);
    const listed = await listTenantSsoProvidersByTenantId(tenantId, db);
    expect(listed[0]?.metadata).toEqual({
      clientId: "client-123",
      [TENANT_SSO_CLIENT_SECRET_ENV_KEY]: "ACME_OKTA_CLIENT_SECRET",
    });
  });

  it("rotates SAML certificate metadata", async () => {
    const tenantId = randomUUID();
    const { db } = createSsoProviderTestDb();
    const nextCert =
      "-----BEGIN CERTIFICATE-----\nROTATED\n-----END CERTIFICATE-----";

    const saved = await upsertTenantSsoSamlProvider(
      {
        tenantId,
        providerId: "okta-saml-acme",
        displayName: "Okta SAML ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: {
          entryPoint: "https://acme.okta.com/sso/saml",
          cert: "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----",
        },
      },
      db
    );

    const rotated = await rotateTenantSsoSamlCertificate(
      {
        id: saved.id,
        tenantId,
        cert: nextCert,
      },
      db
    );

    expect(rotated.protocol).toBe("saml");
    const listed = await listTenantSsoProvidersByTenantId(tenantId, db);
    expect(listed[0]?.metadata).toMatchObject({
      entryPoint: "https://acme.okta.com/sso/saml",
      cert: nextCert,
    });
  });

  it("rejects OIDC rotation when provider protocol mismatches", async () => {
    const tenantId = randomUUID();
    const { db } = createSsoProviderTestDb();

    const saved = await upsertTenantSsoSamlProvider(
      {
        tenantId,
        providerId: "okta-saml-acme",
        displayName: "Okta SAML ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: {
          entryPoint: "https://acme.okta.com/sso/saml",
          cert: "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----",
        },
      },
      db
    );

    await expect(
      rotateTenantSsoOidcClientSecretEnvKey(
        {
          id: saved.id,
          tenantId,
          clientSecretEnvKey: "ACME_OKTA_CLIENT_SECRET",
        },
        db
      )
    ).rejects.toBeInstanceOf(TenantSsoProviderNotFoundError);
  });
});
