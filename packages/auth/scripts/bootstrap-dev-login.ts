import { createDbClient, resetAllDbClients } from "@afenda/database";

import {
  assertDevAuthBootstrapAllowed,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
} from "../src/bootstrap/dev-login.env.js";
import { ensureDevAuthLogin } from "../src/bootstrap/ensure-dev-auth-login.js";
import { loadAuthScriptEnv } from "./load-env.js";

loadAuthScriptEnv();
assertDevAuthBootstrapAllowed();

const email = resolveDevLoginEmail();
const password = resolveDevLoginPassword();
const client = createDbClient();

try {
  const result = await ensureDevAuthLogin({ email, password }, client.db);

  console.log("auth:bootstrap:dev complete");
  console.log(
    JSON.stringify(
      {
        email,
        ...result,
      },
      null,
      2
    )
  );
} catch (error) {
  console.error("auth:bootstrap:dev failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.close();
  resetAllDbClients();
}
