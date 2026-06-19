import styles from "./app-shell.module.css";
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
      className={styles.contextValue}
      data-context-id={contextId}
      data-context-kind={kind}
      title={`${kind} id: ${contextId}`}
    >
      <span className={styles.srOnly}>{kind} </span>
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
      className={styles.contextSwitcher}
      data-context-state={state}
    >
      <h2 className={styles.contextLegend} id={WORKSPACE_CONTEXT_HEADING_ID}>
        Workspace context
      </h2>

      {statusMessage ? (
        <p className={styles.contextStatus} role="status">
          {statusMessage}
        </p>
      ) : (
        <>
          <div className={styles.contextPrimary}>
            <ContextValue
              contextId={workspace.companyId}
              kind="company"
              label={workspace.companyLabel}
            />
            <span aria-hidden="true" className={styles.contextDivider}>
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
          className={styles.contextSwitchAction}
          onClick={onSwitchRequest}
          type="button"
        >
          Switch workspace
        </button>
      ) : null}
    </section>
  );
}
