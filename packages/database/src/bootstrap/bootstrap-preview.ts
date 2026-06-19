import type { AfendaDatabase } from "../db.js";
import { assertBootstrapAllowed } from "../seeds/seed-environment.js";
import type { SeedRunResult } from "../seeds/seed-types.js";
import { seedDevWorkspaceProfile } from "../seeds/seed-workspace.js";
import { PREVIEW_WORKSPACE_FIXTURE } from "../seeds/workspace-fixtures.js";

/** Preview bootstrap: platform baseline + preview workspace fixtures. */
export function bootstrapPreview(db: AfendaDatabase): Promise<SeedRunResult> {
  assertBootstrapAllowed("preview");
  return seedDevWorkspaceProfile("dev", PREVIEW_WORKSPACE_FIXTURE, db);
}
