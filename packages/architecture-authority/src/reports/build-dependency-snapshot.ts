import { ARCHITECTURE_BASELINE_FINGERPRINT } from "../contracts/architecture-authority-version.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { getRuntimeWorkspaceDependencies } from "../workspace/discover-workspaces.js";

export interface DependencySnapshot {
  readonly fingerprint: string;
  readonly generatedAt: string;
  readonly runtimeEdges: ReadonlyArray<{
    readonly from: string;
    readonly to: string;
  }>;
}

export function buildDependencySnapshot(
  workspaces: readonly DiscoveredWorkspace[]
): DependencySnapshot {
  const runtimeEdges: Array<{ from: string; to: string }> = [];

  for (const workspace of workspaces) {
    const from = workspace.packageJson.name;
    for (const to of getRuntimeWorkspaceDependencies(workspace.packageJson)) {
      runtimeEdges.push({ from, to });
    }
  }

  runtimeEdges.sort((a, b) => {
    const fromCompare = a.from.localeCompare(b.from);
    return fromCompare === 0 ? a.to.localeCompare(b.to) : fromCompare;
  });

  return {
    fingerprint: ARCHITECTURE_BASELINE_FINGERPRINT,
    generatedAt: new Date().toISOString(),
    runtimeEdges,
  };
}
