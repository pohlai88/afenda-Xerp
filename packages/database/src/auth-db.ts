import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

import type { AfendaPgClient, CreatePgClientOptions } from "./client.types.js";
import { resetDbClient } from "./db.js";
import { createPgPool } from "./pool.js";
import {
  getRuntimeSingleton,
  resetRuntimeSingleton,
} from "./runtime-singleton.js";
import { type AuthSchema, authSchema } from "./schema/auth.schema.js";

const AUTH_DB_CLIENT_SINGLETON_KEY = "__afendaAuthDbClient__";

export type AfendaAuthDatabase = NodePgDatabase<AuthSchema>;
export type AfendaAuthDbClient = AfendaPgClient<AfendaAuthDatabase>;
export type CreateAuthDbOptions = CreatePgClientOptions;

export function createAuthDbClient(
  options: CreateAuthDbOptions = {}
): AfendaAuthDbClient {
  const pool = createPgPool(options);
  const db = drizzle(pool, { schema: authSchema });

  return {
    close: () => pool.end(),
    db,
    pool,
  };
}

export function createAuthDb(
  options: CreateAuthDbOptions = {}
): AfendaAuthDatabase {
  return createAuthDbClient(options).db;
}

/**
 * Returns the process-scoped Better Auth DB client.
 * Options apply only on the first call in a process.
 */
export function getAuthDbClient(
  options: CreateAuthDbOptions = {}
): AfendaAuthDbClient {
  return getRuntimeSingleton(AUTH_DB_CLIENT_SINGLETON_KEY, () =>
    createAuthDbClient(options)
  );
}

/** Returns the singleton Better Auth Drizzle instance for app runtime. */
export function getAuthDb(
  options: CreateAuthDbOptions = {}
): AfendaAuthDatabase {
  return getAuthDbClient(options).db;
}

/** Closes and clears the Better Auth DB singleton. Use in tests between cases. */
export async function resetAuthDbClient(): Promise<void> {
  const root = globalThis as typeof globalThis &
    Record<string, AfendaAuthDbClient | undefined>;
  const client = root[AUTH_DB_CLIENT_SINGLETON_KEY];

  if (client) {
    await client.close();
  }

  resetRuntimeSingleton(AUTH_DB_CLIENT_SINGLETON_KEY);
}

/** Closes and clears all governed database singletons. */
export async function resetAllDbClients(): Promise<void> {
  await Promise.all([resetDbClient(), resetAuthDbClient()]);
}
