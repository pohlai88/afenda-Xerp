import type {
  MetadataAction,
  MetadataActionGroup,
  MetadataActionVisibilityState,
  MetadataRenderableAction,
} from "../contracts/action.contract.js";

export const METADATA_ACTION_REASON_SUFFIX = "reason";

export function getMetadataActionVisibility(
  action: MetadataAction
): MetadataActionVisibilityState {
  return action.visibility ?? "visible";
}

export function getMetadataActionReasonId(actionKey: string): string {
  return `${actionKey}-${METADATA_ACTION_REASON_SUFFIX}`;
}

export function isMetadataActionDisabled(action: MetadataAction): boolean {
  return getMetadataActionVisibility(action) === "disabled";
}

export function isMetadataActionHidden(action: MetadataAction): boolean {
  return getMetadataActionVisibility(action) === "hidden";
}

export function shouldOpenInNewTab(action: MetadataAction): boolean {
  return action.target === "blank";
}

export function compareRenderableActions(
  left: MetadataRenderableAction,
  right: MetadataRenderableAction
): number {
  return (
    (left.presentation?.order ?? Number.MAX_SAFE_INTEGER) -
    (right.presentation?.order ?? Number.MAX_SAFE_INTEGER)
  );
}

export function sortRenderableActions(
  actions: readonly MetadataRenderableAction[]
): MetadataRenderableAction[] {
  return [...actions].sort(compareRenderableActions);
}

const PRIMARY_ACTION_GROUP: MetadataActionGroup = "primary";

export function resolveMetadataActionGroup(
  action: MetadataRenderableAction
): MetadataActionGroup {
  const group = action.presentation?.group;

  if (group === "primary" || group === "secondary" || group === "tertiary") {
    return group;
  }

  if (group === "help") {
    return "tertiary";
  }

  return action.kind === "link" ? "tertiary" : "secondary";
}

export function countVisiblePrimaryActions(
  actions: readonly MetadataRenderableAction[]
): number {
  return actions.filter(
    (action) =>
      !isMetadataActionHidden(action) &&
      action.kind !== "menu" &&
      resolveMetadataActionGroup(action) === PRIMARY_ACTION_GROUP
  ).length;
}

export function createMultiplePrimaryActionsWarning(
  actions: readonly MetadataRenderableAction[]
): string | undefined {
  const primaryCount = countVisiblePrimaryActions(actions);

  if (primaryCount > 1) {
    return `Metadata action bar has ${primaryCount} visible primary actions; only one primary action is recommended per bar.`;
  }

  return undefined;
}
