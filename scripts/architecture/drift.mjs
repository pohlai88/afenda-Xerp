import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getDiscoveredWorkspaces,
  loadArchitectureAuthority,
  workspaceRoot,
} from "./shared.mjs";

const snapshotPath = join(
  workspaceRoot,
  "docs/architecture/dependency-snapshot.json"
);

if (existsSync(snapshotPath)) {
  const authority = await loadArchitectureAuthority();
  const workspaces = await getDiscoveredWorkspaces(authority);
  const live = authority.buildDependencySnapshot(workspaces);
  const committed = JSON.parse(readFileSync(snapshotPath, "utf8"));

  const liveKey = JSON.stringify(live.runtimeEdges);
  const committedKey = JSON.stringify(committed.runtimeEdges);

  if (liveKey === committedKey) {
    console.log("dependency snapshot matches live workspace graph");
  } else {
    console.error(
      "architecture drift detected: runtime dependency graph changed"
    );
    console.error(
      "update docs/architecture/dependency-registry.md and run pnpm architecture:dependencies"
    );
    process.exitCode = 1;
  }
} else {
  console.error(`dependency snapshot missing: ${snapshotPath}`);
  console.error("run: pnpm architecture:dependencies");
  process.exitCode = 1;
}
