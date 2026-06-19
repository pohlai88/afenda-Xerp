import type { AfendaDatabase } from "../db.js";
import { seedPlatformCatalog } from "./seed-platform.js";
import type { SeedRunResult } from "./seed-types.js";

/** Test profile: platform baseline only (no workspace fixtures). */
export function seedTest(db: AfendaDatabase): Promise<SeedRunResult> {
  return seedPlatformCatalog("test", db);
}
