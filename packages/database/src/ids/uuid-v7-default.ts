import { type SQL, sql } from "drizzle-orm";

/** Postgres default for platform PK columns — RFC 9562 UUID v7 (ADR-0022). */
export const UUID_V7_DEFAULT: SQL = sql`uuid_generate_v7()`;
