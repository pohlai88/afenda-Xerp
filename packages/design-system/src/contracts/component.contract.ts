import type { AccessibilityRequirement } from "./accessibility.contract";
import type { SlotContract } from "./slot.contract";
import type { GovernedState } from "./state.contract";

export interface GovernedComponentContract {
  readonly accessibility: readonly AccessibilityRequirement[];
  readonly classNamePolicy: "layout-only";
  readonly forbidsBusinessLogic: true;
  readonly name: string;
  readonly packageBoundary: "@afenda/ui" | "@afenda/design-system";
  readonly recipe: string;
  readonly slots: readonly SlotContract[];
  readonly supportedStates: readonly GovernedState[];
}
