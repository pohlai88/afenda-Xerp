import { createDbClient, resetAllDbClients } from "@afenda/database";

import {
  assertDevAuthBootstrapAllowed,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
  resolveDevViewerLoginPassword,
} from "../src/bootstrap/dev-login.env.js";
import {
  DEV_VIEWER_LOGIN_DISPLAY_NAME,
  DEV_VIEWER_LOGIN_EMAIL,
} from "../src/bootstrap/dev-login.fixture.js";
import { ensureDevAuthLogin } from "../src/bootstrap/ensure-dev-auth-login.js";
import { ensureDevTenantSignInPresentation } from "../src/bootstrap/ensure-dev-tenant-sign-in-presentation.js";
import { loadAuthScriptEnv } from "./load-env.js";

loadAuthScriptEnv();
assertDevAuthBootstrapAllowed();

const email = resolveDevLoginEmail();
const password = resolveDevLoginPassword();
const client = createDbClient();

try {
  const presentation = await ensureDevTenantSignInPresentation(client.db);
  console.log(
    JSON.stringify(
      {
        tenantSignInPresentation: presentation,
      },
      null,
      2
    )
  );

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

  const viewerPassword = resolveDevViewerLoginPassword();
  const viewerResult = await ensureDevAuthLogin(
    {
      email: DEV_VIEWER_LOGIN_EMAIL,
      password: viewerPassword,
      displayName: DEV_VIEWER_LOGIN_DISPLAY_NAME,
    },
    client.db
  );

  console.log(
    JSON.stringify(
      {
        email: DEV_VIEWER_LOGIN_EMAIL,
        ...viewerResult,
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
