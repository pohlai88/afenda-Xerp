import type { Pool, PoolConfig } from "pg";

import type { DatabaseConnectionConsumer } from "./supabase/connection-routing.contract.js";

/** Shared database client shape for lifecycle-controlled Drizzle access. */
export interface AfendaPgClient<TDatabase> {
  readonly close: () => Promise<void>;
  readonly db: TDatabase;
  readonly pool: Pool;
}

export interface CreatePgClientOptions {
  /** Registry consumer when `connectionString` is omitted. Defaults to `platform-db-pool`. */
  readonly connectionConsumer?: DatabaseConnectionConsumer;
  readonly connectionString?: string;
  readonly poolConfig?: Omit<PoolConfig, "connectionString">;
}
