import type { AfendaDatabase } from "../db.js";
import { seedDevWorkspaceProfile } from "./seed-workspace.js";
import type { SeedRunResult } from "./seed-types.js";
import { DEMO_WORKSPACE_FIXTURE } from "./workspace-fixtures.js";

/** Demo profile: platform baseline + demo workspace (blocked in production). */
export function seedDemo(db: AfendaDatabase): Promise<SeedRunResult> {
  return seedDevWorkspaceProfile("demo", DEMO_WORKSPACE_FIXTURE, db);
}
