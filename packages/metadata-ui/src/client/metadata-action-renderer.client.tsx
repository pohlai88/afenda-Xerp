"use client";

import { useState } from "react";

import { MetadataActionBarDiagnosticWarning } from "../actions/metadata-action-bar-warning.js";
import { createMetadataActionInternalError } from "../actions/metadata-action-handler.js";
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
import type {
  MetadataAction,
  MetadataActionContext,
  MetadataActionHandler,
  MetadataActionResultHandler,
  MetadataRenderableAction,
} from "../contracts/action.contract.js";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import { MetadataActionConfirmDialog } from "./metadata-action-confirm-dialog.js";

export interface MetadataActionButtonProps {
  readonly action: MetadataRenderableAction;
  readonly onAction?: MetadataActionHandler;
  readonly onActionResult?: MetadataActionResultHandler;
}

async function invokeMetadataActionHandler(
  action: MetadataAction,
  onAction: MetadataActionHandler | undefined,
  onActionResult: MetadataActionResultHandler | undefined,
  source: MetadataActionContext["source"]
): Promise<void> {
  if (!onAction) {
    return;
  }

  try {
    const result = await onAction(action, { source });
    onActionResult?.(result);
  } catch {
    onActionResult?.(createMetadataActionInternalError(action.key));
  }
}

export function MetadataActionButton({
  action,
  onAction,
  onActionResult,
}: MetadataActionButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isMetadataActionHidden(action)) {
    return null;
  }

  const disabled = isMetadataActionDisabled(action);
  const reasonId = action.reason
    ? getMetadataActionReasonId(action.key)
    : undefined;

  const runAction = async () => {
    await invokeMetadataActionHandler(
      action,
      onAction,
      onActionResult,
      "metadata-action-button"
    );
  };

  const handleButtonClick = async () => {
    if (action.confirm) {
      setConfirmOpen(true);
      return;
    }

    await runAction();
  };

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
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
            }
          }}
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
        onClick={handleButtonClick}
        type="button"
      >
        {action.label}
      </button>
      {action.reason ? (
        <MetadataActionReason id={reasonId ?? ""} reason={action.reason} />
      ) : null}
      <MetadataActionConfirmDialog
        action={action}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={async () => {
          setConfirmOpen(false);
          await runAction();
        }}
        open={confirmOpen}
      />
    </>
  );
}

export interface MetadataActionBarProps {
  readonly actions: readonly MetadataRenderableAction[];
  readonly context?: MetadataUiRenderContext;
  readonly label?: string;
  readonly onAction?: MetadataActionHandler;
  readonly onActionResult?: MetadataActionResultHandler;
}

export function MetadataActionBar({
  actions,
  context,
  label = "Metadata actions",
  onAction,
  onActionResult,
}: MetadataActionBarProps) {
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
        className="metadata-action-bar"
        data-slot="metadata-action-bar"
      >
        {visibleActions.map((action) => (
          <MetadataActionButton
            action={action}
            key={action.key}
            {...(onAction ? { onAction } : {})}
            {...(onActionResult ? { onActionResult } : {})}
          />
        ))}
      </fieldset>
      <MetadataActionBarDiagnosticWarning
        actions={actions}
        {...(context ? { context } : {})}
      />
    </>
  );
}

export interface MetadataActionMenuProps {
  readonly actions: readonly MetadataRenderableAction[];
  readonly label: string;
  readonly onAction?: MetadataActionHandler;
  readonly onActionResult?: MetadataActionResultHandler;
}

export function MetadataActionMenu({
  actions,
  label,
  onAction,
  onActionResult,
}: MetadataActionMenuProps) {
  const menuActions = sortRenderableActions(
    actions
      .filter((action) => !isMetadataActionHidden(action))
      .filter((action) => action.kind === "menu")
  );

  if (menuActions.length === 0) {
    return null;
  }

  return (
    <div className="metadata-action-menu" data-slot="metadata-action-menu">
      <span className="metadata-action-menu-label">{label}</span>
      <ul aria-label={label} className="metadata-action-menu-list">
        {menuActions.map((action) => (
          <li className="metadata-action-menu-item" key={action.key}>
            <MetadataActionButton
              action={action}
              {...(onAction ? { onAction } : {})}
              {...(onActionResult ? { onActionResult } : {})}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
