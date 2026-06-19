import type { AfendaDatabase } from "../db.js";
import { seedDev } from "../seeds/seed-dev.js";
import { assertBootstrapAllowed } from "../seeds/seed-environment.js";
import type { SeedRunResult } from "../seeds/seed-types.js";

/** Local bootstrap: platform baseline + dev workspace (explicit CLI only). */
export function bootstrapLocal(db: AfendaDatabase): Promise<SeedRunResult> {
  assertBootstrapAllowed("local");
  return seedDev(db);
}
