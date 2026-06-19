import Link from "next/link";
import styles from "./app-shell.module.css";
import {
  type AppShellCommandItem,
  type AppShellCommandItemState,
  DEFAULT_COMMAND_ITEMS,
  isAppShellCommandItemNavigable,
  resolveAppShellCommandItemState,
  sortAppShellCommandItems,
} from "./app-shell.types";

export interface AppShellCommandCenterProps {
  readonly items?: readonly AppShellCommandItem[];
}

function requireCssClass(className: string | undefined, token: string): string {
  if (className) {
    return className;
  }

  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Missing AppShell CSS class: ${token}`);
  }

  return "";
}

const COMMAND_STATE_CLASS = {
  ready: requireCssClass(styles.commandState_ready, "commandState_ready"),
  disabled: requireCssClass(
    styles.commandState_disabled,
    "commandState_disabled"
  ),
  "coming-soon": requireCssClass(
    styles.commandState_comingSoon,
    "commandState_comingSoon"
  ),
} as const satisfies Record<AppShellCommandItemState, string>;

function commandItemClassName(state: AppShellCommandItemState): string {
  return [styles.commandItem, COMMAND_STATE_CLASS[state]].join(" ");
}

function AppShellCommandItemShell({ item }: { item: AppShellCommandItem }) {
  const state = resolveAppShellCommandItemState(item);
  const className = commandItemClassName(state);

  if (isAppShellCommandItemNavigable(item)) {
    return (
      <Link className={className} href={item.href ?? "#"}>
        {item.label}
      </Link>
    );
  }

  return (
    <span
      aria-disabled={state === "ready" ? undefined : true}
      className={className}
    >
      {item.label}
    </span>
  );
}

export function AppShellCommandCenter({
  items = DEFAULT_COMMAND_ITEMS,
}: AppShellCommandCenterProps) {
  const visibleItems = sortAppShellCommandItems(items);

  return (
    <section aria-label="Command center" className={styles.commandCenter}>
      {visibleItems.map((item) => (
        <AppShellCommandItemShell item={item} key={item.id} />
      ))}
    </section>
  );
}
