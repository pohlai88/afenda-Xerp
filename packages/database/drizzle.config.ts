import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

import { resolveMigrationDatabaseUrl } from "./src/env.js";

const configDir = path.dirname(fileURLToPath(import.meta.url));

loadEnv({ path: path.resolve(configDir, "../../.env") });
loadEnv({ path: path.resolve(configDir, "../../.env.local"), override: true });
loadEnv({ path: path.resolve(configDir, ".env"), override: true });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: resolveMigrationDatabaseUrl(),
  },

  // Pin migration ledger location explicitly so upstream default changes never
  // silently diverge from the fallback apply script (apply-sql-migrations-fallback.ts)
  // which queries `drizzle.__drizzle_migrations` directly.
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations",
    schema: "drizzle",
  },

  // Scope diff to `public` only — Supabase manages `auth`, `storage`, and
  // `drizzle` schemas independently; including them causes spurious diffs.
  schemaFilter: ["public"],

  // Tell drizzle-kit this is a Supabase project so it skips managing Supabase's
  // built-in roles (authenticator, anon, service_role, etc.) and avoids
  // generating role-management DDL that would fail on Supabase-managed clusters.
  entities: {
    roles: {
      provider: "supabase",
    },
  },

  breakpoints: true,
  strict: true,
  verbose: process.env.DRIZZLE_VERBOSE !== "0",
});
