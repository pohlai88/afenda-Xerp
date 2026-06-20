/**
 * Storage object metadata registry.
 *
 * Owns tenant-scoped object metadata only. Binary transfer and signed URL
 * generation stay in `@afenda/storage` provider adapters.
 */
import { bigint, index, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { storageProviderEnum } from "../database.types.js";
import {
  companyIdRef,
  organizationIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { tenants } from "./tenant.schema.js";

export const storageObjects = pgTable(
  "storage_objects",
  {
    objectId: primaryId("object_id"),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "set null",
    }),
    organizationId: organizationIdRef().references(() => organizations.id, {
      onDelete: "set null",
    }),
    bucket: varchar("bucket", { length: 191 }).notNull(),
    path: varchar("path", { length: 1024 }).notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 191 }).notNull(),
    size: bigint("size_bytes", { mode: "number" }).notNull(),
    checksum: jsonb("checksum"),
    provider: storageProviderEnum("provider").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: createdAtColumn(),
  },
  (table) => [
    index("storage_objects_tenant_id_idx").on(table.tenantId),
    index("storage_objects_company_id_idx").on(table.companyId),
    index("storage_objects_organization_id_idx").on(table.organizationId),
    index("storage_objects_provider_idx").on(table.provider),
    index("storage_objects_path_idx").on(table.bucket, table.path),
    index("storage_objects_created_at_idx").on(table.createdAt),
  ]
);
