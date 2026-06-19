import { resetAllDbClients } from "../src/auth-db.js";
import { createDbClient } from "../src/db.js";
import { verifyPlatformSeed } from "../src/seeds/seed-verify.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const client = createDbClient();

try {
  const result = await verifyPlatformSeed(client.db, "platform");
  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error("verify:seed failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.close();
  resetAllDbClients();
}
