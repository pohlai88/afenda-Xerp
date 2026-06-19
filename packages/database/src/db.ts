import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

import type { AfendaPgClient, CreatePgClientOptions } from "./client.types.js";
import { createPgPool } from "./pool.js";
import {
  getRuntimeSingleton,
  resetRuntimeSingleton,
} from "./runtime-singleton.js";
import { platformSchema } from "./schema/index.js";

const DB_CLIENT_SINGLETON_KEY = "__afendaDbClient__";

export const schema = platformSchema;

export type AfendaDatabase = NodePgDatabase<typeof schema>;
export type AfendaDbClient = AfendaPgClient<AfendaDatabase>;
export type CreateDbOptions = CreatePgClientOptions;

export function createDbPool(options: CreateDbOptions = {}) {
  return createPgPool(options);
}

export function createDbClient(options: CreateDbOptions = {}): AfendaDbClient {
  const pool = createDbPool(options);
  const db = drizzle(pool, { schema });

  return {
    close: () => pool.end(),
    db,
    pool,
  };
}

export function createDb(options: CreateDbOptions = {}): AfendaDatabase {
  return createDbClient(options).db;
}

/**
 * Returns the process-scoped platform DB client.
 * Options apply only on the first call in a process.
 */
export function getDbClient(options: CreateDbOptions = {}): AfendaDbClient {
  return getRuntimeSingleton(DB_CLIENT_SINGLETON_KEY, () =>
    createDbClient(options)
  );
}

/** Returns the singleton platform Drizzle instance for app runtime. */
export function getDb(options: CreateDbOptions = {}): AfendaDatabase {
  return getDbClient(options).db;
}

/** Closes and clears the platform DB singleton. Use in tests between cases. */
export async function resetDbClient(): Promise<void> {
  const root = globalThis as typeof globalThis &
    Record<string, AfendaDbClient | undefined>;
  const client = root[DB_CLIENT_SINGLETON_KEY];

  if (client) {
    await client.close();
  }

  resetRuntimeSingleton(DB_CLIENT_SINGLETON_KEY);
}
