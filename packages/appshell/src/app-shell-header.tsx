import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./app-shell.module.css";
import type {
  AppShellCommandItem,
  AppShellContextSwitcherState,
  AppShellIdentity,
  AppShellWorkspaceContext,
} from "./app-shell.types";
import { AppShellCommandCenter } from "./app-shell-command-center";
import { AppShellContextSwitcher } from "./app-shell-context-switcher";

export interface AppShellHeaderProps {
  readonly commandItems?: readonly AppShellCommandItem[];
  readonly contextSwitcherCompact?: boolean;
  readonly contextSwitcherState?: AppShellContextSwitcherState;
  readonly identity?: AppShellIdentity;
  readonly identityAccessory?: ReactNode;
  readonly onContextSwitchRequest?: () => void;
  readonly workspace: AppShellWorkspaceContext;
}

export function AppShellHeader({
  workspace,
  commandItems,
  contextSwitcherCompact = true,
  contextSwitcherState,
  identity,
  identityAccessory,
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
          {...(onContextSwitchRequest === undefined
            ? {}
            : { onSwitchRequest: onContextSwitchRequest })}
          {...(contextSwitcherState === undefined
            ? {}
            : { state: contextSwitcherState })}
          workspace={workspace}
        />
      </div>

      <div className={styles.headerEnd}>
        <AppShellCommandCenter
          {...(commandItems === undefined ? {} : { items: commandItems })}
        />
        {identity ? (
          <div className={styles.identity} title={identity.email}>
            <span className={styles.identityName}>{identity.displayName}</span>
            <span className={styles.identityEmail}>{identity.email}</span>
            {identityAccessory}
          </div>
        ) : null}
      </div>
    </header>
  );
}
