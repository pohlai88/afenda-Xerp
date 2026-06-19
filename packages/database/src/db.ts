import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import { getDatabaseUrl } from "./env.js";
import { platformSchema } from "./schema/index.js";

export const schema = platformSchema;

export type AfendaDatabase = NodePgDatabase<typeof schema>;

export interface CreateDbOptions {
  connectionString?: string;
  poolConfig?: Omit<PoolConfig, "connectionString">;
}

export function createDb(options: CreateDbOptions = {}): AfendaDatabase {
  const connectionString = options.connectionString ?? getDatabaseUrl();
  const pool = new Pool({
    connectionString,
    ...options.poolConfig,
  });

  return drizzle(pool, { schema });
}

export function createDbPool(options: CreateDbOptions = {}): Pool {
  const connectionString = options.connectionString ?? getDatabaseUrl();

  return new Pool({
    connectionString,
    ...options.poolConfig,
  });
}
