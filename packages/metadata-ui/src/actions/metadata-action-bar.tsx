"use client";

import type { MetadataAction } from "../contracts/action-renderer.contract.js";

export interface MetadataActionButtonProps {
  readonly action: MetadataAction;
  readonly onAction?: (actionKey: string) => void;
}

export function MetadataActionButton({
  action,
  onAction,
}: MetadataActionButtonProps) {
  if (action.hidden) {
    return null;
  }

  if (action.kind === "link") {
    if (!action.href) {
      return null;
    }

    return (
      <a
        aria-disabled={action.disabled}
        className="metadata-action-link"
        data-slot="metadata-action-link"
        href={action.href}
      >
        {action.label}
      </a>
    );
  }

  return (
    <button
      aria-describedby={action.reason ? `${action.key}-reason` : undefined}
      className="metadata-action-button"
      data-action-kind={action.kind}
      data-slot="metadata-action-button"
      disabled={action.disabled}
      type="button"
      onClick={() => onAction?.(action.key)}
    >
      {action.label}
      {action.reason ? (
        <span hidden id={`${action.key}-reason`}>
          {action.reason}
        </span>
      ) : null}
    </button>
  );
}

export interface MetadataActionBarProps {
  readonly actions: readonly MetadataAction[];
  readonly onAction?: (actionKey: string) => void;
}

export function MetadataActionBar({ actions, onAction }: MetadataActionBarProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  return (
    <div
      aria-label="Metadata actions"
      className="metadata-action-bar"
      data-slot="metadata-action-bar"
      role="toolbar"
    >
      {visibleActions.map((action) => (
        <MetadataActionButton
          action={action}
          key={action.key}
          {...(onAction ? { onAction } : {})}
        />
      ))}
    </div>
  );
}

export interface MetadataActionMenuProps {
  readonly actions: readonly MetadataAction[];
  readonly label: string;
  readonly onAction?: (actionKey: string) => void;
}

export function MetadataActionMenu({
  actions,
  label,
  onAction,
}: MetadataActionMenuProps) {
  const menuActions = actions.filter(
    (action) => !action.hidden && action.kind === "menu"
  );

  return (
    <div className="metadata-action-menu" data-slot="metadata-action-menu">
      <span>{label}</span>
      <ul>
        {menuActions.map((action) => (
          <li key={action.key}>
            <MetadataActionButton
              action={action}
              {...(onAction ? { onAction } : {})}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
