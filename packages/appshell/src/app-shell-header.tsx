import Link from "next/link";
import styles from "./app-shell.module.css";
import type {
  AppShellCommandItem,
  AppShellContextSwitcherState,
  AppShellWorkspaceContext,
} from "./app-shell.types";
import { AppShellCommandCenter } from "./app-shell-command-center";
import { AppShellContextSwitcher } from "./app-shell-context-switcher";

export interface AppShellHeaderProps {
  readonly commandItems?: readonly AppShellCommandItem[];
  readonly contextSwitcherCompact?: boolean;
  readonly contextSwitcherState?: AppShellContextSwitcherState;
  readonly onContextSwitchRequest?: () => void;
  readonly workspace: AppShellWorkspaceContext;
}

export function AppShellHeader({
  workspace,
  commandItems,
  contextSwitcherCompact = true,
  contextSwitcherState,
  onContextSwitchRequest,
}: AppShellHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.srOnly}>Application header</p>
      <div className={styles.headerStart}>
        <Link aria-label="Afenda ERP home" className={styles.brand} href="/">
          Afenda ERP
        </Link>
        <AppShellContextSwitcher
          compact={contextSwitcherCompact}
          onSwitchRequest={onContextSwitchRequest}
          state={contextSwitcherState}
          workspace={workspace}
        />
      </div>

      <div className={styles.headerEnd}>
        <AppShellCommandCenter items={commandItems} />
      </div>
    </header>
  );
}
