import Link from "next/link";
import styles from "./app-shell.module.css";
import {
  type AppShellNavItem,
  type AppShellNavItemId,
  type AppShellNavItemState,
  filterVisibleAppShellNavItems,
  isAppShellNavItemNavigable,
  resolveAppShellActiveNavItemId,
  resolveAppShellNavBadgeLabel,
  resolveAppShellNavItemState,
} from "./app-shell.types";
import {
  NAV_ICON_CLASS,
  NAV_STATE_CLASS,
  NAV_TONE_CLASS,
} from "./app-shell-sidebar.styles";

export interface AppShellSidebarProps {
  readonly activeItemId?: AppShellNavItemId;
  readonly currentPathname?: string;
  readonly items: readonly AppShellNavItem[];
}

const ERP_MODULE_NAV_HEADING_ID = "erp-module-navigation";

function joinNavClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function navItemClassName(item: AppShellNavItem, isActive: boolean): string {
  const state = resolveAppShellNavItemState(item);
  const tone = item.tone ?? "neutral";

  return joinNavClasses(
    styles.navItem,
    NAV_STATE_CLASS[state],
    NAV_TONE_CLASS[tone],
    isActive && styles.navItemActive
  );
}

function AppShellNavItemContent({
  item,
  state,
}: {
  item: AppShellNavItem;
  state: AppShellNavItemState;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`${styles.navIcon} ${NAV_ICON_CLASS[item.icon]}`}
      />
      <span className={styles.navLabel}>{item.label}</span>
      {item.badgeLabel ? (
        <span className={styles.navBadge}>
          <span className={styles.srOnly}>
            {resolveAppShellNavBadgeLabel(item.badgeLabel)}
          </span>
          <span aria-hidden="true">{item.badgeLabel}</span>
        </span>
      ) : null}
      {state === "coming-soon" ? (
        <span className={styles.navStateTag}>Soon</span>
      ) : null}
    </>
  );
}

function AppShellNavItemShell({
  item,
  isActive,
  state,
}: {
  item: AppShellNavItem;
  isActive: boolean;
  state: AppShellNavItemState;
}) {
  const className = navItemClassName(item, isActive);
  const content = <AppShellNavItemContent item={item} state={state} />;

  if (isAppShellNavItemNavigable(item)) {
    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={className}
        href={item.href}
        title={item.description}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      aria-disabled={state === "ready" ? undefined : true}
      className={className}
      title={item.description}
    >
      {content}
    </span>
  );
}

export function AppShellSidebar({
  items,
  activeItemId,
  currentPathname,
}: AppShellSidebarProps) {
  const visibleItems = filterVisibleAppShellNavItems(items);
  const resolvedActiveItemId = resolveAppShellActiveNavItemId(items, {
    activeItemId,
    currentPathname,
  });

  return (
    <aside className={styles.sidebar}>
      <nav aria-labelledby={ERP_MODULE_NAV_HEADING_ID}>
        <h2 className={styles.srOnly} id={ERP_MODULE_NAV_HEADING_ID}>
          ERP modules
        </h2>
        <ul className={styles.navList}>
          {visibleItems.map((item) => {
            const isActive = resolvedActiveItemId === item.id;
            const state = resolveAppShellNavItemState(item);

            return (
              <li
                data-nav-kind={item.kind}
                data-nav-order={item.order}
                key={item.id}
              >
                <AppShellNavItemShell
                  isActive={isActive}
                  item={item}
                  state={state}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
