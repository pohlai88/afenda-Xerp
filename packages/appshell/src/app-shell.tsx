import styles from "./app-shell.module.css";
import {
  type AppShellProps,
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
} from "./app-shell.types";
import { AppShellHeader } from "./app-shell-header";
import { AppShellSidebar } from "./app-shell-sidebar";

export function AppShell({
  activeItemId,
  children,
  commandItems,
  contextSwitcherCompact,
  contextSwitcherState,
  currentPathname,
  identity,
  identityAccessory,
  navItems = DEFAULT_NAV_ITEMS,
  onContextSwitchRequest,
  workspace = DEFAULT_WORKSPACE_CONTEXT,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#app-shell-main">
        Skip to content
      </a>
      <AppShellHeader
        {...(commandItems === undefined ? {} : { commandItems })}
        {...(contextSwitcherCompact === undefined
          ? {}
          : { contextSwitcherCompact })}
        {...(contextSwitcherState === undefined
          ? {}
          : { contextSwitcherState })}
        {...(identity === undefined ? {} : { identity })}
        {...(identityAccessory === undefined ? {} : { identityAccessory })}
        {...(onContextSwitchRequest === undefined
          ? {}
          : { onContextSwitchRequest })}
        workspace={workspace}
      />
      <div className={styles.body}>
        <AppShellSidebar
          {...(activeItemId === undefined ? {} : { activeItemId })}
          {...(currentPathname === undefined ? {} : { currentPathname })}
          items={navItems}
        />
        <main id="app-shell-main">{children}</main>
      </div>
    </div>
  );
}
