import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { tenantSettings } from "../schema/tenant-settings.schema.js";
import {
  parseTenantBillingSettings,
  parseTenantIntegrationsSettings,
  parseTenantNotificationsSettings,
  parseTenantWorkspaceSettings,
  type TenantBillingSettings,
  type TenantIntegrationsSettings,
  type TenantNotificationsSettings,
  type TenantSettingsRecord,
  type TenantSettingsSectionKey,
  type TenantWorkspaceSettings,
  tenantBillingSettingsSchema,
  tenantIntegrationsSettingsSchema,
  tenantNotificationsSettingsSchema,
  tenantWorkspaceSettingsSchema,
} from "./tenant-settings.contract.js";

export interface TenantSettingsAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export interface UpsertTenantSettingsSectionInput {
  readonly audit: TenantSettingsAuditContext;
  readonly section: TenantSettingsSectionKey;
  readonly tenantId: string;
  readonly value:
    | TenantBillingSettings
    | TenantIntegrationsSettings
    | TenantNotificationsSettings
    | TenantWorkspaceSettings;
}

export interface TenantSettingsMutationResult {
  readonly id: string;
  readonly tenantId: string;
}

function sectionSchemaForKey(section: TenantSettingsSectionKey) {
  switch (section) {
    case "billing":
      return tenantBillingSettingsSchema;
    case "integrations":
      return tenantIntegrationsSettingsSchema;
    case "notifications":
      return tenantNotificationsSettingsSchema;
    case "workspace":
      return tenantWorkspaceSettingsSchema;
    default: {
      const exhaustive: never = section;
      throw new Error(`Unsupported tenant settings section: ${exhaustive}`);
    }
  }
}

function sectionPatchForUpdate(
  section: TenantSettingsSectionKey,
  data:
    | TenantBillingSettings
    | TenantIntegrationsSettings
    | TenantNotificationsSettings
    | TenantWorkspaceSettings
) {
  if (section === "billing") {
    return { billing: data as TenantBillingSettings };
  }
  if (section === "integrations") {
    return { integrations: data as TenantIntegrationsSettings };
  }
  if (section === "notifications") {
    return { notifications: data as TenantNotificationsSettings };
  }
  return { workspace: data as TenantWorkspaceSettings };
}

function sectionValuesForInsert(
  section: TenantSettingsSectionKey,
  data:
    | TenantBillingSettings
    | TenantIntegrationsSettings
    | TenantNotificationsSettings
    | TenantWorkspaceSettings
) {
  const baseInsert = {
    tenantId: "",
    notifications: {},
    workspace: {},
    billing: {},
    integrations: {},
  };

  if (section === "billing") {
    return { ...baseInsert, billing: data as TenantBillingSettings };
  }
  if (section === "integrations") {
    return {
      ...baseInsert,
      integrations: data as TenantIntegrationsSettings,
    };
  }
  if (section === "notifications") {
    return {
      ...baseInsert,
      notifications: data as TenantNotificationsSettings,
    };
  }
  return { ...baseInsert, workspace: data as TenantWorkspaceSettings };
}

async function recordTenantSettingsAuditEvent(
  tenantId: string,
  section: TenantSettingsSectionKey,
  audit: TenantSettingsAuditContext,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      tenantId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action: "tenant_settings.update",
      targetType: "tenant_settings",
      targetId: tenantId,
      result: "success",
      source: audit.source ?? "app",
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      userAgent: audit.userAgent ?? null,
      metadata: { section },
    },
    db
  );
}

export async function getTenantSettingsByTenantId(
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantSettingsRecord | null> {
  const [row] = await db
    .select({
      id: tenantSettings.id,
      tenantId: tenantSettings.tenantId,
      notifications: tenantSettings.notifications,
      workspace: tenantSettings.workspace,
      billing: tenantSettings.billing,
      integrations: tenantSettings.integrations,
    })
    .from(tenantSettings)
    .where(eq(tenantSettings.tenantId, tenantId))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    tenantId: row.tenantId,
    notifications: parseTenantNotificationsSettings(row.notifications),
    workspace: parseTenantWorkspaceSettings(row.workspace),
    billing: parseTenantBillingSettings(row.billing),
    integrations: parseTenantIntegrationsSettings(row.integrations),
  };
}

export async function upsertTenantSettingsSection(
  input: UpsertTenantSettingsSectionInput,
  db: AfendaDatabase = getDb()
): Promise<TenantSettingsMutationResult> {
  const parsed = sectionSchemaForKey(input.section).safeParse(input.value);
  if (!parsed.success) {
    throw new Error(
      `Invalid tenant settings payload for section ${input.section}.`
    );
  }

  const existing = await getTenantSettingsByTenantId(input.tenantId, db);

  if (existing) {
    const patch = sectionPatchForUpdate(input.section, parsed.data);

    const [updated] = await db
      .update(tenantSettings)
      .set(patch)
      .where(eq(tenantSettings.tenantId, input.tenantId))
      .returning({ id: tenantSettings.id, tenantId: tenantSettings.tenantId });

    if (!updated) {
      throw new Error("Tenant settings update did not return a row.");
    }

    await recordTenantSettingsAuditEvent(
      input.tenantId,
      input.section,
      input.audit,
      db
    );

    return updated;
  }

  const insertValues = {
    ...sectionValuesForInsert(input.section, parsed.data),
    tenantId: input.tenantId,
  };

  const [inserted] = await db
    .insert(tenantSettings)
    .values(insertValues)
    .returning({ id: tenantSettings.id, tenantId: tenantSettings.tenantId });

  if (!inserted) {
    throw new Error("Tenant settings insert did not return a row.");
  }

  await recordTenantSettingsAuditEvent(
    input.tenantId,
    input.section,
    input.audit,
    db
  );

  return inserted;
}
