import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const workspaceRoot = resolve(
  fileURLToPath(new URL("../..", import.meta.url))
);

export function loadArchitectureAuthority() {
  const modulePath = resolve(
    workspaceRoot,
    "packages/architecture-authority/dist/index.js"
  );

  return import(pathToFileURL(modulePath).href);
}

export function getDiscoveredWorkspaces(authority) {
  return authority.discoverWorkspaces(workspaceRoot);
}
