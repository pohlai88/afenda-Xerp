import {
  getDiscoveredWorkspaces,
  loadArchitectureAuthority,
} from "../architecture/shared.mjs";

const authority = await loadArchitectureAuthority();
const workspaces = await getDiscoveredWorkspaces(authority);
const result = authority.validateArchitecture(workspaces);

if (result.ok) {
  console.log(
    `architecture valid (${workspaces.length} workspaces, fingerprint ${authority.ARCHITECTURE_BASELINE_FINGERPRINT})`
  );
} else {
  console.error("architecture validation failed:");
  for (const violation of result.violations) {
    const pkg = violation.packageName ? ` [${violation.packageName}]` : "";
    console.error(`  - (${violation.gate})${pkg} ${violation.message}`);
  }
  process.exitCode = 1;
}
