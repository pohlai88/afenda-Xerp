import { resetAllDbClients } from "../src/auth-db.js";
import { bootstrapPreview } from "../src/bootstrap/bootstrap-preview.js";
import { createDbClient } from "../src/db.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const client = createDbClient();

try {
  const result = await bootstrapPreview(client.db);
  console.log("bootstrap:preview complete");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("bootstrap:preview failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.close();
  resetAllDbClients();
}
