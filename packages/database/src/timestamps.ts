import { timestamp } from "drizzle-orm/pg-core";

function buildCreatedAtColumn(columnName = "created_at") {
  return timestamp(columnName, {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow();
}

function buildUpdatedAtColumn(columnName = "updated_at") {
  return timestamp(columnName, {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
}

/** Locked Drizzle column type for platform created-at timestamps. */
export type CreatedAtColumn = ReturnType<typeof buildCreatedAtColumn>;

/** Locked Drizzle column type for platform updated-at timestamps. */
export type UpdatedAtColumn = ReturnType<typeof buildUpdatedAtColumn>;

/**
 * Canonical created timestamp for platform entities.
 *
 * Rules:
 * - timestamptz
 * - database default via `defaultNow()`
 * - not nullable
 * - Date mode
 *
 * Prohibited outside this module:
 * - inline `timestamp("created_at")` variants
 * - timestamp without timezone
 * - nullable created-at columns
 */
export function createdAtColumn(columnName = "created_at"): CreatedAtColumn {
  return buildCreatedAtColumn(columnName);
}

/**
 * Canonical updated timestamp for platform entities.
 *
 * Rules:
 * - timestamptz
 * - database default via `defaultNow()`
 * - not nullable
 * - Date mode
 * - application updates value on mutation via `$onUpdate`
 *
 * Prohibited outside this module:
 * - inline `timestamp("updated_at")` variants
 * - missing `$onUpdate` handlers on mutable entities
 */
export function updatedAtColumn(columnName = "updated_at"): UpdatedAtColumn {
  return buildUpdatedAtColumn(columnName);
}
