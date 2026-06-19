import { resetAllDbClients } from "../src/auth-db.js";
import { bootstrapLocal } from "../src/bootstrap/bootstrap-local.js";
import { createDbClient } from "../src/db.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const client = createDbClient();

try {
  const result = await bootstrapLocal(client.db);
  console.log("bootstrap:local complete");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("bootstrap:local failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.close();
  resetAllDbClients();
}
