import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import type { MetadataRenderableAction } from "../contracts/action.contract.js";
import { MetadataBoundaryWarning } from "../diagnostics/metadata-diagnostics-panel.js";
import { createMultiplePrimaryActionsWarning } from "./metadata-action-presentation.js";

export interface MetadataActionBarDiagnosticWarningProps {
  readonly actions: readonly MetadataRenderableAction[];
  readonly context?: MetadataUiRenderContext;
}

export function MetadataActionBarDiagnosticWarning({
  actions,
  context,
}: MetadataActionBarDiagnosticWarningProps) {
  if (context?.diagnostics.enabled !== true) {
    return null;
  }

  const message = createMultiplePrimaryActionsWarning(actions);

  if (message === undefined) {
    return null;
  }

  return <MetadataBoundaryWarning context={context} message={message} />;
}
