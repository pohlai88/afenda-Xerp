import type { AfendaDatabase } from "../db.js";
import type { SeedRunResult } from "./seed-types.js";
import { seedDevWorkspaceProfile } from "./seed-workspace.js";
import { DEV_WORKSPACE_FIXTURE } from "./workspace-fixtures.js";

/** Dev profile: platform baseline + local workspace fixtures. */
export function seedDev(db: AfendaDatabase): Promise<SeedRunResult> {
  return seedDevWorkspaceProfile("dev", DEV_WORKSPACE_FIXTURE, db);
}
