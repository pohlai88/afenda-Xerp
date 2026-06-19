import { uuid } from "drizzle-orm/pg-core";

/** Primary key column with server-generated UUID default. */
export function primaryId(columnName = "id") {
  return uuid(columnName).primaryKey().defaultRandom();
}
