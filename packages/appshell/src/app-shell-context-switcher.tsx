import styles from "./app-shell.module.css";
import type { AppShellWorkspaceContext } from "./app-shell.types";

export interface AppShellContextSwitcherProps {
  workspace: AppShellWorkspaceContext;
}

export function AppShellContextSwitcher({
  workspace,
}: AppShellContextSwitcherProps) {
  return (
    <fieldset className={styles.contextSwitcher}>
      <legend className={styles.contextLegend}>Workspace context</legend>
      <span className={styles.contextLabel}>Tenant: {workspace.tenant}</span>
      <span className={styles.contextLabel}>Company: {workspace.company}</span>
      <span className={styles.contextLabel}>
        Organization: {workspace.organization}
      </span>
    </fieldset>
  );
}
