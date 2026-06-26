import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ERP_ADMIN_AUTH_STORAGE_RELATIVE } from "@afenda/testing/e2e/auth-paths";
import {
  hasE2EDevLoginCredentials,
  resolveE2EDevLoginCredentials,
  signInWithEmailPassword,
} from "@afenda/testing/e2e/erp-credentials";
import { test as setup } from "@afenda/testing/e2e/playwright-base";

const authFile = path.join(process.cwd(), ERP_ADMIN_AUTH_STORAGE_RELATIVE);

setup("authenticate dev admin for storageState", async ({ page }) => {
  await mkdir(path.dirname(authFile), { recursive: true });

  if (!hasE2EDevLoginCredentials()) {
    await writeFile(
      authFile,
      JSON.stringify({ cookies: [], origins: [] }, null, 2)
    );
    return;
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await signInWithEmailPassword(page, resolveE2EDevLoginCredentials());
  await page.context().storageState({ path: authFile });
});
