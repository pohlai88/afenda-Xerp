import { readFileSync } from "node:fs";
import { join } from "node:path";
import { App } from "octokit";
import { resolveDocsGithubAppPrivateKey } from "../src/lib/docs-github-feedback-env";

function loadCredentials(): { appId: string; privateKey: string } {
  const envLocal = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  const appIdLine = envLocal.match(/^DOCS_GITHUB_APP_ID=(.*)$/m);
  const keyLine = envLocal.match(/^DOCS_GITHUB_APP_PRIVATE_KEY=(.*)$/m);

  if (!appIdLine || !keyLine) {
    throw new Error("Missing DOCS_GITHUB_APP_* in apps/docs/.env.local");
  }

  const appId = appIdLine[1].trim().replace(/^"|"$/g, "");
  const privateKey = resolveDocsGithubAppPrivateKey({
    DOCS_GITHUB_APP_PRIVATE_KEY: keyLine[1],
  });

  if (!privateKey) {
    throw new Error("Could not parse DOCS_GITHUB_APP_PRIVATE_KEY");
  }

  return { appId, privateKey };
}

const { appId, privateKey } = loadCredentials();
console.log("appId", appId);
console.log("keyStarts", privateKey.startsWith("-----BEGIN"));

const app = new App({ appId, privateKey });

try {
  const { data } = await app.octokit.request(
    "GET /repos/{owner}/{repo}/installation",
    {
      owner: "pohlai88",
      repo: "afenda-Xerp",
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    }
  );
  console.log("installationId", data.id);
} catch (error) {
  console.error(
    "installation-error",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
}
