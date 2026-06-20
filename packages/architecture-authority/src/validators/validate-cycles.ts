import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { getRuntimeWorkspaceDependencies } from "../workspace/discover-workspaces.js";

export function validateCycles(workspaces: readonly DiscoveredWorkspace[]) {
  const graph = new Map<string, string[]>();

  for (const workspace of workspaces) {
    graph.set(
      workspace.packageJson.name,
      getRuntimeWorkspaceDependencies(workspace.packageJson)
    );
  }

  const visited = new Set<string>();
  const stack = new Set<string>();
  const violations: ArchitectureViolation[] = [];

  function visit(node: string, path: string[]): void {
    if (stack.has(node)) {
      const cycleStart = path.indexOf(node);
      const cycle = [...path.slice(cycleStart), node].join(" → ");
      violations.push({
        gate: "cycles",
        packageName: node,
        message: `circular dependency detected: ${cycle}`,
      });
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    stack.add(node);

    const neighbors = graph.get(node) ?? [];
    for (const neighbor of neighbors) {
      visit(neighbor, [...path, node]);
    }

    stack.delete(node);
  }

  for (const node of graph.keys()) {
    visit(node, []);
  }

  return createValidationResult(violations);
}
