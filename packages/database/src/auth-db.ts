import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import { getDatabaseUrl } from "./env.js";
import { type AuthSchema, authSchema } from "./schema/auth.schema.js";

export type AfendaAuthDatabase = NodePgDatabase<AuthSchema>;

export interface CreateAuthDbOptions {
  connectionString?: string;
  poolConfig?: Omit<PoolConfig, "connectionString">;
}

export function createAuthDb(
  options: CreateAuthDbOptions = {}
): AfendaAuthDatabase {
  const connectionString = options.connectionString ?? getDatabaseUrl();
  const pool = new Pool({
    connectionString,
    ...options.poolConfig,
  });

  return drizzle(pool, { schema: authSchema });
}
