import { Pool, type PoolConfig } from "pg";
import type { CreatePgClientOptions } from "./client.types.js";
import { resolveDatabaseUrlForConsumer } from "./supabase/connection-routing.contract.js";

/** Governed defaults for all Postgres pools in `@afenda/database`. */
export const DEFAULT_POOL_CONFIG = {
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
} as const satisfies Omit<PoolConfig, "connectionString">;

/** Single pool construction path. Do not instantiate `Pool` outside this module. */
export function createPgPool(options: CreatePgClientOptions = {}): Pool {
  const consumer = options.connectionConsumer ?? "platform-db-pool";
  const connectionString =
    options.connectionString ?? resolveDatabaseUrlForConsumer(consumer);

  return new Pool({
    ...DEFAULT_POOL_CONFIG,
    ...options.poolConfig,
    connectionString,
  });
}
