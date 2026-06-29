import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  getDiscoveredWorkspaces,
  loadArchitectureAuthority,
  workspaceRoot,
} from "./shared.mjs";

const authority = await loadArchitectureAuthority();
const workspaces = await getDiscoveredWorkspaces(authority);
const snapshot = authority.buildDependencySnapshot(workspaces);
const outputPath = join(
  workspaceRoot,
  "packages/architecture-authority/dependency-snapshot.json"
);

writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`wrote ${outputPath}`);
