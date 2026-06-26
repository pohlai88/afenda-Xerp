#!/usr/bin/env node
import { loadMergedEnv, resolveRepoRoot } from "./env-utils.mjs";

const { entries } = loadMergedEnv(resolveRepoRoot(), {});
const appId = entries.get("DOCS_GITHUB_APP_ID")?.trim();
let privateKey = entries.get("DOCS_GITHUB_APP_PRIVATE_KEY")?.trim();

if (!(appId && privateKey)) {
  console.error("Missing DOCS_GITHUB_APP_ID or DOCS_GITHUB_APP_PRIVATE_KEY");
  process.exit(1);
}

if (privateKey.includes("\\n")) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

console.log("appId", appId);
console.log("keyStarts", privateKey.startsWith("-----BEGIN"));
console.log("keyLines", privateKey.split("\n").length);

try {
  // biome-ignore lint/correctness/noUndeclaredDependencies: octokit is declared in @afenda/docs; probe script only
  const { App } = await import("octokit");
  const app = new App({ appId, privateKey });
  const { data } = await app.octokit.request(
    "GET /repos/{owner}/{repo}/installation",
    {
      owner: "pohlai88",
      repo: "afenda-Xerp",
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    }
  );
  console.log("installationId", data.id);
  console.log("ok");
} catch (error) {
  console.error("github-error", error instanceof Error ? error.message : error);
  process.exit(1);
}
