import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  getDiscoveredWorkspaces,
  loadArchitectureAuthority,
  workspaceRoot,
} from "./shared.mjs";

const authority = await loadArchitectureAuthority();
const workspaces = await getDiscoveredWorkspaces(authority);
const report = authority.buildArchitectureReport(workspaces);
const outputPath = join(
  workspaceRoot,
  "packages/architecture-authority/architecture-report.json"
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`wrote ${outputPath}`);
