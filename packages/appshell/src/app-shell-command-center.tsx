import Link from "next/link";
import styles from "./app-shell.module.css";
import {
  type AppShellCommandItem,
  type AppShellCommandItemState,
  DEFAULT_COMMAND_ITEMS,
  isAppShellCommandItemNavigable,
  resolveAppShellCommandItemState,
  resolveAppShellCommandItemTitle,
  sortAppShellCommandItems,
} from "./app-shell.types";

const COMMAND_CENTER_HEADING_ID = "app-shell-command-center";

export interface AppShellCommandCenterProps {
  readonly items?: readonly AppShellCommandItem[];
}

function requireCssClass(className: string | undefined, token: string): string {
  if (className) {
    return className;
  }

  if (process.env['NODE_ENV'] !== "production") {
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

function joinCommandClasses(
  ...parts: Array<string | false | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

function commandItemClassName(state: AppShellCommandItemState): string {
  return joinCommandClasses(styles.commandItem, COMMAND_STATE_CLASS[state]);
}

function AppShellCommandItemContent({
  item,
  state,
}: {
  item: AppShellCommandItem;
  state: AppShellCommandItemState;
}) {
  return (
    <>
      <span className={styles.commandLabel}>{item.label}</span>
      {item.keyboardShortcut ? (
        <kbd className={styles.commandShortcut}>{item.keyboardShortcut}</kbd>
      ) : null}
      {state === "coming-soon" ? (
        <span className={styles.commandStateTag}>Soon</span>
      ) : null}
    </>
  );
}

function AppShellCommandItemShell({ item }: { item: AppShellCommandItem }) {
  const state = resolveAppShellCommandItemState(item);
  const className = commandItemClassName(state);
  const title = resolveAppShellCommandItemTitle(item);
  const content = <AppShellCommandItemContent item={item} state={state} />;

  if (isAppShellCommandItemNavigable(item)) {
    return (
      <Link
        className={className}
        data-command-group={item.group}
        data-command-id={item.id}
        data-command-kind={item.kind}
        href={item.href}
        title={title}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      aria-disabled={state === "ready" ? undefined : true}
      className={className}
      data-command-group={item.group}
      data-command-id={item.id}
      data-command-kind={item.kind}
      title={title}
    >
      {content}
    </span>
  );
}

export function AppShellCommandCenter({
  items = DEFAULT_COMMAND_ITEMS,
}: AppShellCommandCenterProps) {
  const visibleItems = sortAppShellCommandItems(items);

  return (
    <section
      aria-labelledby={COMMAND_CENTER_HEADING_ID}
      className={styles.commandCenter}
    >
      <h2 className={styles.srOnly} id={COMMAND_CENTER_HEADING_ID}>
        Command center
      </h2>
      {visibleItems.map((item) => (
        <AppShellCommandItemShell item={item} key={item.id} />
      ))}
    </section>
  );
}
