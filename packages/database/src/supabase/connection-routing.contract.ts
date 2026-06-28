import {
  getDatabaseUrlForMethod,
  type SupabaseConnectionMethod,
} from "../env.js";

/** Afenda Postgres consumers that must use a governed Supabase connection method. */
export const DATABASE_CONNECTION_CONSUMERS = [
  "drizzle-migrations",
  "platform-db-pool",
  "auth-db-pool",
  "execution-workers",
  "rls-live-probe",
] as const;

export type DatabaseConnectionConsumer =
  (typeof DATABASE_CONNECTION_CONSUMERS)[number];

/**
 * Canonical Supabase pooler routing per consumer.
 * Authority: ARCH-SUPA-001 Slice 1 · PKG-003 persistence (pas-status-index).
 *
 * `platform-db-pool` and `auth-db-pool` use transaction mode — matches
 * `getDatabaseUrl()` default for Vercel/serverless ERP runtimes.
 * Use session mode only when deploying long-lived Node backends (paid dedicated pooler).
 */
export const DATABASE_CONNECTION_ROUTING = {
  "drizzle-migrations": "direct",
  "platform-db-pool": "transaction",
  "auth-db-pool": "transaction",
  "execution-workers": "transaction",
  "rls-live-probe": "direct",
} as const satisfies Record<
  DatabaseConnectionConsumer,
  SupabaseConnectionMethod
>;

export class InvalidDatabaseConnectionConsumerError extends Error {
  constructor(value: string) {
    super(
      `Invalid database connection consumer "${value}". Expected one of: ${DATABASE_CONNECTION_CONSUMERS.join(", ")}.`
    );
    this.name = "InvalidDatabaseConnectionConsumerError";
  }
}

export function isDatabaseConnectionConsumer(
  value: string
): value is DatabaseConnectionConsumer {
  return (DATABASE_CONNECTION_CONSUMERS as readonly string[]).includes(value);
}

export function assertDatabaseConnectionConsumer(
  value: string
): DatabaseConnectionConsumer {
  if (!isDatabaseConnectionConsumer(value)) {
    throw new InvalidDatabaseConnectionConsumerError(value);
  }

  return value;
}

export function resolveConnectionMethodForConsumer(
  consumer: DatabaseConnectionConsumer
): SupabaseConnectionMethod {
  return DATABASE_CONNECTION_ROUTING[consumer];
}

export function resolveDatabaseUrlForConsumer(
  consumer: DatabaseConnectionConsumer,
  env: NodeJS.ProcessEnv = process.env
): string {
  return getDatabaseUrlForMethod(
    resolveConnectionMethodForConsumer(consumer),
    env
  );
}
