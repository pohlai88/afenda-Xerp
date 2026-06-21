import { MetadataActionBarDiagnosticWarning } from "../actions/metadata-action-bar-warning.js";
import {
  getMetadataActionReasonId,
  getMetadataActionVisibility,
  isMetadataActionDisabled,
  isMetadataActionHidden,
  resolveMetadataActionGroup,
  shouldOpenInNewTab,
  sortRenderableActions,
} from "../actions/metadata-action-presentation.js";
import { MetadataActionReason } from "../actions/metadata-action-reason.js";
import type { MetadataRenderableAction } from "../contracts/action.contract.js";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import { resolveMetadataUiGovernedClassName } from "../wiring/governance.js";

export interface MetadataSurfaceActionBarProps {
  readonly actions: readonly MetadataRenderableAction[];
  readonly context?: MetadataUiRenderContext;
  readonly label?: string;
}

function MetadataSurfaceActionButton({
  action,
}: {
  readonly action: MetadataRenderableAction;
}) {
  if (isMetadataActionHidden(action)) {
    return null;
  }

  const disabled = isMetadataActionDisabled(action);
  const reasonId = action.reason
    ? getMetadataActionReasonId(action.key)
    : undefined;

  if (action.kind === "link") {
    if (!action.href) {
      return null;
    }

    return (
      <>
        <a
          aria-describedby={reasonId}
          aria-disabled={disabled ? "true" : undefined}
          className="metadata-action-link"
          data-action-group={resolveMetadataActionGroup(action)}
          data-action-key={action.key}
          data-action-kind={action.kind}
          data-action-visibility={getMetadataActionVisibility(action)}
          data-slot="metadata-action-link"
          href={disabled ? undefined : action.href}
          rel={shouldOpenInNewTab(action) ? "noreferrer noopener" : undefined}
          tabIndex={disabled ? -1 : undefined}
          target={shouldOpenInNewTab(action) ? "_blank" : undefined}
        >
          {action.label}
        </a>
        {action.reason ? (
          <MetadataActionReason id={reasonId ?? ""} reason={action.reason} />
        ) : null}
      </>
    );
  }

  return (
    <>
      <button
        aria-describedby={reasonId}
        className="metadata-action-button"
        data-action-group={resolveMetadataActionGroup(action)}
        data-action-key={action.key}
        data-action-kind={action.kind}
        data-action-visibility={getMetadataActionVisibility(action)}
        data-slot="metadata-action-button"
        disabled={disabled}
        type="button"
      >
        {action.label}
      </button>
      {action.reason ? (
        <MetadataActionReason id={reasonId ?? ""} reason={action.reason} />
      ) : null}
    </>
  );
}

export function MetadataSurfaceActionBar({
  actions,
  context,
  label = "Metadata actions",
}: MetadataSurfaceActionBarProps) {
  const visibleActions = sortRenderableActions(
    actions
      .filter((action) => !isMetadataActionHidden(action))
      .filter((action) => action.kind !== "menu")
  );

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <>
      <fieldset
        aria-label={label}
        className={resolveMetadataUiGovernedClassName("action-bar", {
          structuralClassNames: ["metadata-action-bar"],
          ...(context ? { density: context.runtime.density } : {}),
        })}
        data-slot="metadata-action-bar"
      >
        {visibleActions.map((action) => (
          <MetadataSurfaceActionButton action={action} key={action.key} />
        ))}
      </fieldset>
      <MetadataActionBarDiagnosticWarning
        actions={actions}
        {...(context ? { context } : {})}
      />
    </>
  );
}
