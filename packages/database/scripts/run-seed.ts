import { resetAllDbClients } from "../src/auth-db.js";
import { type AfendaDatabase, createDbClient } from "../src/db.js";
import { assertSeedProfileAllowed } from "../src/seeds/seed-environment.js";
import type { SeedProfile, SeedRunResult } from "../src/seeds/seed-types.js";
import { loadDatabaseEnv } from "./load-env.js";

export async function runSeedCommand(options: {
  readonly execute: (db: AfendaDatabase) => Promise<SeedRunResult>;
  readonly profile: SeedProfile;
}): Promise<number> {
  loadDatabaseEnv();

  try {
    assertSeedProfileAllowed(options.profile);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const client = createDbClient();

  try {
    const result = await options.execute(client.db);
    console.log(`seed:${options.profile} complete`);
    console.log(JSON.stringify(result, null, 2));
    return 0;
  } catch (error) {
    console.error(`seed:${options.profile} failed`);
    console.error(error);
    return 1;
  } finally {
    await client.close();
    resetAllDbClients();
  }
}
