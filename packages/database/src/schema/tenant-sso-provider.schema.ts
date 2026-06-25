/**
 * Tenant-scoped SSO IdP configuration (ARCH-AUTH-001 Slice 13a).
 *
 * Writes: `../tenant-sso/tenant-sso-provider.service.ts`
 * Contract: `../tenant-sso/tenant-sso-provider.contract.ts`
 */
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

export const tenantSsoProtocolEnum = pgEnum("tenant_sso_protocol", [
  "saml",
  "oidc",
]);

export const tenantSsoProviders = pgTable(
  "tenant_sso_providers",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),
    displayName: text("display_name").notNull(),
    protocol: tenantSsoProtocolEnum("protocol").notNull(),
    domain: text("domain").notNull(),
    issuer: text("issuer").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    enabled: boolean("enabled").notNull().default(false),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("tenant_sso_providers_provider_id_uidx").on(table.providerId),
    uniqueIndex("tenant_sso_providers_tenant_provider_uidx").on(
      table.tenantId,
      table.providerId
    ),
    uniqueIndex("tenant_sso_providers_tenant_domain_uidx").on(
      table.tenantId,
      table.domain
    ),
    index("tenant_sso_providers_tenant_id_idx").on(table.tenantId),
    index("tenant_sso_providers_tenant_enabled_idx").on(
      table.tenantId,
      table.enabled
    ),
  ]
);
