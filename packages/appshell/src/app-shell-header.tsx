import styles from "./app-shell.module.css";
import type { AppShellWorkspaceContext } from "./app-shell.types";
import { DEFAULT_WORKSPACE_CONTEXT } from "./app-shell.types";
import { AppShellCommandCenter } from "./app-shell-command-center";
import { AppShellContextSwitcher } from "./app-shell-context-switcher";

export interface AppShellHeaderProps {
  workspace?: AppShellWorkspaceContext;
}

export function AppShellHeader({
  workspace = DEFAULT_WORKSPACE_CONTEXT,
}: AppShellHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerStart}>
        <p className={styles.brand}>Afenda ERP</p>
        <AppShellContextSwitcher workspace={workspace} />
      </div>
      <div className={styles.headerEnd}>
        <AppShellCommandCenter />
      </div>
    </header>
  );
}
