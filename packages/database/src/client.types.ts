import type { Pool, PoolConfig } from "pg";

/** Shared database client shape for lifecycle-controlled Drizzle access. */
export interface AfendaPgClient<TDatabase> {
  readonly close: () => Promise<void>;
  readonly db: TDatabase;
  readonly pool: Pool;
}

export interface CreatePgClientOptions {
  readonly connectionString?: string;
  readonly poolConfig?: Omit<PoolConfig, "connectionString">;
}
