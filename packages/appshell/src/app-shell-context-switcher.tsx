import { useId } from "react";

import { Button } from "@afenda/ui";

import type { AppShellWorkspaceContext } from "./app-shell.types";
import {
  type AppShellContextSwitcherState,
  resolveAppShellContextSwitcherState,
  resolveAppShellContextSwitcherStatusMessage,
} from "./app-shell.types";


export interface AppShellContextSwitcherProps {
  readonly compact?: boolean;
  readonly onSwitchRequest?: () => void;
  readonly state?: AppShellContextSwitcherState;
  readonly workspace: AppShellWorkspaceContext;
}

function ContextValue({
  contextId,
  kind,
  label,
}: {
  contextId: string;
  kind: "company" | "organization" | "tenant";
  label: string;
}) {
  return (
    <span
      data-context-id={contextId}
      data-context-kind={kind}
      title={`${kind} id: ${contextId}`}
    >
      <span className="sr-only">{kind} </span>
      {label}
    </span>
  );
}

export function AppShellContextSwitcher({
  workspace,
  compact = true,
  state: contextState,
  onSwitchRequest,
}: AppShellContextSwitcherProps) {
  const headingId = useId();
  const state = resolveAppShellContextSwitcherState(contextState);
  const statusMessage = resolveAppShellContextSwitcherStatusMessage(state);
  const canSwitch = state === "ready" && Boolean(onSwitchRequest);

  return (
    <section
      aria-labelledby={headingId}
      className="flex min-w-0 items-center"
      data-context-state={state}
    >
      <h2 className="sr-only" id={headingId}>
        Workspace context
      </h2>

      {statusMessage ? (
        <p role="status">{statusMessage}</p>
      ) : (
        <>
          <ContextValue
            contextId={workspace.companyId}
            kind="company"
            label={workspace.companyLabel}
          />
          <span aria-hidden="true">/</span>
          <ContextValue
            contextId={workspace.organizationId}
            kind="organization"
            label={workspace.organizationLabel}
          />

          {compact ? null : (
            <ContextValue
              contextId={workspace.tenantId}
              kind="tenant"
              label={workspace.tenantLabel}
            />
          )}
        </>
      )}

      {canSwitch ? (
        <Button
          emphasis="outline"
          intent="secondary"
          onClick={onSwitchRequest}
          size="sm"
          type="button"
        >
          Switch workspace
        </Button>
      ) : null}
    </section>
  );
}
