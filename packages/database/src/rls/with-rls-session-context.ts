import { sql } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import {
  RLS_SESSION_KEYS,
  type RlsSessionContext,
} from "./rls-session-context.contract.js";

/**
 * Applies tenant and actor session variables for Postgres RLS policies that
 * fall back to `current_setting('app.*', true)` when Supabase JWT claims are absent.
 *
 * Application RBAC remains primary; this enables Drizzle transactions to satisfy RLS
 * when not using the Supabase service role.
 */
export async function withRlsSessionContext<T>(
  db: AfendaDatabase,
  context: RlsSessionContext,
  run: (tx: AfendaDatabase) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config(${RLS_SESSION_KEYS.tenantId}, ${context.tenantId}, true)`
    );
    await tx.execute(
      sql`select set_config(${RLS_SESSION_KEYS.platformUserId}, ${context.platformUserId}, true)`
    );
    if (context.legalEntityId) {
      await tx.execute(
        sql`select set_config(${RLS_SESSION_KEYS.legalEntityId}, ${context.legalEntityId}, true)`
      );
    }

    return run(tx);
  });
}
