import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const workspaceRoot = resolve(
  fileURLToPath(new URL("../..", import.meta.url))
);

export function loadAiGovernance() {
  const modulePath = resolve(
    workspaceRoot,
    "packages/ai-governance/dist/index.js"
  );

  return import(pathToFileURL(modulePath).href);
}

export function loadArchitectureAuthority() {
  const modulePath = resolve(
    workspaceRoot,
    "packages/architecture-authority/dist/index.js"
  );

  return import(pathToFileURL(modulePath).href);
}
