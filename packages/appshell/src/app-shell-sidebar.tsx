import styles from "./app-shell.module.css";
import type { AppShellNavItem, AppShellNavItemId } from "./app-shell.types";

export interface AppShellSidebarProps {
  activeItemId?: AppShellNavItemId;
  items: readonly AppShellNavItem[];
}

export function AppShellSidebar({ items, activeItemId }: AppShellSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <nav aria-label="ERP modules">
        <ul className={styles.navList}>
          {items.map((item) => {
            const isActive = activeItemId === item.id;

            return (
              <li key={item.id}>
                <span
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? `${styles.navItem} ${styles.navItemActive}`
                      : styles.navItem
                  }
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
