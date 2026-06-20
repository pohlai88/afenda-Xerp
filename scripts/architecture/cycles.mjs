import {
  getDiscoveredWorkspaces,
  loadArchitectureAuthority,
} from "./shared.mjs";

const authority = await loadArchitectureAuthority();
const workspaces = await getDiscoveredWorkspaces(authority);
const result = authority.validateCycles(workspaces);

if (result.ok) {
  console.log("no circular workspace dependencies detected");
} else {
  console.error("cycle analysis failed:");
  for (const violation of result.violations) {
    console.error(`  - ${violation.message}`);
  }
  process.exitCode = 1;
}
