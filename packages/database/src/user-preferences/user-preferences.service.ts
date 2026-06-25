import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { userPreferences } from "../schema/user-preferences.schema.js";
import {
  parseUserDisplayPreferences,
  parseUserNotificationsPreferences,
  type UserDisplayPreferences,
  type UserNotificationsPreferences,
  type UserPreferencesRecord,
  type UserPreferencesSectionKey,
  userDisplayPreferencesSchema,
  userNotificationsPreferencesSchema,
} from "./user-preferences.contract.js";

export interface UserPreferencesAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export interface UpsertUserPreferencesSectionInput {
  readonly audit: UserPreferencesAuditContext;
  readonly section: UserPreferencesSectionKey;
  readonly userId: string;
  readonly value: UserDisplayPreferences | UserNotificationsPreferences;
}

export interface UserPreferencesMutationResult {
  readonly id: string;
  readonly userId: string;
}

function sectionSchemaForKey(section: UserPreferencesSectionKey) {
  switch (section) {
    case "display":
      return userDisplayPreferencesSchema;
    case "notifications":
      return userNotificationsPreferencesSchema;
    default: {
      const exhaustive: never = section;
      throw new Error(`Unsupported user preferences section: ${exhaustive}`);
    }
  }
}

function sectionPatchForUpdate(
  section: UserPreferencesSectionKey,
  data: UserDisplayPreferences | UserNotificationsPreferences
) {
  if (section === "display") {
    return { display: data as UserDisplayPreferences };
  }
  return { notifications: data as UserNotificationsPreferences };
}

function sectionValuesForInsert(
  section: UserPreferencesSectionKey,
  data: UserDisplayPreferences | UserNotificationsPreferences
) {
  const baseInsert = {
    userId: "",
    notifications: {},
    display: {},
  };

  if (section === "display") {
    return { ...baseInsert, display: data as UserDisplayPreferences };
  }
  return {
    ...baseInsert,
    notifications: data as UserNotificationsPreferences,
  };
}

async function recordUserPreferencesAuditEvent(
  userId: string,
  section: UserPreferencesSectionKey,
  audit: UserPreferencesAuditContext,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action: "user_preferences.update",
      targetType: "user_preferences",
      targetId: userId,
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

export async function getUserPreferencesByUserId(
  userId: string,
  db: AfendaDatabase = getDb()
): Promise<UserPreferencesRecord | null> {
  const [row] = await db
    .select({
      id: userPreferences.id,
      userId: userPreferences.userId,
      notifications: userPreferences.notifications,
      display: userPreferences.display,
    })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.userId,
    notifications: parseUserNotificationsPreferences(row.notifications),
    display: parseUserDisplayPreferences(row.display),
  };
}

export async function upsertUserPreferencesSection(
  input: UpsertUserPreferencesSectionInput,
  db: AfendaDatabase = getDb()
): Promise<UserPreferencesMutationResult> {
  const parsed = sectionSchemaForKey(input.section).safeParse(input.value);
  if (!parsed.success) {
    throw new Error(
      `Invalid user preferences payload for section ${input.section}.`
    );
  }

  const existing = await getUserPreferencesByUserId(input.userId, db);

  if (existing) {
    const patch = sectionPatchForUpdate(input.section, parsed.data);

    const [updated] = await db
      .update(userPreferences)
      .set(patch)
      .where(eq(userPreferences.userId, input.userId))
      .returning({
        id: userPreferences.id,
        userId: userPreferences.userId,
      });

    if (!updated) {
      throw new Error("User preferences update did not return a row.");
    }

    await recordUserPreferencesAuditEvent(
      input.userId,
      input.section,
      input.audit,
      db
    );

    return updated;
  }

  const insertValues = {
    ...sectionValuesForInsert(input.section, parsed.data),
    userId: input.userId,
  };

  const [inserted] = await db
    .insert(userPreferences)
    .values(insertValues)
    .returning({
      id: userPreferences.id,
      userId: userPreferences.userId,
    });

  if (!inserted) {
    throw new Error("User preferences insert did not return a row.");
  }

  await recordUserPreferencesAuditEvent(
    input.userId,
    input.section,
    input.audit,
    db
  );

  return inserted;
}
