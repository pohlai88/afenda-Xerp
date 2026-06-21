import type { AppShellWorkspaceContext } from "./app-shell.types";
import {
  type AppShellContextSwitcherState,
  resolveAppShellContextSwitcherState,
  resolveAppShellContextSwitcherStatusMessage,
} from "./app-shell.types";

const WORKSPACE_CONTEXT_HEADING_ID = "workspace-context";

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
      className="truncate font-medium"
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
  const state = resolveAppShellContextSwitcherState(contextState);
  const statusMessage = resolveAppShellContextSwitcherStatusMessage(state);
  const canSwitch = state === "ready" && Boolean(onSwitchRequest);

  return (
    <section
      aria-labelledby={WORKSPACE_CONTEXT_HEADING_ID}
      className="flex w-full min-w-0 flex-wrap items-center gap-1 rounded-md border border-sidebar-border bg-sidebar-accent/40 px-2 py-1.5 text-xs text-sidebar-foreground"
      data-context-state={state}
    >
      <h2 className="sr-only" id={WORKSPACE_CONTEXT_HEADING_ID}>
        Workspace context
      </h2>

      {statusMessage ? (
        <p className="text-muted-foreground italic" role="status">
          {statusMessage}
        </p>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-1">
            <ContextValue
              contextId={workspace.companyId}
              kind="company"
              label={workspace.companyLabel}
            />
            <span aria-hidden="true" className="text-muted-foreground">
              /
            </span>
            <ContextValue
              contextId={workspace.organizationId}
              kind="organization"
              label={workspace.organizationLabel}
            />
          </div>

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
        <button
          className="ml-auto shrink-0 rounded-md border border-sidebar-border px-2 py-0.5 text-xs hover:bg-sidebar-accent"
          onClick={onSwitchRequest}
          type="button"
        >
          Switch workspace
        </button>
      ) : null}
    </section>
  );
}
