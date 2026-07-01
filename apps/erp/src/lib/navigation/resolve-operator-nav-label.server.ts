import type { OperatorNavLabelDefinition } from "./operator-nav-label.registry";

/**
 * Returns the PAS-004E registered operator nav label.
 * `labelAtomId` links ERP module foundation maps; runtime copy stays on registered terms until ERP profile nav labels exist.
 */
export function resolveOperatorNavLabel(
  definition: OperatorNavLabelDefinition
): string {
  return definition.label;
}
